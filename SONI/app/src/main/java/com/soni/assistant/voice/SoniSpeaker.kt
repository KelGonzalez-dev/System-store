package com.soni.assistant.voice

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.soni.assistant.data.settings.SoniSettings
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.Locale
import kotlin.coroutines.resume

/**
 * Voz suelta para avisos puntuales (cuenta regresiva de la cámara, «di whiskey»…), con la voz
 * que el usuario eligió. Mantiene un único motor TTS reutilizable.
 */
object SoniSpeaker {

    private val main = Handler(Looper.getMainLooper())
    private var tts: TextToSpeech? = null
    private var ready = false
    private var pending: (() -> Unit)? = null

    /** Dice [text] y espera a que termine (para encadenar con pausas). */
    suspend fun say(context: Context, text: String) = suspendCancellableCoroutine<Unit> { cont ->
        val app = context.applicationContext
        main.post {
            ensure(app) {
                val engine = tts
                if (engine == null) { if (cont.isActive) cont.resume(Unit); return@ensure }
                applyVoice(app, engine)
                val id = "speak-${System.nanoTime()}"
                engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) = Unit
                    override fun onDone(utteranceId: String?) { if (cont.isActive) cont.resume(Unit) }
                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) { if (cont.isActive) cont.resume(Unit) }
                })
                engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, id)
            }
        }
        cont.invokeOnCancellation { main.post { tts?.stop() } }
    }

    private fun ensure(context: Context, onReady: () -> Unit) {
        if (ready) return onReady()
        pending = onReady
        if (tts != null) return
        tts = TextToSpeech(context) { status ->
            main.post {
                val engine = tts
                if (status != TextToSpeech.SUCCESS || engine == null) { tts = null; pending = null; return@post }
                engine.language = Locale.forLanguageTag("es")
                ready = true
                pending?.invoke()
                pending = null
            }
        }
    }

    private fun applyVoice(context: Context, engine: TextToSpeech) {
        val s = SoniSettings.get(context).current
        runCatching { SpeechOutput.pickVoice(engine, s.voiceName)?.let { engine.voice = it } }
        engine.setPitch(s.pitch)
        engine.setSpeechRate(s.speechRate)
    }
}
