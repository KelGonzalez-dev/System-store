package com.soni.assistant.voice

import android.Manifest
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.soni.assistant.MainActivity
import com.soni.assistant.data.preferences.SoniPreferences
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull

/**
 * Pantalla transparente y sin contenido que activa la escucha en segundo plano.
 *
 * Android solo deja abrir el micrófono desde un servicio si la app está visible cuando se
 * inicia. El botón de ajustes rápidos y la notificación de arranque pasan por aquí; la
 * pantalla se cierra en cuanto el servicio está en marcha.
 */
class StartListeningActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            // El permiso se pide en contexto desde la pantalla principal.
            startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            finish()
            return
        }

        lifecycleScope.launch {
            SoniPreferences(this@StartListeningActivity).setBackgroundListening(true)
            WakeWordService.start(this@StartListeningActivity)
            withTimeoutOrNull(START_TIMEOUT_MS) {
                WakeWordController.state.first { it !is WakeWordState.Off && it !is WakeWordState.Failed }
            }
            finish()
        }
    }

    companion object {
        private const val START_TIMEOUT_MS = 2_000L

        fun intent(context: Context): Intent =
            Intent(context, StartListeningActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        fun pendingIntent(context: Context): PendingIntent = PendingIntent.getActivity(
            context,
            REQUEST_CODE,
            intent(context),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )

        private const val REQUEST_CODE = 1
    }
}
