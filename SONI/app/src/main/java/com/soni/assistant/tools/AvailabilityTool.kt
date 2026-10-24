package com.soni.assistant.tools

import android.content.Context
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.data.settings.AvailabilitySettings
import com.soni.assistant.notifications.SoniNotificationListener

/**
 * «Léeme las notificaciones», «ya no me las leas», «no estoy para responder mensajes»,
 * «ya puedo responder».
 */
class AvailabilityTool(private val context: Context) : SoniTool {

    override val name: String = "disponibilidad"
    override val description: String = "Activa o desactiva la lectura de notificaciones y el modo no disponible."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    private val settings by lazy { AvailabilitySettings.get(context) }

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            when {
                READ_ON.containsMatchIn(text) -> Action.SetReadNotifications(true)
                READ_OFF.containsMatchIn(text) -> Action.SetReadNotifications(false)
                AWAY_ON.containsMatchIn(text) -> Action.SetAwayMode(true)
                AWAY_OFF.containsMatchIn(text) -> Action.SetAwayMode(false)
                else -> null
            }
        }
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.SetReadNotifications || action is Action.SetAwayMode

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.SetReadNotifications -> toggleRead(action.enabled)
        is Action.SetAwayMode -> toggleAway(action.enabled)
        else -> ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)
    }

    private fun toggleRead(enabled: Boolean): ActionResult {
        if (enabled && !SoniNotificationListener.isEnabled(context)) {
            SoniNotificationListener.openSettings(context)
            return ActionResult.Failed(
                message = "Para leerte las notificaciones necesito «Acceso a notificaciones». Te abrí el ajuste; actívalo y vuelve a pedírmelo.",
                spokenMessage = "Necesito acceso a las notificaciones. Te abrí el ajuste.",
                reason = FailureReason.NO_TOOL,
                actionLabel = "Permiso de notificaciones",
            )
        }
        settings.update { it.copy(readAloud = enabled) }
        return ActionResult.Success(
            message = if (enabled) "Listo, te leeré las notificaciones que lleguen." else "Ya no te leeré las notificaciones.",
            spokenMessage = if (enabled) "Listo, te leeré las notificaciones." else "Listo, ya no te las leo.",
            actionLabel = "Notificaciones",
        )
    }

    private fun toggleAway(enabled: Boolean): ActionResult {
        if (enabled && !SoniNotificationListener.isEnabled(context)) {
            SoniNotificationListener.openSettings(context)
            return ActionResult.Failed(
                message = "El modo no disponible necesita «Acceso a notificaciones». Te abrí el ajuste; actívalo y vuelve a pedírmelo.",
                spokenMessage = "Necesito acceso a las notificaciones para eso. Te abrí el ajuste.",
                reason = FailureReason.NO_TOOL,
                actionLabel = "Permiso de notificaciones",
            )
        }
        settings.update { it.copy(awayMode = enabled) }
        val n = settings.current.awayThreshold
        return ActionResult.Success(
            message = if (enabled) {
                "Activé el modo no disponible. Si alguien te escribe más de $n veces por WhatsApp, le aviso por ti."
            } else {
                "Desactivé el modo no disponible. Ya respondes normal."
            },
            spokenMessage = if (enabled) "Listo, activé el modo no disponible." else "Listo, ya puedes responder normal.",
            actionLabel = "Modo no disponible",
        )
    }

    private companion object {
        val READ_ON = Regex("\\b(?:lee|leeme|leme)\\s+(?:las\\s+)?notificaciones\\b|\\bactiva\\s+(?:la lectura de\\s+)?(?:las\\s+)?notificaciones\\b")
        val READ_OFF = Regex("\\b(?:ya\\s+)?no\\s+(?:me\\s+)?leas\\s+(?:las\\s+)?notificaciones\\b|\\bdesactiva\\s+(?:la lectura de\\s+)?(?:las\\s+)?notificaciones\\b")
        val AWAY_ON = Regex("\\bno estoy (?:para|disponible)(?: para)? responder\\b|\\bmodo no disponible\\b|\\bactiva(?:r)? (?:el )?modo no disponible\\b|\\bno (?:voy a |puedo )?responder mensajes\\b|\\bestoy ocupad[oa]\\b")
        val AWAY_OFF = Regex("\\bya (?:puedo|estoy para) responder\\b|\\bdesactiva(?:r)? (?:el )?modo no disponible\\b|\\bya estoy disponible\\b|\\bvolvi\\b")
    }
}
