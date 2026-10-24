package com.soni.assistant.documents

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.soni.assistant.data.settings.SoniSettings
import com.soni.assistant.voice.SpeechOutput
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

sealed interface ReaderState {
    data object Idle : ReaderState
    data class Reading(val title: String, val chunk: Int, val total: Int) : ReaderState
    data class Paused(val title: String, val chunk: Int, val total: Int) : ReaderState
}

/**
 * Lee un documento en voz alta, trozo a trozo, aunque la pantalla esté apagada.
 * - Guarda por dónde va, para «sigue leyendo» (incluso días después).
 * - Se pausa sola si otra app o SONI necesitan el audio (por ejemplo, cuando dices «SONI»)
 *   y continúa al terminar.
 */
object ReaderPlayer {

    private val main = Handler(Looper.getMainLooper())
    private val _state = MutableStateFlow<ReaderState>(ReaderState.Idle)
    val state: StateFlow<ReaderState> = _state.asStateFlow()

    private var appContext: Context? = null
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var chunks: List<String> = emptyList()
    private var index = 0
    private var title = ""
    private var path = ""
    private var focusRequest: AudioFocusRequest? = null
    private var pausedByFocus = false
    /** Otra app (o SONI respondiendo) tiene el audio en este momento. */
    private var focusLost = false

    val isActive: Boolean get() = _state.value !is ReaderState.Idle

    /** Empieza a leer (o retoma donde iba si ya lo había leído antes). Llamar desde el hilo principal. */
    fun play(context: Context, document: FoundDocument, text: String, fromStart: Boolean = false) {
        val app = context.applicationContext
        appContext = app
        stopSpeaking()
        chunks = TextExtractor.chunks(text)
        title = document.title
        path = document.file.absolutePath
        index = if (fromStart) 0 else savedPosition(app, path).coerceIn(0, (chunks.size - 1).coerceAtLeast(0))
        ReaderService.start(app)
        ensureTts(app) { speakCurrent() }
    }

    /** Documento leído por última vez y si queda algo por leer. */
    fun lastDocumentPath(context: Context): String? =
        prefs(context).getString(LAST_PATH, null)

    fun pause() = main.post {
        if (_state.value is ReaderState.Idle) return@post
        pausedByFocus = false // pausa pedida por el usuario: no se reanuda sola
        stopSpeaking()
        _state.value = ReaderState.Paused(title, index, chunks.size)
        abandonFocus()
        appContext?.let { ReaderService.refresh(it) }
    }

    fun resume() = main.post {
        if (_state.value !is ReaderState.Paused) return@post
        // Si SONI está respondiendo, espera a que termine y retoma sola.
        if (focusLost) pausedByFocus = true else speakCurrent()
    }

    fun stop() = main.post {
        stopSpeaking()
        abandonFocus()
        _state.value = ReaderState.Idle
        appContext?.let { ReaderService.stop(it) }
    }

    /** Avanza o retrocede unos trozos («adelanta», «repite lo último»). */
    fun skip(chunksDelta: Int) = main.post {
        if (chunks.isEmpty()) return@post
        index = (index + chunksDelta).coerceIn(0, chunks.size - 1)
        if (_state.value is ReaderState.Reading) speakCurrent() else savePosition()
    }

    /** Salta a una fracción del documento (0 a 1): «ve a la mitad», «al final». */
    fun seekToFraction(fraction: Float) = main.post {
        if (chunks.isEmpty()) return@post
        index = (fraction.coerceIn(0f, 1f) * (chunks.size - 1)).toInt()
        if (_state.value is ReaderState.Reading) speakCurrent() else savePosition()
    }

    /** Salta al primer trozo que contenga [query] (sin tildes ni mayúsculas). true si lo encontró. */
    fun seekToText(query: String): Boolean {
        if (chunks.isEmpty()) return false
        val q = com.soni.assistant.data.memory.MemoryText.plain(query)
        if (q.isBlank()) return false
        // Buscar a partir de donde va, y si no, desde el principio.
        val from = (index until chunks.size).firstOrNull { com.soni.assistant.data.memory.MemoryText.plain(chunks[it]).contains(q) }
        val found = from ?: (0 until chunks.size).firstOrNull { com.soni.assistant.data.memory.MemoryText.plain(chunks[it]).contains(q) }
        if (found == null) return false
        main.post {
            index = found
            if (_state.value is ReaderState.Reading) speakCurrent() else savePosition()
        }
        return true
    }

    /** Número de trozos (para calcular «página»: aquí una «página» es un bloque de ~12 trozos). */
    fun seekToPage(page: Int) = main.post {
        if (chunks.isEmpty()) return@post
        index = ((page - 1) * 12).coerceIn(0, chunks.size - 1)
        if (_state.value is ReaderState.Reading) speakCurrent() else savePosition()
    }

