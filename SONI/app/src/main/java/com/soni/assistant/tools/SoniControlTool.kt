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
            val greet = GREET_AUDIENCE.matchEntire(text)
            when {
                SILENCE.containsMatchIn(text) -> Action.SilenceSoni
                SHUTDOWN.containsMatchIn(text) -> Action.ShutdownSoni
                greet != null -> Action.Introduce(greet.groupValues[1].trim().ifBlank { null })
                INTRODUCE_SELF.containsMatchIn(text) -> Action.Introduce(null)
                else -> null
            }
        }
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.ShutdownSoni || action is Action.SilenceSoni || action is Action.Introduce

    override suspend fun execute(action: Action): ActionResult {
        val app = context.applicationContext
        return when (action) {
            is Action.SilenceSoni -> {
                // Modo silencio / «no molestar»: SONI se calla y no lee notificaciones,
                // pero sigue escuchando «SONI» para poder despertarlo con la voz.
                com.soni.assistant.voice.SoniRuntimeState.silence()
                ActionResult.Success(
                    message = "Modo silencio activado. No te molesto ni leo notificaciones. Di «SONI» cuando me necesites.",
                    spokenMessage = "Modo silencio. Avísame diciendo SONI cuando me necesites.",
                    actionLabel = "Modo silencio",
                )
            }
            is Action.ShutdownSoni -> {
                // Apagado total: además de dejar de escuchar, se silencia para que el lector de
                // notificaciones (que es un servicio aparte) deje de hablar de inmediato.
                com.soni.assistant.voice.SoniRuntimeState.silence()
                CoroutineScope(SupervisorJob() + Dispatchers.IO).launch {
                    SoniPreferences(app).setBackgroundListening(false)
                }
                // Se detiene un poco después, para que alcance a despedirse en voz alta.
                Handler(Looper.getMainLooper()).postDelayed({ WakeWordService.stop(app) }, 2_500)
                ActionResult.Success(
                    message = "Listo, dejo de escuchar en segundo plano. Para volver a activarme, abre SONI.",
                    spokenMessage = "Listo, me apago. Hasta luego.",
                    actionLabel = "SONI apagado",
                )
            }
            is Action.Introduce -> {
                val owner = com.soni.assistant.data.settings.SoniSettings.get(app).current.userName.ifBlank { "Kelmer" }
                val target = action.target?.lowercase() ?: ""
                val esIglesia = "iglesia" in target || "hermano" in target || "herman" in target
                val saludo = when {
                    esIglesia -> "¡Dios les bendiga, hermanos!"
                    action.target != null -> "¡Un saludo a ${action.target}!"
                    else -> "¡Hola a todos!"
                }
                val mensaje = "$saludo Soy SONI, un asistente de voz. Fui programado y desarrollado por " +
                    "$owner, con la ayuda de Claude, de Anthropic. Es un gusto saludarlos."
                ActionResult.Success(
                    message = mensaje,
                    spokenMessage = mensaje,
                    actionLabel = "Presentación",
                )
            }
            else -> ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)
        }
    }

    private companion object {
        val SHUTDOWN = Regex(
            "^(?:por favor\\s+)?(?:apagate|apaga(?:te)?\\s+soni|desactivate|desconectate|duermete|vete a dormir|descansa|" +
                "deja de escuchar(?:me)?|ya no me escuches|modo descanso|chao soni|adios soni)\\b"
        )
        val SILENCE = Regex(
            "^(?:por favor\\s+)?(?:modo silencio|no molestar|modo no molestar|silencio|callate|" +
                "guarda silencio|ponte en silencio|no me molestes|quedate callado|quedate en silencio)\\b"
        )
        // «saluda a la iglesia», «saluda a todos»… SONI se presenta ante ese público.
        val GREET_AUDIENCE = Regex("^(?:saluda a|saluda|presentate con|presentate ante)\\s*(.*)$")
        // «preséntate», «quién eres», «quién te desarrolló»… SONI se presenta.
        val INTRODUCE_SELF = Regex(
            "^(?:presentate|quien eres|que eres|quien te creo|quien te desarrollo|quien te programo|" +
                "quien te hizo|preséntate)\\b"
        )
    }
}
