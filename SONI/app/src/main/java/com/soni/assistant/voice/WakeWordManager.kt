package com.soni.assistant.voice

import android.annotation.SuppressLint
import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.media.audiofx.AcousticEchoCanceler
import android.media.audiofx.AudioEffect
import android.media.audiofx.NoiseSuppressor
import android.os.Handler
import android.os.Looper
import org.json.JSONObject
import org.vosk.Model
import org.vosk.Recognizer
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
    private val mainHandler = Handler(Looper.getMainLooper())
    private var model: Model? = null
    private var loading = false

    @Volatile
    private var listening: EchoCancelledListener? = null

    val isLoaded: Boolean get() = model != null
    val isListening: Boolean get() = listening != null

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
            val recognizer = Recognizer(loadedModel, SAMPLE_RATE, WakeWordDetector.grammarJson)
                .apply { setWords(true) }
            val listener = EchoCancelledListener(
                recognizer = recognizer,
                onDetected = {
                    mainHandler.post {
                        stop()
                        onDetected()
                    }
                },
                onError = { message ->
                    mainHandler.post {
                        stop()
                        onError(message)
                    }
                },
            )
            listening = listener
            listener.start()
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
        listening?.stopAndRelease()
        listening = null
    }

    fun release() {
        stop()
        model?.close()
        model = null
    }

    /**
     * Escucha con cancelación de eco: el micrófono se abre en modo «llamada» (VOICE_COMMUNICATION),
     * en el que Android resta del micrófono lo que suena por el altavoz del propio teléfono.
     * Así la música de Spotify casi no tapa la voz del usuario.
     *
     * Además se revisan los resultados parciales: con música de fondo nunca hay silencio, así que
     * Vosk casi nunca cerraría la frase y nunca daría un resultado final.
     */
    private class EchoCancelledListener(
        private val recognizer: Recognizer,
        private val onDetected: () -> Unit,
        private val onError: (String) -> Unit,
    ) {
        @Volatile
        private var running = false
        private var thread: Thread? = null
        private var record: AudioRecord? = null
        private val effects = mutableListOf<AudioEffect>()

        @SuppressLint("MissingPermission")
        fun start() {
            val rate = SAMPLE_RATE.toInt()
            val minBuffer = AudioRecord.getMinBufferSize(rate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
            val bufferSize = maxOf(minBuffer, rate / 2) // ~0,25 s de audio

            fun open(source: Int): AudioRecord? = runCatching {
                AudioRecord(source, rate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize * 2)
                    .takeIf { it.state == AudioRecord.STATE_INITIALIZED }
            }.getOrNull()

            val audio = open(MediaRecorder.AudioSource.VOICE_COMMUNICATION)
                ?: open(MediaRecorder.AudioSource.VOICE_RECOGNITION)
                ?: throw IllegalStateException("micrófono no disponible")
            record = audio

            val session = audio.audioSessionId
            if (AcousticEchoCanceler.isAvailable()) {
                AcousticEchoCanceler.create(session)?.let { it.enabled = true; effects += it }
            }
            if (NoiseSuppressor.isAvailable()) {
                NoiseSuppressor.create(session)?.let { it.enabled = true; effects += it }
            }

            running = true
            audio.startRecording()
            thread = Thread({ loop(audio, bufferSize / 2) }, "soni-wake-word").apply { start() }
        }

        private fun loop(audio: AudioRecord, samples: Int) {
            val buffer = ShortArray(samples)
            try {
                while (running) {
                    val read = audio.read(buffer, 0, buffer.size)
                    if (read < 0) {
                        if (running) onError("El micrófono dejó de funcionar (código $read).")
                        return
                    }
                    if (read == 0) continue
                    // Amplificamos la señal del micrófono (ganancia por software) para que la voz
                    // destaque sobre la música de fondo, así el usuario no tiene que gritar.
                    // Con recorte para no saturar y meter ruido.
                    applyGain(buffer, read, GAIN)
                    val detected = if (recognizer.acceptWaveForm(buffer, read)) {
                        WakeWordDetector.matches(parseWords(recognizer.result))
                    } else {
                        // Frase sin terminar: si ya suena a «soni», se cierra para medir la confianza.
                        val partial = runCatching { JSONObject(recognizer.partialResult).optString("partial") }.getOrDefault("")
                        if (partial.split(' ').any { it == WakeWordDetector.WAKE_WORD }) {
                            WakeWordDetector.matches(parseWords(recognizer.finalResult))
                        } else {
                            false
                        }
                    }
                    if (detected && running) {
                        running = false
                        onDetected()
                        return
                    }
                }
            } catch (e: Exception) {
                if (running) onError("El micrófono dejó de funcionar: ${e.message ?: "error desconocido"}.")
            }
        }

        /** Multiplica cada muestra por [gain], recortando a los límites de 16 bits para no saturar. */
        private fun applyGain(buffer: ShortArray, length: Int, gain: Float) {
            if (gain == 1f) return
            for (i in 0 until length) {
                val amplified = (buffer[i] * gain).toInt()
                buffer[i] = when {
                    amplified > Short.MAX_VALUE -> Short.MAX_VALUE
                    amplified < Short.MIN_VALUE -> Short.MIN_VALUE
                    else -> amplified.toShort()
                }
            }
        }

        fun stopAndRelease() {
            running = false
            runCatching { record?.stop() }
            if (Thread.currentThread() != thread) runCatching { thread?.join(500) }
            effects.forEach { runCatching { it.release() } }
            effects.clear()
            runCatching { record?.release() }
            record = null
            runCatching { recognizer.close() }
        }

        private companion object {
            // Ganancia aplicada al micrófono: 2.5x hace que la voz destaque sobre la música
            // sin saturar demasiado. Si en pruebas se oye distorsión o falsos positivos, bajar a 2.0.
            const val GAIN = 2.5f
        }

        private fun parseWords(hypothesis: String?): List<RecognizedWord> {
            if (hypothesis.isNullOrBlank()) return emptyList()
            val result = runCatching { JSONObject(hypothesis).optJSONArray("result") }.getOrNull() ?: return emptyList()
            return (0 until result.length()).map { index ->
                val item = result.getJSONObject(index)
                RecognizedWord(item.optString("word"), item.optDouble("conf", 0.0))
            }
        }
    }

    private companion object {
        const val MODEL_ASSET_DIR = "model-es"
        const val MODEL_TARGET_DIR = "vosk-model-es"
        const val SAMPLE_RATE = 16_000f
    }
}
