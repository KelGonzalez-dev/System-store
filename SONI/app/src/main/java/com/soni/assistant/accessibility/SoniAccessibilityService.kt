package com.soni.assistant.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.os.SystemClock
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Las «manos» de SONI dentro de otras apps.
 *
 * Por ahora solo hace una cosa, y solo cuando SONI se lo pide: pulsar «Enviar» en WhatsApp
 * después de que SONI abre el chat con el mensaje ya escrito. Está limitado a WhatsApp en
 * res/xml/soni_accessibility.xml, así que no lee ninguna otra app.
 */
class SoniAccessibilityService : AccessibilityService() {

    override fun onServiceConnected() {
        instance = this
    }

    override fun onDestroy() {
        if (instance === this) instance = null
        super.onDestroy()
    }

    override fun onInterrupt() = Unit

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val pkg = event?.packageName?.toString() ?: return

        if (pkg in WHATSAPP_PACKAGES && SystemClock.elapsedRealtime() <= pendingSendUntil) {
            val root = rootInActiveWindow ?: return
            val sendButton = findSendButton(root, pkg) ?: return
            if (sendButton.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                pendingSendUntil = 0L
                lastSentAt = SystemClock.elapsedRealtime()
            }
            return
        }

        if (pkg == SpotifyAutoPlay.SPOTIFY && SpotifyAutoPlay.isPending) {
            val root = rootInActiveWindow ?: return
            if (tapFirstSpotifyResult(root)) SpotifyAutoPlay.consume()
        }
    }

    /**
     * Toca el primer resultado de la búsqueda de Spotify. Busca una fila de canción y la pulsa;
     * si la fila no es pulsable, sube al contenedor que sí lo sea.
     */
    private fun tapFirstSpotifyResult(root: AccessibilityNodeInfo): Boolean {
        // Los resultados suelen tener este id; si cambia, se intenta por el primer elemento de la lista.
        val candidates = root.findAccessibilityNodeInfosByViewId("$SPOTIFY_PKG:id/row_root") +
            root.findAccessibilityNodeInfosByViewId("$SPOTIFY_PKG:id/content")
        val first = candidates.firstOrNull { it.isVisibleToUser }
            ?: firstClickableRow(root)
            ?: return false
        var node: AccessibilityNodeInfo? = first
        while (node != null && !node.isClickable) node = node.parent
        return node?.performAction(AccessibilityNodeInfo.ACTION_CLICK) == true
    }

    private fun firstClickableRow(node: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        // Recorre la pantalla y devuelve el primer elemento pulsable que parezca un resultado.
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            if (child.isClickable && child.isVisibleToUser && child.className?.contains("ViewGroup") == true) {
                return child
            }
            firstClickableRow(child)?.let { return it }
        }
        return null
    }

    private fun findSendButton(root: AccessibilityNodeInfo, pkg: String): AccessibilityNodeInfo? {
        root.findAccessibilityNodeInfosByViewId("$pkg:id/send").firstOrNull { it.isEnabled }?.let { return it }
        // Respaldo por si WhatsApp cambia el id: botón cuya descripción es «Enviar»/«Send».
        for (label in SEND_LABELS) {
            for (node in root.findAccessibilityNodeInfosByText(label)) {
                val description = node.contentDescription?.toString()?.trim()?.lowercase()
                if (node.isClickable && node.isEnabled && description in SEND_LABELS) return node
            }
        }
        return null
    }

    companion object {
        val WHATSAPP_PACKAGES = setOf("com.whatsapp", "com.whatsapp.w4b")
        private const val SPOTIFY_PKG = "com.spotify.music"
        private val SEND_LABELS = setOf("enviar", "send")

        @Volatile
        private var instance: SoniAccessibilityService? = null

        @Volatile
        private var pendingSendUntil: Long = 0L

        @Volatile
        var lastSentAt: Long = 0L
            private set

        /** true si el servicio está conectado ahora mismo. */
        val isConnected: Boolean get() = instance != null

        /** true si el usuario lo activó en Ajustes → Accesibilidad (aunque aún no se haya conectado). */
        fun isEnabled(context: Context): Boolean {
            if (instance != null) return true
            val me = ComponentName(context, SoniAccessibilityService::class.java)
            val enabled = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
            ) ?: return false
            return enabled.split(':').any { ComponentName.unflattenFromString(it) == me }
        }

        /** Abre la pantalla de Accesibilidad del sistema para que el usuario active a SONI. */
        fun openSettings(context: Context) {
            runCatching {
                context.startActivity(
                    Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                )
            }
        }

        /** Pide pulsar «Enviar» en WhatsApp durante los próximos [windowMs] milisegundos. */
        fun requestWhatsAppSend(windowMs: Long = 15_000) {
            pendingSendUntil = SystemClock.elapsedRealtime() + windowMs
        }
    }
}
