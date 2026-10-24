package com.soni.assistant.data.settings

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Ajustes del usuario que deben leerse al instante (voz, nombre). Se guardan solo en el teléfono. */
data class SoniSettingsState(
    /** Cómo llamar al usuario: «Kelmer». Vacío = no lo sabe aún. */
    val userName: String = "",
    /** Nombre interno de la voz de TextToSpeech elegida. Vacío = elegir automáticamente una masculina. */
    val voiceName: String = "",
    /** 1.0 = normal. Menor = más grave. */
    val pitch: Float = 0.9f,
    /** 1.0 = normal. */
    val speechRate: Float = 1.0f,
)

class SoniSettings private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_settings", Context.MODE_PRIVATE)
    private val _state = MutableStateFlow(load())
    val state: StateFlow<SoniSettingsState> = _state.asStateFlow()

    val current: SoniSettingsState get() = _state.value

    fun update(transform: (SoniSettingsState) -> SoniSettingsState) {
        val next = transform(_state.value)
        prefs.edit()
            .putString(USER_NAME, next.userName)
            .putString(VOICE_NAME, next.voiceName)
            .putFloat(PITCH, next.pitch)
            .putFloat(RATE, next.speechRate)
            .apply()
        _state.value = next
    }

    private fun load() = SoniSettingsState(
        userName = prefs.getString(USER_NAME, "") ?: "",
        voiceName = prefs.getString(VOICE_NAME, "") ?: "",
        pitch = prefs.getFloat(PITCH, 0.9f),
        speechRate = prefs.getFloat(RATE, 1.0f),
    )

    companion object {
        private const val USER_NAME = "user_name"
        private const val VOICE_NAME = "voice_name"
        private const val PITCH = "pitch"
        private const val RATE = "rate"

        @Volatile
        private var instance: SoniSettings? = null

        fun get(context: Context): SoniSettings =
            instance ?: synchronized(this) { instance ?: SoniSettings(context).also { instance = it } }
    }
}
