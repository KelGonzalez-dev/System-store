package com.soni.assistant.voice

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Estado real de la escucha en segundo plano. La interfaz nunca lo inventa: lo publica el servicio. */
sealed interface WakeWordState {
    data object Off : WakeWordState
    data object Loading : WakeWordState
    data object Waiting : WakeWordState
    data object Paused : WakeWordState
    data object ListeningCommand : WakeWordState
    data object Processing : WakeWordState
    data class Responded(val message: String) : WakeWordState
    data class Failed(val message: String) : WakeWordState
}

/** Punto de encuentro entre el servicio, la pantalla principal y el botón de ajustes rápidos. */
object WakeWordController {

    private val _state = MutableStateFlow<WakeWordState>(WakeWordState.Off)
    val state: StateFlow<WakeWordState> = _state.asStateFlow()

    /** SONI está hablando ahora mismo (para que la burbuja y el orbe ondulen con la voz). */
    private val _speaking = MutableStateFlow(false)
    val speaking: StateFlow<Boolean> = _speaking.asStateFlow()

    fun setSpeaking(value: Boolean) { _speaking.value = value }

    private val _uiHoldsMic = MutableStateFlow(false)

    /** La pantalla está usando el micrófono o hablando: el servicio debe soltarlo y no escuchar. */
    val uiHoldsMic: StateFlow<Boolean> = _uiHoldsMic.asStateFlow()

    val isRunning: Boolean
        get() = _state.value.let { it !is WakeWordState.Off && it !is WakeWordState.Failed }

    fun setUiHoldsMic(holds: Boolean) {
        _uiHoldsMic.value = holds
    }

    internal fun update(state: WakeWordState) {
        _state.value = state
    }
}
