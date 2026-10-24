package com.soni.assistant.data.settings

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Preferencias de notificaciones y del modo «no disponible». Guardadas solo en el teléfono. */
data class NotificationPrefs(
    /** SONI lee en voz alta las notificaciones que llegan. */
    val readAloud: Boolean = false,
    /** Modo «no estoy disponible»: responde solo en WhatsApp a quien insista. */
    val awayMode: Boolean = false,
    /** Cuántos mensajes seguidos de la misma persona antes de responder. */
    val awayThreshold: Int = 3,
    /** Mensaje automático. {nombre} se reemplaza por el nombre del usuario. */
    val awayMessage: String = "Hola, soy SONI, el asistente de {nombre}. En este momento no puede responder mensajes, pero apenas pueda te contesta.",
    /** Burbuja flotante de partículas sobre otras apps. */
    val bubble: Boolean = false,
)

class AvailabilitySettings private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_availability", Context.MODE_PRIVATE)
    private val _state = MutableStateFlow(load())
    val state: StateFlow<NotificationPrefs> = _state.asStateFlow()
    val current: NotificationPrefs get() = _state.value

    fun update(transform: (NotificationPrefs) -> NotificationPrefs) {
        val next = transform(_state.value)
        prefs.edit()
            .putBoolean(READ, next.readAloud)
            .putBoolean(AWAY, next.awayMode)
            .putInt(THRESHOLD, next.awayThreshold)
            .putString(MESSAGE, next.awayMessage)
            .putBoolean(BUBBLE, next.bubble)
            .apply()
        _state.value = next
    }

    private fun load() = NotificationPrefs(
        readAloud = prefs.getBoolean(READ, false),
        awayMode = prefs.getBoolean(AWAY, false),
        awayThreshold = prefs.getInt(THRESHOLD, 3),
        awayMessage = prefs.getString(MESSAGE, null) ?: NotificationPrefs().awayMessage,
        bubble = prefs.getBoolean(BUBBLE, false),
    )

    companion object {
        private const val READ = "read_aloud"
        private const val AWAY = "away_mode"
        private const val THRESHOLD = "away_threshold"
        private const val MESSAGE = "away_message"
        private const val BUBBLE = "bubble"

        @Volatile
        private var instance: AvailabilitySettings? = null

        fun get(context: Context): AvailabilitySettings =
            instance ?: synchronized(this) { instance ?: AvailabilitySettings(context).also { instance = it } }
    }
}
