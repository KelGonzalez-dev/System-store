package com.soni.assistant.app

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.soni.assistant.data.preferences.SoniPreferences
import com.soni.assistant.voice.WakeWordNotifications
import com.soni.assistant.voice.WakeWordService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Al encender el teléfono, si el usuario dejó activada la escucha en segundo plano:
 * - Android 8–10: la reanuda directamente.
 * - Android 11+: el sistema no deja usar el micrófono sin que el usuario abra SONI
 *   (y Android 15 prohíbe incluso iniciar el servicio aquí), así que se publica una
 *   notificación «Toca para activar SONI».
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        val appContext = context.applicationContext
        val pending = goAsync()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                if (!SoniPreferences(appContext).isBackgroundListeningEnabled()) return@launch
                WakeWordNotifications.createChannels(appContext)
                val micGranted = ContextCompat.checkSelfPermission(appContext, Manifest.permission.RECORD_AUDIO) ==
                    PackageManager.PERMISSION_GRANTED
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q && micGranted) {
                    WakeWordService.start(appContext)
                } else {
                    WakeWordNotifications.showTapToActivate(appContext)
                }
            } finally {
                pending.finish()
            }
        }
    }
}
