package com.soni.assistant.voice

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Estado en memoria del modo «silencio / no molestar».
 *
 * En modo silencio SONI:
 *  - No habla por iniciativa propia (ni avisos de batería ni nada).
 *  - No lee notificaciones en voz alta.
 *  - PERO sigue escuchando la palabra «SONI», así que basta decir «SONI» para despertarlo.
 *
 * No se guarda en disco a propósito: es un estado del momento. Al reabrir la app o reiniciar
 * el servicio vuelve a estar activo (no silenciado).
 */
object SoniRuntimeState {

    private val _silenced = MutableStateFlow(false)
    val silenced: StateFlow<Boolean> = _silenced.asStateFlow()

    val isSilenced: Boolean get() = _silenced.value

    /** Entra en modo silencio (lo activa «no molestar» / «modo silencio»). */
    fun silence() { _silenced.value = true }

    /** Sale del modo silencio (al decir «SONI» o tocar el botón). */
    fun wake() { _silenced.value = false }
}
