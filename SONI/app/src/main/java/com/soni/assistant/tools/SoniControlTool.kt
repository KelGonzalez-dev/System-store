package com.soni.assistant.tools

import android.content.Context
import android.os.Handler
import android.os.Looper
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.data.preferences.SoniPreferences
import com.soni.assistant.voice.WakeWordService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/** Órdenes sobre el propio SONI: «apágate», «deja de escuchar». */
class SoniControlTool(private val context: Context) : SoniTool {

    override val name: String = "control_soni"
    override val description: String = "Apaga la escucha en segundo plano de SONI."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            if (SHUTDOWN.containsMatchIn(text)) Action.ShutdownSoni else null
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.ShutdownSoni

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.ShutdownSoni) {
            return ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)
        }
        val app = context.applicationContext
        // Se guarda la preferencia para que no vuelva a arrancar solo al reiniciar el teléfono.
        CoroutineScope(SupervisorJob() + Dispatchers.IO).launch {
            SoniPreferences(app).setBackgroundListening(false)
        }
        // Se detiene un poco después, para que alcance a despedirse en voz alta.
        Handler(Looper.getMainLooper()).postDelayed({ WakeWordService.stop(app) }, 2_500)
        return ActionResult.Success(
            message = "Listo, dejo de escuchar en segundo plano. Para volver a activarme, abre SONI.",
            spokenMessage = "Listo, me apago. Hasta luego.",
            actionLabel = "SONI apagado",
        )
    }

    private companion object {
        val SHUTDOWN = Regex(
            "^(?:por favor\\s+)?(?:apagate|apaga(?:te)?\\s+soni|desactivate|desconectate|duermete|vete a dormir|descansa|" +
                "deja de escuchar(?:me)?|ya no me escuches|modo descanso|chao soni|adios soni)\\b"
        )
    }
}