    private fun speakCurrent() {
        val engine = tts ?: return
        if (index >= chunks.size) {
            finished()
            return
        }
        if (!requestFocus()) {
            // Otra app tiene el audio (SONI respondiendo, una llamada): empieza en cuanto lo suelte.
            pausedByFocus = true
            _state.value = ReaderState.Paused(title, index, chunks.size)
            return
        }
        applyVoice(engine)
        _state.value = ReaderState.Reading(title, index, chunks.size)
        savePosition()
        appContext?.let { ReaderService.refresh(it) }
        engine.speak(chunks[index], TextToSpeech.QUEUE_FLUSH, null, "reader-$index")
    }

    private fun onChunkDone(utteranceId: String?) = main.post {
        if (_state.value !is ReaderState.Reading || utteranceId != "reader-$index") return@post
        index++
        speakCurrent()
    }

    private fun finished() {
        index = 0
        savePosition()
        abandonFocus()
        _state.value = ReaderState.Idle
        val engine = tts
        engine?.speak("Terminé de leer $title.", TextToSpeech.QUEUE_FLUSH, null, "reader-end")
        appContext?.let { ReaderService.stop(it) }
    }

    private fun stopSpeaking() {
        tts?.stop()
    }

    private fun ensureTts(context: Context, onReady: () -> Unit) {
        if (tts != null && ttsReady) return onReady()
        if (tts != null) return
        tts = TextToSpeech(context) { status ->
            main.post {
                val engine = tts ?: return@post
                if (status != TextToSpeech.SUCCESS) {
                    tts = null
                    _state.value = ReaderState.Idle
                    return@post
                }
                engine.language = Locale.forLanguageTag("es")
                engine.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) = Unit
                    override fun onDone(utteranceId: String?) { onChunkDone(utteranceId) }
                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) { onChunkDone(utteranceId) }
                })
                ttsReady = true
                onReady()
            }
        }
    }

    private fun applyVoice(engine: TextToSpeech) {
        val settings = appContext?.let { SoniSettings.get(it).current } ?: return
        runCatching { SpeechOutput.pickVoice(engine, settings.voiceName)?.let { engine.voice = it } }
        engine.setPitch(settings.pitch)
        // Para leer libros, un poco más pausado que para responder.
        engine.setSpeechRate((settings.speechRate * 0.95f).coerceIn(0.6f, 1.6f))
    }

    // ---------------------------------------------------------------- audio compartido

    private val focusListener = AudioManager.OnAudioFocusChangeListener { change ->
        main.post {
            when (change) {
                AudioManager.AUDIOFOCUS_LOSS_TRANSIENT, AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> {
                    focusLost = true
                    if (_state.value is ReaderState.Reading) {
                        stopSpeaking()
                        pausedByFocus = true
                        _state.value = ReaderState.Paused(title, index, chunks.size)
                    }
                }
                AudioManager.AUDIOFOCUS_GAIN -> {
                    focusLost = false
                    if (pausedByFocus && _state.value is ReaderState.Paused) {
                        pausedByFocus = false
                        speakCurrent()
                    }
                }
                AudioManager.AUDIOFOCUS_LOSS -> if (_state.value is ReaderState.Reading) {
                    focusLost = false
                    stopSpeaking()
                    pausedByFocus = false
                    _state.value = ReaderState.Paused(title, index, chunks.size)
                    focusRequest = null
                }
            }
            appContext?.let { ReaderService.refresh(it) }
        }
    }

    private fun requestFocus(): Boolean {
        if (focusRequest != null) return true
        val am = appContext?.getSystemService(AudioManager::class.java) ?: return true
        val request = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
            )
            .setWillPauseWhenDucked(true)
            .setAcceptsDelayedFocusGain(true)
            .setOnAudioFocusChangeListener(focusListener, main)
            .build()
        return when (am.requestAudioFocus(request)) {
            AudioManager.AUDIOFOCUS_REQUEST_GRANTED -> { focusRequest = request; focusLost = false; true }
            // Retrasado: Android avisará con AUDIOFOCUS_GAIN cuando quede libre.
            AudioManager.AUDIOFOCUS_REQUEST_DELAYED -> { focusRequest = request; focusLost = true; false }
            else -> false
        }
    }

    private fun abandonFocus() {
        focusLost = false
        val request = focusRequest ?: return
        appContext?.getSystemService(AudioManager::class.java)?.abandonAudioFocusRequest(request)
        focusRequest = null
    }

    // ---------------------------------------------------------------- posición guardada

    private fun prefs(context: Context) = context.getSharedPreferences("soni_reader", Context.MODE_PRIVATE)

    private fun savedPosition(context: Context, path: String): Int = prefs(context).getInt("pos:$path", 0)

    private fun savePosition() {
        val context = appContext ?: return
        prefs(context).edit().putInt("pos:$path", index).putString(LAST_PATH, path).apply()
    }

    private const val LAST_PATH = "last_path"
}
