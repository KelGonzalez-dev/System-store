package com.soni.assistant.debug

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.speech.tts.TextToSpeech
import com.soni.assistant.voice.WakeWordService
import java.util.Locale

/**
 * Solo en compilaciones de depuración: permite probar la escucha en segundo plano con adb.
 *
 *   adb shell am broadcast -n com.soni.assistant/.debug.DebugVoiceReceiver -a com.soni.assistant.debug.WAKE
 *   adb shell am broadcast -n com.soni.assistant/.debug.DebugVoiceReceiver -a com.soni.assistant.debug.SAY --es text "Soni"
 *
 * SAY pronuncia el texto por el altavoz del teléfono para que lo oiga el micrófono.
 */
class DebugVoiceReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val appContext = context.applicationContext
        when (intent.action) {
            ACTION_WAKE -> appContext.startService(
                Intent(appContext, WakeWordService::class.java).setAction(WakeWordService.ACTION_SIMULATE_WAKE)
            )
            ACTION_SAY -> say(appContext, intent.getStringExtra("text").orEmpty())
        }
    }

    private fun say(context: Context, text: String) {
        if (text.isBlank()) return
        tts?.shutdown()
        var engine: TextToSpeech? = null
        engine = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                engine?.language = Locale.forLanguageTag("es-ES")
                engine?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "debug")
            }
        }
        tts = engine
    }

    private companion object {
        const val ACTION_WAKE = "com.soni.assistant.debug.WAKE"
        const val ACTION_SAY = "com.soni.assistant.debug.SAY"

        var tts: TextToSpeech? = null
    }
}
