package com.soni.assistant.voice

import android.Manifest
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.IBinder
import android.speech.SpeechRecognizer
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.PermissionManager
import com.soni.assistant.core.SoniEngine
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.data.preferences.SoniPreferences
import com.soni.assistant.data.repository.ActionLogRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull

/**
 * Servicio en primer plano (tipo micrófono) que espera la palabra «SONI» con Vosk.
 * Al detectarla suelta el micrófono, reconoce la orden con [SpeechInput], la resuelve con
 * [SoniEngine], responde con voz y vuelve a esperar.
 *
 * Android exige que se inicie mientras SONI está visible (actividad, botón de ajustes rápidos
 * o notificación); desde segundo plano el sistema lo rechaza y se pide un toque al usuario.
 */
class WakeWordService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private lateinit var engine: SoniEngine

    private lateinit var wakeWord: WakeWordManager
    private lateinit var speechInput: SpeechInput
    private lateinit var speechOutput: SpeechOutput
    private lateinit var preferences: SoniPreferences
    private var tone: ToneGenerator? = null

    private var initialized = false
    private var commandJob: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        WakeWordNotifications.createChannels(this)
        engine = SoniEngine.createDefault(PermissionManager(this), ActionLogRepository.create(this))
        wakeWord = WakeWordManager(this)
        speechInput = SpeechInput(this)
        speechOutput = SpeechOutput(this)
        preferences = SoniPreferences(this)
        tone = runCatching { ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80) }.getOrNull()

        scope.launch {
            WakeWordController.uiHoldsMic.collect { holds -> onUiMicChanged(holds) }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                // Ámbito propio: el del servicio se cancela al destruirse y se perdería el cambio.
                CoroutineScope(Dispatchers.IO).launch { preferences.setBackgroundListening(false) }
                stopSelf()
                return START_NOT_STICKY
            }
            ACTION_SIMULATE_WAKE -> {
                // Solo para pruebas con adb en compilaciones de depuración.
                if (isDebuggable() && WakeWordController.state.value == WakeWordState.Waiting) {
                    wakeWord.stop()
                    onWakeWordDetected()
                }
                return START_STICKY
            }
        }

        if (!startInForeground()) return START_NOT_STICKY
        WakeWordNotifications.cancelTapToActivate(this)

        if (!initialized) {
            initialized = true
            setState(WakeWordState.Loading)
            wakeWord.load(
                onReady = { listenForWakeWord() },
                onError = { fail(it) },
            )
        }
        return START_STICKY
    }

    private fun startInForeground(): Boolean {
        if (!hasMicPermission()) {
            fail("Falta el permiso de micrófono. Ábreme y pulsa el micrófono para concederlo.")
            return false
        }
        return try {
            val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
            } else {
                0
            }
            ServiceCompat.startForeground(
                this,
                WakeWordNotifications.LISTENING_ID,
                WakeWordNotifications.listening(
                    this,
                    if (initialized) WakeWordController.state.value else WakeWordState.Loading,
                ),
                type,
            )
            true
        } catch (e: Exception) {
            // Android 12+ rechaza iniciar el servicio desde segundo plano (por ejemplo, si el
            // sistema lo reinicia). No se insiste: se pide al usuario un toque para activarlo.
            WakeWordNotifications.showTapToActivate(this)
            fail("Android no permitió activar el micrófono en segundo plano. Toca la notificación para activarme.")
            false
        }
    }

    private fun listenForWakeWord() {
        if (WakeWordController.uiHoldsMic.value) {
            setState(WakeWordState.Paused)
            return
        }
        if (!hasMicPermission()) {
            fail("Se retiró el permiso de micrófono, así que dejé de escuchar.")
            return
        }
        val started = wakeWord.start(
            onDetected = ::onWakeWordDetected,
            onError = { fail(it) },
        )
        if (started) setState(WakeWordState.Waiting)
    }

    private fun onWakeWordDetected() {
        speechOutput.stop()
        setState(WakeWordState.ListeningCommand)
        commandJob?.cancel()
        commandJob = scope.launch {
            tone?.startTone(ToneGenerator.TONE_PROP_BEEP, TONE_MS)
            // Espera a que termine el tono para que no entre en la transcripción.
            delay(TONE_MS + 100L)
            speechInput.start(SoniLocale.languageTag, ::onSpeechEvent)
        }
    }

    private fun onSpeechEvent(event: SpeechEvent) {
        when (event) {
            is SpeechEvent.Final -> {
                setState(WakeWordState.Processing)
                commandJob = scope.launch {
                    when (val result = engine.process(event.text)) {
                        // Sin pantalla no se puede confirmar con garantías: se descarta y se avisa.
                        is ActionResult.NeedsConfirmation -> {
                            engine.cancel(result.confirmationId)
                            val message = "Esa acción necesita tu confirmación en la pantalla de SONI. No hice nada."
                            respond(message, message)
                        }
                        is ActionResult.NeedsPermission -> {
                            val message = "${result.message} Ábreme para concederlo."
                            respond(message, message)
                        }
                        else -> respond("«${event.text}»: ${result.message}", result.spokenMessage)
                    }
                }
            }
            is SpeechEvent.Error -> {
                val message = when (event.code) {
                    SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT ->
                        "No te entendí. Di «SONI» otra vez y espera el tono."
                    else -> event.message
                }
                commandJob = scope.launch { respond(message, message) }
            }
            SpeechEvent.Ready, is SpeechEvent.Level, is SpeechEvent.Partial -> Unit
        }
    }

    /** Muestra y pronuncia la respuesta; vuelve a escuchar «SONI» cuando termina de hablar. */
    private suspend fun respond(shown: String, spoken: String) {
        setState(WakeWordState.Responded(shown))
        speechOutput.speak(spoken)
        if (speechOutput.state.value == SpeechOutput.State.Ready) {
            // Si se escuchara mientras habla, SONI podría oírse a sí misma.
            withTimeoutOrNull(SPEECH_START_TIMEOUT_MS) { speechOutput.isSpeaking.first { it } }
            withTimeoutOrNull(SPEECH_MAX_MS) { speechOutput.isSpeaking.first { !it } }
        }
        listenForWakeWord()
    }

    private fun onUiMicChanged(holds: Boolean) {
        val state = WakeWordController.state.value
        if (holds && state == WakeWordState.Waiting) {
            wakeWord.stop()
            setState(WakeWordState.Paused)
        } else if (!holds && state == WakeWordState.Paused) {
            listenForWakeWord()
        }
    }

    private fun setState(state: WakeWordState) {
        WakeWordController.update(state)
        if (state !is WakeWordState.Failed && hasNotificationPermission()) {
            NotificationManagerCompat.from(this).notify(
                WakeWordNotifications.LISTENING_ID,
                WakeWordNotifications.listening(this, state),
            )
        }
    }

    private fun fail(message: String) {
        WakeWordController.update(WakeWordState.Failed(message))
        stopSelf()
    }

    override fun onDestroy() {
        scope.cancel()
        wakeWord.release()
        speechInput.destroy()
        speechOutput.shutdown()
        tone?.release()
        tone = null
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        if (WakeWordController.state.value !is WakeWordState.Failed) {
            WakeWordController.update(WakeWordState.Off)
        }
        super.onDestroy()
    }

    private fun hasMicPermission(): Boolean =
        ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) ==
            PackageManager.PERMISSION_GRANTED

    private fun hasNotificationPermission(): Boolean = WakeWordNotifications.canPostNotifications(this)

    private fun isDebuggable(): Boolean = applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0

    companion object {
        const val ACTION_STOP = "com.soni.assistant.action.STOP_LISTENING"
        const val ACTION_SIMULATE_WAKE = "com.soni.assistant.action.SIMULATE_WAKE"

        private const val TONE_MS = 150
        private const val SPEECH_START_TIMEOUT_MS = 3_000L
        private const val SPEECH_MAX_MS = 60_000L

        /** Debe llamarse con SONI visible (actividad abierta o acción directa del usuario). */
        fun start(context: Context) {
            ContextCompat.startForegroundService(context, Intent(context, WakeWordService::class.java))
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, WakeWordService::class.java))
        }
    }
}
