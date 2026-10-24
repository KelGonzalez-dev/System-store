package com.soni.assistant.voice

import android.content.Context
import android.media.AudioAttributes
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import com.soni.assistant.data.settings.SoniSettings
import com.soni.assistant.data.settings.SoniSettingsState
import com.soni.assistant.core.SoniLocale
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

/** Respuestas habladas con el motor TextToSpeech del teléfono. */
class SpeechOutput(context: Context) : TextToSpeech.OnInitListener {

    private val settings = SoniSettings.get(context)
    private var appliedSettings: SoniSettingsState? = null

    sealed interface State {
        data object Initializing : State
        data object Ready : State
        data class Unavailable(val reason: String) : State
    }

    private val _state = MutableStateFlow<State>(State.Initializing)
    val state: StateFlow<State> = _state.asStateFlow()

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking.asStateFlow()

    private var pendingText: String? = null
    private var tts: TextToSpeech? = null

    init {
        tts = TextToSpeech(context.applicationContext, this)
    }

    override fun onInit(status: Int) {
        val engine = tts
        if (status != TextToSpeech.SUCCESS || engine == null) {
            _state.value = State.Unavailable(
                "No se pudo iniciar la voz del teléfono. Responderé solo por texto."
            )
            return
        }

        val locale = candidateLocales().firstOrNull {
            engine.isLanguageAvailable(it) >= TextToSpeech.LANG_AVAILABLE
        }
        if (locale == null || engine.setLanguage(locale) < TextToSpeech.LANG_AVAILABLE) {
            _state.value = State.Unavailable(
                "No encontré una voz en español instalada, así que responderé solo por texto. " +
                    "Puedes instalarla en Ajustes de Android > Accesibilidad > Salida de texto a voz."
            )
            return
        }

        applyVoice(engine)
        // Canal de asistente: suena por encima y el sistema atenúa/pausa la música automáticamente.
        engine.setAudioAttributes(
            AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ASSISTANT)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build()
        )

        engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                _isSpeaking.value = true
            }

            override fun onDone(utteranceId: String?) {
                _isSpeaking.value = false
            }

            @Deprecated("Deprecated in Java")
            override fun onError(utteranceId: String?) {
                _isSpeaking.value = false
            }

            override fun onError(utteranceId: String?, errorCode: Int) {
                _isSpeaking.value = false
            }

            override fun onStop(utteranceId: String?, interrupted: Boolean) {
                _isSpeaking.value = false
            }
        })

        _state.value = State.Ready
        pendingText?.let {
            pendingText = null
            speak(it)
        }
    }

    fun speak(text: String) {
        if (text.isBlank()) return
        when (_state.value) {
            State.Initializing -> pendingText = text
            State.Ready -> tts?.let { engine ->
                applyVoice(engine) // por si el usuario cambió la voz en Ajustes
                engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "soni-${System.nanoTime()}")
            }
            is State.Unavailable -> Unit
        }
    }

    fun stop() {
        pendingText = null
        tts?.stop()
        _isSpeaking.value = false
    }

    fun shutdown() {
        stop()
        tts?.shutdown()
        tts = null
    }

    /** Aplica voz, tono y velocidad de los ajustes (solo si cambiaron desde la última vez). */
    private fun applyVoice(engine: TextToSpeech) {
        val wanted = settings.current
        if (wanted == appliedSettings) return
        runCatching { pickVoice(engine, wanted.voiceName)?.let { engine.voice = it } }
        engine.setPitch(wanted.pitch.coerceIn(0.5f, 1.5f))
        engine.setSpeechRate(wanted.speechRate.coerceIn(0.6f, 1.6f))
        appliedSettings = wanted
    }

    private fun candidateLocales(): List<Locale> = listOf(
        SoniLocale.locale,
        Locale.forLanguageTag("es-CO"),
        Locale.forLanguageTag("es-US"),
        Locale.forLanguageTag("es-MX"),
        Locale.forLanguageTag("es-ES"),
        Locale.forLanguageTag("es"),
    ).distinct()

    companion object {
        /**
         * Voces de Google que suenan masculinas (según su código interno). Google no publica el género
         * de sus voces, así que esto es solo el punto de partida: en Ajustes el usuario puede elegir cualquiera.
         */
        private val KNOWN_MALE_IDS = listOf("es-us-x-esd", "es-es-x-eed", "es-es-x-eef")

        /** Voces en español instaladas o descargables del motor. */
        fun spanishVoices(engine: TextToSpeech): List<Voice> = runCatching {
            engine.voices.orEmpty()
                .filter { it.locale.language == "es" }
                .filterNot { TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED in it.features.orEmpty() }
                .sortedWith(compareBy({ it.locale.toLanguageTag() }, { it.isNetworkConnectionRequired }, { it.name }))
        }.getOrDefault(emptyList())

        /** La voz elegida por el usuario o, si no eligió, la que parezca masculina. */
        fun pickVoice(engine: TextToSpeech, wantedName: String): Voice? {
            val voices = spanishVoices(engine)
            if (wantedName.isNotBlank()) voices.firstOrNull { it.name == wantedName }?.let { return it }
            return voices.maxByOrNull { maleScore(it) }?.takeIf { maleScore(it) > 0 }
        }

        private fun maleScore(voice: Voice): Int {
            val name = voice.name.lowercase(Locale.ROOT)
            var score = 0
            if ("female" in name || "mujer" in name) return -10
            if ("male" in name || "hombre" in name || "masculin" in name) score += 5
            if (KNOWN_MALE_IDS.any { name.startsWith(it) }) score += 4
            if (!voice.isNetworkConnectionRequired) score += 1
            if (voice.locale.country in setOf("CO", "US", "MX")) score += 1
            return score
        }

        /** Nombre legible: «Español (Estados Unidos) · esd · sin internet». */
        fun label(voice: Voice): String {
            val region = voice.locale.getDisplayCountry(Locale.forLanguageTag("es")).ifBlank { "general" }
            val code = voice.name.substringAfter("-x-", voice.name).substringBefore("-")
            val net = if (voice.isNetworkConnectionRequired) "requiere internet" else "sin internet"
            return "Español ($region) · $code · $net"
        }
    }
}
