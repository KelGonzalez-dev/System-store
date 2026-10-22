package com.soni.assistant.voice

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.soni.assistant.core.SoniLocale
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

/** Respuestas habladas con el motor TextToSpeech del teléfono. */
class SpeechOutput(context: Context) : TextToSpeech.OnInitListener {

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
            State.Ready -> tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "soni-${System.nanoTime()}")
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

    private fun candidateLocales(): List<Locale> = listOf(
        SoniLocale.locale,
        Locale.forLanguageTag("es-CO"),
        Locale.forLanguageTag("es-US"),
        Locale.forLanguageTag("es-MX"),
        Locale.forLanguageTag("es-ES"),
        Locale.forLanguageTag("es"),
    ).distinct()
}
