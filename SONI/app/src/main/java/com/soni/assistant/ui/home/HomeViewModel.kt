package com.soni.assistant.ui.home

import android.Manifest
import android.app.Application
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.soni.assistant.core.ActionLogEntry
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.PermissionManager
import com.soni.assistant.core.SoniEngine
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.data.preferences.SoniPreferences
import com.soni.assistant.data.repository.ActionLogRepository
import com.soni.assistant.voice.SpeechEvent
import com.soni.assistant.voice.SpeechInput
import com.soni.assistant.voice.SpeechOutput
import com.soni.assistant.voice.WakeWordController
import com.soni.assistant.voice.WakeWordService
import com.soni.assistant.voice.WakeWordState
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class HomeViewModel(application: Application) : AndroidViewModel(application) {

    private val actionLog = ActionLogRepository.create(application)
    private val engine = SoniEngine.createDefault(PermissionManager(application), actionLog)
    private val speechInput = SpeechInput(application)
    private val speechOutput = SpeechOutput(application)
    private val preferences = SoniPreferences(application)

    private var nextMessageId = 0L
    private var idleJob: Job? = null
    private var voiceWarningShown = false

    private val _uiState = MutableStateFlow(
        HomeUiState(
            voiceInputAvailable = speechInput.isAvailable(),
            messages = listOf(ChatMessage(newId(), MessageKind.INFO, WELCOME)),
        )
    )
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    val isSpeaking: StateFlow<Boolean> = speechOutput.isSpeaking

    /** Registro de acciones (más recientes primero), sin el texto de las órdenes. */
    val actionLogEntries: StateFlow<List<ActionLogEntry>> =
        actionLog.recent.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    /** Estado real de la escucha de «SONI» en segundo plano, publicado por el servicio. */
    val wakeWordState: StateFlow<WakeWordState> = WakeWordController.state

    init {
        viewModelScope.launch {
            // Mientras la pantalla escucha o habla, el servicio suelta el micrófono para no
            // competir por él ni oír a SONI decir su propio nombre.
            combine(_uiState, speechOutput.isSpeaking) { state, speaking ->
                speaking || state.status == AssistantStatus.LISTENING || state.status == AssistantStatus.PROCESSING
            }.distinctUntilChanged().collect(WakeWordController::setUiHoldsMic)
        }
        viewModelScope.launch {
            // Si el usuario la dejó activada (por ejemplo, antes de reiniciar), se reanuda al abrir SONI.
            if (preferences.isBackgroundListeningEnabled() && !WakeWordController.isRunning && hasMicPermission()) {
                WakeWordService.start(getApplication())
            }
        }
        viewModelScope.launch {
            speechOutput.state.collect { state ->
                if (state is SpeechOutput.State.Unavailable && !voiceWarningShown) {
                    voiceWarningShown = true
                    addMessage(MessageKind.INFO, state.reason, "Voz no disponible")
                }
            }
        }
    }

    fun submitText(rawText: String) {
        val text = rawText.trim()
        if (text.isEmpty()) return
        if (_uiState.value.status == AssistantStatus.LISTENING) speechInput.cancel()
        speechOutput.stop()
        idleJob?.cancel()

        addMessage(MessageKind.USER, text)
        runCommand(text) { engine.process(text) }
    }

    /** El usuario confirmó la acción de riesgo alto que se le mostró. */
    fun confirmPendingAction() {
        val request = _uiState.value.pendingConfirmation ?: return
        _uiState.update { it.copy(pendingConfirmation = null) }
        runCommand(retryText = null) { engine.confirm(request.id) }
    }

    fun cancelPendingAction() {
        val request = _uiState.value.pendingConfirmation ?: return
        _uiState.update { it.copy(pendingConfirmation = null) }
        runCommand(retryText = null) { engine.cancel(request.id) }
    }

    /** Respuesta del diálogo de permisos de Android a una [PermissionRequest]. */
    fun onPermissionsResult(allGranted: Boolean) {
        val request = _uiState.value.permissionRequest ?: return
        _uiState.update { it.copy(permissionRequest = null) }
        if (allGranted) {
            runCommand(request.retryText) { engine.process(request.retryText) }
        } else {
            addMessage(MessageKind.INFO, "Sin ese permiso no puedo hacerlo, así que no hice nada.", "Permiso denegado")
        }
    }

    fun clearActionLog() {
        viewModelScope.launch { actionLog.clear() }
    }

    private fun runCommand(retryText: String?, block: suspend () -> ActionResult) {
        _uiState.update {
            it.copy(status = AssistantStatus.PROCESSING, statusDetail = null, partialTranscript = "", micLevel = 0f)
        }
        viewModelScope.launch { showResult(block(), retryText) }
    }

    private fun showResult(result: ActionResult, retryText: String?) {
        val kind = when (result) {
            is ActionResult.Success -> MessageKind.SUCCESS
            is ActionResult.Failed -> MessageKind.ERROR
            else -> MessageKind.INFO
        }
        addMessage(kind, result.message, result.actionLabel)
        when (result) {
            is ActionResult.NeedsPermission -> _uiState.update {
                it.copy(
                    status = AssistantStatus.IDLE,
                    permissionRequest = retryText?.let { text -> PermissionRequest(result.permissions, text) },
                )
            }
            is ActionResult.NeedsConfirmation -> _uiState.update {
                it.copy(
                    status = AssistantStatus.IDLE,
                    pendingConfirmation = ConfirmationRequest(result.confirmationId, result.message),
                )
            }
            else -> {
                _uiState.update {
                    it.copy(status = if (result is ActionResult.Success) AssistantStatus.SUCCESS else AssistantStatus.ERROR)
                }
                scheduleReturnToIdle()
            }
        }
        speechOutput.speak(result.spokenMessage)
    }

    /** Requiere que el permiso de micrófono ya esté concedido (lo comprueba la pantalla). */
    fun startListening() {
        if (!_uiState.value.voiceInputAvailable) {
            addMessage(
                MessageKind.ERROR,
                "Este teléfono no tiene un servicio de reconocimiento de voz disponible. Puedes escribir tus órdenes.",
                "Voz no disponible",
            )
            return
        }
        speechOutput.stop()
        idleJob?.cancel()
        _uiState.update {
            it.copy(status = AssistantStatus.LISTENING, statusDetail = null, partialTranscript = "", micLevel = 0f)
        }
        speechInput.start(SoniLocale.languageTag, ::onSpeechEvent)
    }

    fun stopListening() {
        speechInput.stop()
    }

    fun cancelListening() {
        speechInput.cancel()
        _uiState.update { it.copy(status = AssistantStatus.IDLE, partialTranscript = "", micLevel = 0f) }
    }

    fun stopSpeaking() {
        speechOutput.stop()
    }

    fun onMicPermissionDenied(permanently: Boolean) {
        val text = if (permanently) {
            "El permiso de micrófono está bloqueado. Puedes activarlo en los ajustes de Android o seguir escribiendo tus órdenes."
        } else {
            "Sin permiso de micrófono no puedo escucharte, pero puedes escribir tus órdenes."
        }
        addMessage(MessageKind.INFO, text, "Micrófono sin permiso")
    }

    /** Requiere que el permiso de micrófono ya esté concedido y que SONI esté visible. */
    fun enableBackgroundListening() {
        viewModelScope.launch { preferences.setBackgroundListening(true) }
        WakeWordService.start(getApplication())
    }

    fun disableBackgroundListening() {
        viewModelScope.launch { preferences.setBackgroundListening(false) }
        WakeWordService.stop(getApplication())
    }

    fun onAppBackground() {
        if (_uiState.value.status == AssistantStatus.LISTENING) cancelListening()
        speechOutput.stop()
    }

    private fun onSpeechEvent(event: SpeechEvent) {
        when (event) {
            SpeechEvent.Ready -> Unit
            is SpeechEvent.Level -> _uiState.update { it.copy(micLevel = event.value) }
            is SpeechEvent.Partial -> _uiState.update { it.copy(partialTranscript = event.text) }
            is SpeechEvent.Final -> {
                _uiState.update { it.copy(status = AssistantStatus.PROCESSING, partialTranscript = "", micLevel = 0f) }
                submitText(event.text)
            }
            is SpeechEvent.Error -> {
                _uiState.update {
                    it.copy(
                        status = AssistantStatus.ERROR,
                        statusDetail = event.message,
                        partialTranscript = "",
                        micLevel = 0f,
                    )
                }
                scheduleReturnToIdle()
            }
        }
    }

    private fun scheduleReturnToIdle() {
        idleJob?.cancel()
        idleJob = viewModelScope.launch {
            delay(IDLE_DELAY_MS)
            _uiState.update { state ->
                if (state.status == AssistantStatus.SUCCESS || state.status == AssistantStatus.ERROR) {
                    state.copy(status = AssistantStatus.IDLE, statusDetail = null)
                } else {
                    state
                }
            }
        }
    }

    private fun addMessage(kind: MessageKind, text: String, actionLabel: String? = null) {
        val message = ChatMessage(newId(), kind, text, actionLabel)
        _uiState.update { it.copy(messages = (it.messages + message).takeLast(MAX_MESSAGES)) }
    }

    private fun newId(): Long = nextMessageId++

    private fun hasMicPermission(): Boolean =
        ContextCompat.checkSelfPermission(getApplication(), Manifest.permission.RECORD_AUDIO) ==
            PackageManager.PERMISSION_GRANTED

    override fun onCleared() {
        WakeWordController.setUiHoldsMic(false)
        speechInput.destroy()
        speechOutput.shutdown()
        super.onCleared()
    }

    private companion object {
        const val WELCOME =
            "Hola, soy SONI. Pulsa el micrófono o escribe una orden. Por ahora puedo decirte la hora, la fecha y hacer cálculos."
        const val IDLE_DELAY_MS = 4_000L
        const val MAX_MESSAGES = 100
    }
}
