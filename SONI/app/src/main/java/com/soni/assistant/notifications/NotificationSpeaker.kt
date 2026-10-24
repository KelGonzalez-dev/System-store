package com.soni.assistant.notifications

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.soni.assistant.data.settings.SoniSettings
import com.soni.assistant.documents.ReaderPlayer
import com.soni.assistant.voice.SpeechOutput
import com.soni.assistant.voice.WakeWordController
import com.soni.assistant.voice.WakeWordState
import java.util.ArrayDeque
import java.util.Locale

/**
 * Lee notificaciones en voz alta, una a una y sin pisar otras cosas: si SONI está escuchando una
 * orden o leyendo un libro, la notificación espera su turno en la cola.
 */
object NotificationSpeaker {

    private val main = Handler(Looper.getMainLooper())
    private val queue = ArrayDeque<String>()
    private var tts: TextToSpeech? = null
    private var ready = false
    private var speaking = false

    fun announce(context: Context, text: String) {
        val app = context.applicationContext
        appContext = app
        main.post {
            queue.addLast(text)
            ensureTts(app) { pump(app) }
        }
    }

    private fun pump(context: Context) {
        if (speaking || queue.isEmpty()) return
        // No interrumpir una orden en curso ni una llamada; reintentar en bloque luego.
        val state = WakeWordController.state.value
        if (state == WakeWordState.ListeningCommand || state == WakeWordState.Processing) {
            main.postDelayed({ pump(context) }, 1_500)
            return
        }
        if (ReaderPlayer.state.value is com.soni.assistant.documents.ReaderState.Reading) {
            main.postDelayed({ pump(context) }, 3_000)
            return
        }
        val engine = tts ?: return
        val text = queue.pollFirst() ?: return
        speaking = true
        applyVoice(engine)
        engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "notif")
    }

    private fun ensureTts(context: Context, onReady: () -> Unit) {
        if (ready) return onReady()
        if (tts != null) return
        tts = TextToSpeech(context) { status ->
            main.post {
                val engine = tts ?: return@post
                if (status != TextToSpeech.SUCCESS) { tts = null; return@post }
                engine.language = Locale.forLanguageTag("es")
                engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) = Unit
                    override fun onDone(utteranceId: String?) { main.post { speaking = false; pump(context) } }
                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) { main.post { speaking = false; pump(context) } }
                })
                ready = true
                onReady()
            }
        }
    }

    private fun applyVoice(engine: TextToSpeech) {
        val s = SoniSettings.get(appContext ?: return).current
        runCatching { SpeechOutput.pickVoice(engine, s.voiceName)?.let { engine.voice = it } }
        engine.setPitch(s.pitch)
        engine.setSpeechRate(s.speechRate)
    }

    private var appContext: Context? = null

    fun init(context: Context) { appContext = context.applicationContext }
}
