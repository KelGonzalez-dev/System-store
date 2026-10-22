package com.soni.assistant.voice

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.soni.assistant.MainActivity
import com.soni.assistant.R

/** Notificaciones de la escucha en segundo plano. */
object WakeWordNotifications {

    const val LISTENING_ID = 1
    private const val ACTIVATE_ID = 2

    private const val CHANNEL_LISTENING = "soni_listening"
    private const val CHANNEL_ACTIVATE = "soni_activate"

    fun createChannels(context: Context) {
        val manager = context.getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_LISTENING, "Escucha en segundo plano", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Aviso permanente mientras SONI espera la palabra «SONI»."
                setShowBadge(false)
            }
        )
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_ACTIVATE, "Activación de SONI", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Aviso tras encender el teléfono para volver a activar la escucha."
            }
        )
    }

    /** Notificación permanente del servicio. Muestra el estado real del micrófono. */
    fun listening(context: Context, state: WakeWordState): Notification {
        val text = when (state) {
            WakeWordState.Loading -> "Preparando el modelo de voz local…"
            WakeWordState.Waiting -> "Micrófono activo, esperando «SONI». El audio se procesa en el teléfono."
            WakeWordState.Paused -> "En pausa mientras usas el micrófono dentro de la app."
            WakeWordState.ListeningCommand -> "Te escucho. Di tu orden."
            WakeWordState.Processing -> "Procesando tu orden…"
            is WakeWordState.Responded -> state.message
            is WakeWordState.Failed -> state.message
            WakeWordState.Off -> "Escucha detenida."
        }
        val stopIntent = PendingIntent.getService(
            context,
            0,
            Intent(context, WakeWordService::class.java).setAction(WakeWordService.ACTION_STOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        return NotificationCompat.Builder(context, CHANNEL_LISTENING)
            .setSmallIcon(R.drawable.ic_soni_listening)
            .setContentTitle("SONI")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(openAppIntent(context))
            .addAction(0, "Detener", stopIntent)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()
    }

    /**
     * Android no deja abrir el micrófono desde segundo plano (por ejemplo, al encender el
     * teléfono), así que se pide al usuario un toque para activar la escucha.
     */
    fun showTapToActivate(context: Context) {
        if (!canPostNotifications(context)) return
        val notification = NotificationCompat.Builder(context, CHANNEL_ACTIVATE)
            .setSmallIcon(R.drawable.ic_soni_listening)
            .setContentTitle("Toca para activar SONI")
            .setContentText("Android necesita un toque tuyo para que SONI vuelva a escuchar «SONI».")
            .setContentIntent(StartListeningActivity.pendingIntent(context))
            .setAutoCancel(true)
            .build()
        NotificationManagerCompat.from(context).notify(ACTIVATE_ID, notification)
    }

    fun cancelTapToActivate(context: Context) {
        NotificationManagerCompat.from(context).cancel(ACTIVATE_ID)
    }

    fun canPostNotifications(context: Context): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED

    private fun openAppIntent(context: Context): PendingIntent = PendingIntent.getActivity(
        context,
        0,
        Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
    )
}
