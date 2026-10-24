package com.soni.assistant.voice

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager

/**
 * Avisos de batería en voz alta mientras SONI está activo:
 * cargador conectado/desconectado, batería al 100 % y batería baja.
 *
 * [speak] solo debe hablar si SONI está libre; si devuelve false, el aviso se reintenta
 * con el siguiente cambio de batería (Android los envía cada pocos minutos).
 */
class BatteryAnnouncer(
    private val context: Context,
    private val speak: (String) -> Boolean,
) {
    private var announcedFull = false
    private var announcedLow = false
    private var pending: String? = null
    private var registered = false
    private var initialized = false

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(ctx: Context, intent: Intent) {
            when (intent.action) {
                Intent.ACTION_POWER_CONNECTED -> {
                    announcedLow = false
                    say("Cargador conectado. Batería al ${level()} por ciento.")
                }
                Intent.ACTION_POWER_DISCONNECTED -> {
                    announcedFull = false
                    say("Cargador desconectado. Quedaste con ${level()} por ciento de batería.")
                }
                Intent.ACTION_BATTERY_CHANGED -> onBatteryChanged(intent)
            }
        }
    }

    fun start() {
        if (registered) return
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_POWER_CONNECTED)
            addAction(Intent.ACTION_POWER_DISCONNECTED)
            addAction(Intent.ACTION_BATTERY_CHANGED)
        }
        context.registerReceiver(receiver, filter)
        registered = true
    }

    fun stop() {
        if (!registered) return
        runCatching { context.unregisterReceiver(receiver) }
        registered = false
    }

    private fun onBatteryChanged(intent: Intent) {
        val level = percent(intent)
        val plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) != 0
        val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
        val full = level >= 100 || status == BatteryManager.BATTERY_STATUS_FULL

        // El primer aviso llega al registrarse: solo se toma nota del estado, sin hablar.
        if (!initialized) {
            initialized = true
            announcedFull = plugged && full
            announcedLow = !plugged && level <= LOW_LEVEL
            return
        }

        if (plugged && !announcedFull && full) {
            announcedFull = true
            say("Batería cargada al cien por ciento. Ya puedes desconectar el cargador.")
        }
        if (!plugged && level in 1..LOW_LEVEL && !announcedLow) {
            announcedLow = true
            say("Batería baja: te queda $level por ciento. Conecta el cargador.")
        }
        if (level > LOW_LEVEL + 5) announcedLow = false

        // Aviso que no se pudo decir antes (SONI estaba ocupado).
        pending?.let { message -> if (speak(message)) pending = null }
    }

    private fun say(message: String) {
        if (!speak(message)) pending = message
    }

    private fun level(): Int {
        val bm = context.getSystemService(BatteryManager::class.java)
        return bm?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)?.takeIf { it in 0..100 } ?: 0
    }

    private fun percent(intent: Intent): Int {
        val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
        val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, 100)
        return if (level >= 0 && scale > 0) level * 100 / scale else level()
    }

    private companion object {
        const val LOW_LEVEL = 15
    }
}
