package com.soni.assistant.voice

import android.content.Context
import org.json.JSONObject
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.RecognitionListener
import org.vosk.android.SpeechService
import org.vosk.android.StorageService

/** Una palabra reconocida por Vosk con su confianza (0–1). */
data class RecognizedWord(val word: String, val confidence: Double)

/** Regla de activación, separada de Vosk para poder probarla sin dispositivo. */
object WakeWordDetector {
    const val WAKE_WORD = "soni"

    /**
     * Palabras parecidas que se incluyen en la gramática para que Vosk tenga a dónde
     * asignarlas en vez de forzarlas a «soni». Nunca activan a SONI.
     */
    val DISTRACTORS = listOf("sonia", "sonido", "sonó", "son", "sí", "no")

    const val MIN_CONFIDENCE = 0.6

    /** Gramática cerrada en el formato JSON que espera Vosk. */
    val grammarJson: String =
        (listOf(WAKE_WORD) + DISTRACTORS + "[unk]").joinToString(prefix = "[", postfix = "]") { "\"$it\"" }

    fun matches(words: List<RecognizedWord>, minConfidence: Double = MIN_CONFIDENCE): Boolean =
        words.any { it.word == WAKE_WORD && it.confidence >= minConfidence }
}

/**
 * Detección local de la palabra «SONI» con Vosk y el modelo pequeño en español incluido en
 * la app. El audio se procesa solo en el teléfono y no se guarda.
 *
 * Todos los métodos deben llamarse desde el hilo principal; los avisos también llegan en él.
 */
class WakeWordManager(context: Context) {

    private val appContext = context.applicationContext
    private var model: Model? = null
    private var recognizer: Recognizer? = null
    private var speechService: SpeechService? = null
    private var loading = false

    val isLoaded: Boolean get() = model != null
    val isListening: Boolean get() = speechService != null

    /** Descomprime el modelo la primera vez (unos segundos) y lo carga en memoria. */
    fun load(onReady: () -> Unit, onError: (String) -> Unit) {
        if (model != null) return onReady()
        if (loading) return
        loading = true
        StorageService.unpack(
            appContext,
            MODEL_ASSET_DIR,
            MODEL_TARGET_DIR,
            { loaded ->
                loading = false
                model = loaded
                onReady()
            },
            { error ->
                loading = false
                onError("No pude cargar el modelo de voz local: ${error.message ?: "error desconocido"}.")
            },
        )
    }

    /** Empieza a escuchar el micrófono. [onDetected] se llama una vez y la escucha se detiene. */
    fun start(onDetected: () -> Unit, onError: (String) -> Unit): Boolean {
        val loadedModel = model ?: return false
        stop()
        return try {
            val newRecognizer = Recognizer(loadedModel, SAMPLE_RATE, WakeWordDetector.grammarJson)
                .apply { setWords(true) }
            val service = SpeechService(newRecognizer, SAMPLE_RATE)
            recognizer = newRecognizer
            speechService = service
            service.startListening(object : RecognitionListener {
                override fun onPartialResult(hypothesis: String?) = Unit

                override fun onResult(hypothesis: String?) {
                    if (WakeWordDetector.matches(parseWords(hypothesis))) {
                        stop()
                        onDetected()
                    }
                }

                override fun onFinalResult(hypothesis: String?) = Unit

                override fun onError(exception: Exception?) {
                    stop()
                    onError("El micrófono dejó de funcionar: ${exception?.message ?: "error desconocido"}.")
                }

                override fun onTimeout() = Unit
            })
            true
        } catch (e: Exception) {
            // Sin permiso o con el micrófono ocupado, AudioRecord falla al crearse.
            stop()
            onError("No pude abrir el micrófono para esperar «SONI».")
            false
        }
    }

    /** Deja de escuchar y libera el micrófono para que lo use otro reconocedor. */
    fun stop() {
        speechService?.let {
            it.cancel()
            it.shutdown()
        }
        speechService = null
        recognizer?.close()
        recognizer = null
    }

    fun release() {
        stop()
        model?.close()
        model = null
    }

    private fun parseWords(hypothesis: String?): List<RecognizedWord> {
        if (hypothesis.isNullOrBlank()) return emptyList()
        val result = JSONObject(hypothesis).optJSONArray("result") ?: return emptyList()
        return (0 until result.length()).map { index ->
            val item = result.getJSONObject(index)
            RecognizedWord(item.optString("word"), item.optDouble("conf", 0.0))
        }
    }

    private companion object {
        const val MODEL_ASSET_DIR = "model-es"
        const val MODEL_TARGET_DIR = "vosk-model-es"
        const val SAMPLE_RATE = 16_000f
    }
}
