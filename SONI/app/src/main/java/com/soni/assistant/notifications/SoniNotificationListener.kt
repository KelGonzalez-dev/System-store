package com.soni.assistant.notifications

import android.app.Notification
import android.app.RemoteInput
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.os.Bundle
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.soni.assistant.data.memory.MemoryText
import com.soni.assistant.data.settings.AvailabilitySettings
import com.soni.assistant.data.settings.SoniSettings

/**
 * Acceso a notificaciones de SONI. Tres usos:
 * 1. Control de música (saber qué suena y pasar de canción en el reproductor).
 * 2. Leer en voz alta las notificaciones que llegan (si está activado).
 * 3. Modo «no disponible»: si alguien insiste por WhatsApp, responder por ti desde la notificación.
 */
class SoniNotificationListener : NotificationListenerService() {

    /** Cuántos mensajes seguidos lleva cada chat de WhatsApp (clave: título del chat). */
    private val whatsappStreak = HashMap<String, Int>()
    private val alreadyRepliedTo = HashSet<String>()

    override fun onListenerConnected() {
        NotificationSpeaker.init(applicationContext)
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName == applicationContext.packageName) return
        val extras = sbn.notification.extras ?: return
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()?.trim().orEmpty()
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim().orEmpty()
        if (text.isBlank() && title.isBlank()) return
        if (sbn.notification.flags and Notification.FLAG_ONGOING_EVENT != 0) return // música, descargas, etc.

        val isWhatsApp = sbn.packageName in WHATSAPP_PACKAGES
        if (isWhatsApp) handleWhatsApp(sbn, title, text)

        if (AvailabilitySettings.get(applicationContext).current.readAloud && !sbn.isOngoing) {
            readAloud(sbn.packageName, title, text)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Si el usuario abre el chat, se reinicia la cuenta de ese contacto.
        if (sbn.packageName in WHATSAPP_PACKAGES) {
            val title = sbn.notification.extras?.getCharSequence(Notification.EXTRA_TITLE)?.toString()?.trim() ?: return
            whatsappStreak.remove(key(title))
        }
    }

    // ---------------------------------------------------------------- lectura en voz alta

    private fun readAloud(pkg: String, title: String, text: String) {
        val app = labelFor(pkg)
        val spoken = when {
            pkg in WHATSAPP_PACKAGES && title.isNotBlank() -> "$title te escribió por WhatsApp: $text"
            app != null && title.isNotBlank() -> "$app, $title: $text"
            app != null -> "$app: ${text.ifBlank { title }}"
            title.isNotBlank() -> "$title: $text"
            else -> text
        }
        NotificationSpeaker.announce(applicationContext, spoken)
    }

    private fun labelFor(pkg: String): String? = runCatching {
        val pm = packageManager
        pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
    }.getOrNull()

    // ---------------------------------------------------------------- modo no disponible

    private fun handleWhatsApp(sbn: StatusBarNotification, title: String, text: String) {
        val settings = AvailabilitySettings.get(applicationContext).current
        if (!settings.awayMode || title.isBlank()) return
        if (isGroupMessage(sbn)) return // no responder en grupos

        val key = key(title)
        val streak = (whatsappStreak[key] ?: 0) + 1
        whatsappStreak[key] = streak
        if (streak < settings.awayThreshold || key in alreadyRepliedTo) return

        val action = replyAction(sbn) ?: return
        val remoteInput = action.remoteInputs?.firstOrNull() ?: return
        val name = SoniSettings.get(applicationContext).current.userName.ifBlank { "mi dueño" }
        val message = settings.awayMessage.replace("{nombre}", name)

        val bundle = Bundle().apply { putCharSequence(remoteInput.resultKey, message) }
        val intent = Intent().addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        RemoteInput.addResultsToIntent(arrayOf(remoteInput), intent, bundle)
        try {
            action.actionIntent.send(applicationContext, 0, intent)
            alreadyRepliedTo.add(key)
            whatsappStreak[key] = 0
        } catch (e: Exception) {
            // La notificación caducó; se intentará en el próximo mensaje.
        }
    }

    private fun replyAction(sbn: StatusBarNotification): Notification.Action? {
        val actions = sbn.notification.actions ?: return null
        return actions.firstOrNull { action ->
            action.remoteInputs?.any { it.resultKey != null } == true &&
                MemoryText.plain(action.title?.toString() ?: "").let { "responder" in it || "reply" in it || "contestar" in it }
        } ?: actions.firstOrNull { it.remoteInputs?.isNotEmpty() == true }
    }

    private fun isGroupMessage(sbn: StatusBarNotification): Boolean {
        val extras = sbn.notification.extras ?: return false
        // En grupos, WhatsApp pone "Grupo: Persona" en EXTRA_TEXT o usa EXTRA_CONVERSATION_TITLE.
        if (!extras.getCharSequence(Notification.EXTRA_CONVERSATION_TITLE).isNullOrBlank()) return true
        return extras.getBoolean(Notification.EXTRA_IS_GROUP_CONVERSATION, false)
    }

    private fun key(title: String) = MemoryText.plain(title)

    companion object {
        val WHATSAPP_PACKAGES = setOf("com.whatsapp", "com.whatsapp.w4b")

        fun component(context: Context) = ComponentName(context, SoniNotificationListener::class.java)

        fun isEnabled(context: Context): Boolean {
            val flat = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners") ?: return false
            val me = component(context)
            return flat.split(':').any { ComponentName.unflattenFromString(it) == me }
        }

        fun openSettings(context: Context) {
            runCatching {
                context.startActivity(
                    Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                )
            }
        }

        fun activePlayer(context: Context): MediaController? {
            if (!isEnabled(context)) return null
            val msm = context.getSystemService(MediaSessionManager::class.java) ?: return null
            val sessions = runCatching { msm.getActiveSessions(component(context)) }.getOrNull().orEmpty()
            return sessions.firstOrNull { it.playbackState?.state == PlaybackState.STATE_PLAYING }
                ?: sessions.firstOrNull()
        }
    }
}
