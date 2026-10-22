package com.soni.assistant.voice

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

sealed interface SpeechEvent {
    data object Ready : SpeechEvent
    data class Level(val value: Float) : SpeechEvent
    data class Partial(val text: String) : SpeechEvent
    data class Final(val text: String) : SpeechEvent
    data class Error(val code: Int, val message: String) : SpeechEvent
}

/**
 * Reconocimiento de voz bajo demanda (pulsar para hablar) con el servicio del sistema.
 * No sirve para escucha continua: la palabra de activación es un proyecto de la Fase 7.
 *
 * Todos los métodos deben llamarse desde el hilo principal.
 */
class SpeechInput(context: Context) {

    private val appContext = context.applicationContext
    private var recognizer: SpeechRecognizer? = null
    private var sessionId = 0

    fun isAvailable(): Boolean = SpeechRecognizer.isRecognitionAvailable(appContext)

    fun start(languageTag: String, onEvent: (SpeechEvent) -> Unit) {
        val activeRecognizer = recognizer
            ?: SpeechRecognizer.createSpeechRecognizer(appContext).also { recognizer = it }
        activeRecognizer.cancel()

        val session = ++sessionId
        var finished = false

        fun emit(event: SpeechEvent) {
            // Ignora eventos de sesiones canceladas y cualquier cosa tras el resultado final.
            if (session != sessionId || finished) return
            if (event is SpeechEvent.Final || event is SpeechEvent.Error) finished = true
            onEvent(event)
        }

        activeRecognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) = emit(SpeechEvent.Ready)
            override fun onBeginningOfSpeech() = Unit
            override fun onRmsChanged(rmsdB: Float) =
                emit(SpeechEvent.Level(((rmsdB + 2f) / 12f).coerceIn(0f, 1f)))
            override fun onBufferReceived(buffer: ByteArray?) = Unit
            override fun onEndOfSpeech() = Unit
            override fun onError(error: Int) = emit(SpeechEvent.Error(error, describeError(error)))

            override fun onResults(results: Bundle?) {
                val text = results
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull { it.isNotBlank() }
                if (text != null) {
                    emit(SpeechEvent.Final(text))
                } else {
                    val code = SpeechRecognizer.ERROR_NO_MATCH
                    emit(SpeechEvent.Error(code, describeError(code)))
                }
            }

            override fun onPartialResults(partialResults: Bundle?) {
                val text = partialResults
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull()
                if (!text.isNullOrBlank()) emit(SpeechEvent.Partial(text))
            }

            override fun onEvent(eventType: Int, params: Bundle?) = Unit
        })

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, languageTag)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, appContext.packageName)
        }
        activeRecognizer.startListening(intent)
    }

    /** Deja de escuchar y pide el resultado de lo que ya se dijo. */
    fun stop() {
        recognizer?.stopListening()
    }

    /** Cancela sin producir resultado. */
    fun cancel() {
        sessionId++
        recognizer?.cancel()
    }

    fun destroy() {
        cancel()
        recognizer?.destroy()
        recognizer = null
    }

    companion object {
        fun describeError(code: Int): String = when (code) {
            SpeechRecognizer.ERROR_NO_MATCH -> "No entendí lo que dijiste. Intenta de nuevo."
            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No escuché nada. Pulsa el micrófono e intenta de nuevo."
            SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_NETWORK_TIMEOUT ->
                "Sin conexión. El reconocimiento de voz del teléfono necesita internet o el paquete de español sin conexión."
            SpeechRecognizer.ERROR_AUDIO -> "No pude leer el audio del micrófono."
            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Falta el permiso de micrófono."
            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "El reconocimiento de voz está ocupado. Espera un momento."
            SpeechRecognizer.ERROR_SERVER -> "El servicio de reconocimiento de voz falló."
            SpeechRecognizer.ERROR_CLIENT -> "Se interrumpió la escucha."
            10 -> "Demasiadas solicitudes de voz seguidas. Espera un momento." // ERROR_TOO_MANY_REQUESTS (API 31)
            11 -> "Se perdió la conexión con el servicio de voz." // ERROR_SERVER_DISCONNECTED (API 31)
            12, 13 -> "El reconocimiento de voz de este teléfono no tiene el español disponible." // LANGUAGE_* (API 31)
            else -> "Error de reconocimiento de voz (código $code)."
        }
    }
}
