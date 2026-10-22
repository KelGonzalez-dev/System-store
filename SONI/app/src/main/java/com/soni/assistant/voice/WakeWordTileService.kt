package com.soni.assistant.voice

import android.annotation.SuppressLint
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import com.soni.assistant.data.preferences.SoniPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

/** Botón de ajustes rápidos para activar o detener la escucha de «SONI». */
class WakeWordTileService : TileService() {

    private var scope: CoroutineScope? = null

    override fun onStartListening() {
        super.onStartListening()
        scope?.cancel()
        scope = MainScope().also { tileScope ->
            tileScope.launch { WakeWordController.state.collect(::render) }
        }
    }

    override fun onStopListening() {
        scope?.cancel()
        scope = null
        super.onStopListening()
    }

    override fun onClick() {
        super.onClick()
        if (WakeWordController.isRunning) {
            // Detener no necesita abrir nada.
            CoroutineScope(Dispatchers.IO).launch {
                SoniPreferences(applicationContext).setBackgroundListening(false)
            }
            WakeWordService.stop(this)
        } else if (isLocked) {
            unlockAndRun { openStarter() }
        } else {
            openStarter()
        }
    }

    /** Activar requiere que SONI esté visible un instante (regla de Android para el micrófono). */
    @SuppressLint("StartActivityAndCollapseDeprecated")
    private fun openStarter() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startActivityAndCollapse(StartListeningActivity.pendingIntent(this))
        } else {
            @Suppress("DEPRECATION")
            startActivityAndCollapse(StartListeningActivity.intent(this))
        }
    }

    private fun render(state: WakeWordState) {
        val tile = qsTile ?: return
        val active = state !is WakeWordState.Off && state !is WakeWordState.Failed
        tile.state = if (active) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
        tile.label = "SONI"
        tile.contentDescription = if (active) "SONI escuchando, pulsa para detener" else "Activar SONI"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            tile.subtitle = when (state) {
                WakeWordState.Off -> "Apagada"
                is WakeWordState.Failed -> "Detenida"
                WakeWordState.Loading -> "Preparando…"
                WakeWordState.Paused -> "En pausa"
                else -> "Escuchando"
            }
        }
        tile.updateTile()
    }
}
