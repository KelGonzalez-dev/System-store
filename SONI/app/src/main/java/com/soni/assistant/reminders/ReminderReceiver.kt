package com.soni.assistant.reminders

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.soni.assistant.R
import com.soni.assistant.data.memory.ReminderStore
import com.soni.assistant.data.settings.SoniSettings
import com.soni.assistant.voice.SpeechOutput
import java.util.Locale

/** Cuando llega la hora: notificación y, además, SONI lo dice en voz alta. */
class ReminderReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val app = context.applicationContext
        val id = intent.getIntExtra(EXTRA_ID, 0)
        val text = intent.getStringExtra(EXTRA_TEXT) ?: return
        ReminderStore.get(app).remove(id)

        val settings = SoniSettings.get(app).current
        val name = settings.userName.ifBlank { "jefe" }
        val spoken = "Oye $name, te recuerdo: $text"

        showNotification(app, id, text)

        // Hablar tarda unos segundos: goAsync mantiene vivo el receptor mientras tanto (máx. ~10 s).
        val pending = goAsync()
        val handler = Handler(Looper.getMainLooper())
        var tts: TextToSpeech? = null
        var finished = false
        fun finish() {
            if (finished) return
            finished = true
            tts?.shutdown()
            pending.finish()
        }
        handler.postDelayed({ finish() }, 9_000)
        tts = TextToSpeech(app) { status ->
            val engine = tts
            if (status != TextToSpeech.SUCCESS || engine == null) {
                handler.post { finish() }
                return@TextToSpeech
            }
            engine.language = Locale.forLanguageTag("es")
            runCatching { SpeechOutput.pickVoice(engine, settings.voiceName)?.let { engine.voice = it } }
            engine.setPitch(settings.pitch)
            engine.setSpeechRate(settings.speechRate)
            engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) = Unit
                override fun onDone(utteranceId: String?) { handler.post { finish() } }
                @Deprecated("Deprecated in Java")
                override fun onError(utteranceId: String?) { handler.post { finish() } }
            })
            engine.speak(spoken, TextToSpeech.QUEUE_FLUSH, null, "reminder-$id")
        }
    }

    private fun showNotification(context: Context, id: Int, text: String) {
        val nm = context.getSystemService(NotificationManager::class.java) ?: return
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL, "Recordatorios", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "Recordatorios que le pides a SONI"
            }
        )
        val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val contentIntent = launch?.let {
            android.app.PendingIntent.getActivity(
                context, id, it, android.app.PendingIntent.FLAG_IMMUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT,
            )
        }
        val notification = NotificationCompat.Builder(context, CHANNEL)
            .setSmallIcon(R.drawable.ic_soni_listening)
            .setContentTitle("Recordatorio")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(contentIntent)
            .build()
        runCatching { NotificationManagerCompat.from(context).notify(id, notification) }
    }

    companion object {
        const val EXTRA_ID = "reminder_id"
        const val EXTRA_TEXT = "reminder_text"
        private const val CHANNEL = "soni_reminders"
    }
}
