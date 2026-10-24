package com.soni.assistant.documents

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import com.soni.assistant.R

/**
 * Mantiene viva la lectura con la pantalla apagada (servicio en primer plano de reproducción)
 * y muestra la notificación con Pausar / Continuar / Detener.
 */
class ReaderService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_PAUSE -> ReaderPlayer.pause()
            ACTION_RESUME -> ReaderPlayer.resume()
            ACTION_STOP -> {
                ReaderPlayer.stop()
                stopSelf()
                return START_NOT_STICKY
            }
        }
        val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK else 0
        runCatching { ServiceCompat.startForeground(this, NOTIFICATION_ID, notification(this), type) }
            .onFailure { stopSelf() }
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }

    companion object {
        private const val CHANNEL = "soni_reader"
        private const val NOTIFICATION_ID = 4201
        private const val ACTION_PAUSE = "com.soni.assistant.reader.PAUSE"
        private const val ACTION_RESUME = "com.soni.assistant.reader.RESUME"
        private const val ACTION_STOP = "com.soni.assistant.reader.STOP"

        /** Si Android no deja iniciar el servicio (segundo plano estricto), se lee igual dentro del proceso. */
        fun start(context: Context) {
            runCatching { ContextCompat.startForegroundService(context, Intent(context, ReaderService::class.java)) }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, ReaderService::class.java))
        }

        /** Actualiza la notificación (título, progreso, botón de pausa/continuar). */
        fun refresh(context: Context) {
            if (!ReaderPlayer.isActive) return
            runCatching { NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification(context)) }
        }

        private fun notification(context: Context): Notification {
            val nm = context.getSystemService(NotificationManager::class.java)
            nm?.createNotificationChannel(NotificationChannel(CHANNEL, "Lectura de documentos", NotificationManager.IMPORTANCE_LOW))

            fun action(name: String, code: Int) = PendingIntent.getService(
                context, code, Intent(context, ReaderService::class.java).setAction(name),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
            )

            val state = ReaderPlayer.state.value
            val (title, progress, reading) = when (state) {
                is ReaderState.Reading -> Triple(state.title, percent(state.chunk, state.total), true)
                is ReaderState.Paused -> Triple(state.title, percent(state.chunk, state.total), false)
                ReaderState.Idle -> Triple("Preparando lectura…", 0, true)
            }
            return NotificationCompat.Builder(context, CHANNEL)
                .setSmallIcon(R.drawable.ic_soni_listening)
                .setContentTitle(title)
                .setContentText(if (reading) "Leyendo · $progress %" else "En pausa · $progress %")
                .setProgress(100, progress, false)
                .setOngoing(reading)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .addAction(
                    0,
                    if (reading) "Pausar" else "Continuar",
                    action(if (reading) ACTION_PAUSE else ACTION_RESUME, 1),
                )
                .addAction(0, "Detener", action(ACTION_STOP, 2))
                .build()
        }

        private fun percent(chunk: Int, total: Int) = if (total <= 0) 0 else (chunk * 100 / total).coerceIn(0, 100)
    }
}
