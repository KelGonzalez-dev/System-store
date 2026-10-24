package com.soni.assistant.tools

import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import com.soni.assistant.calls.SoniCallService
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool

/** Contestar y colgar llamadas por voz: «contesta», «cuelga», «rechaza la llamada». */
class CallTool(private val context: Context) : SoniTool {

    override val name: String = "llamadas"
    override val description: String = "Contesta, cuelga y rechaza llamadas."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            when {
                ANSWER.containsMatchIn(text) -> Action.CallControl(answer = true)
                HANGUP.containsMatchIn(text) -> Action.CallControl(answer = false)
                else -> null
            }
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.CallControl

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.CallControl) return ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)

        if (!isDefaultPhoneApp()) {
            openDefaultDialerSettings()
            return ActionResult.Failed(
                message = "Para contestar y colgar por voz, ponme como app de teléfono predeterminada. Te abrí el ajuste.",
                spokenMessage = "Para manejar llamadas, ponme como tu app de teléfono. Te abrí el ajuste.",
                reason = FailureReason.NO_TOOL,
                actionLabel = "Permiso de llamadas",
            )
        }

        return if (action.answer) {
            if (!SoniCallService.hasIncomingCall) {
                ActionResult.Failed("No hay ninguna llamada entrando.", FailureReason.INVALID_INPUT, actionLabel = "Llamadas")
            } else if (SoniCallService.answer()) {
                ActionResult.Success(message = "Llamada contestada.", spokenMessage = "Contesto.", actionLabel = "Llamada contestada")
            } else {
                ActionResult.Failed("No pude contestar.", FailureReason.UNEXPECTED, actionLabel = "Llamadas")
            }
        } else {
            if (!SoniCallService.hasAnyCall) {
                ActionResult.Failed("No hay ninguna llamada ahora mismo.", FailureReason.INVALID_INPUT, actionLabel = "Llamadas")
            } else {
                val wasRinging = SoniCallService.hasIncomingCall
                if (SoniCallService.hangUp()) {
                    ActionResult.Success(
                        message = if (wasRinging) "Llamada rechazada." else "Llamada colgada.",
                        spokenMessage = if (wasRinging) "La rechacé." else "Colgué.",
                        actionLabel = "Llamada finalizada",
                    )
                } else {
                    ActionResult.Failed("No pude colgar.", FailureReason.UNEXPECTED, actionLabel = "Llamadas")
                }
            }
        }
    }

    private fun isDefaultPhoneApp(): Boolean = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val rm = context.getSystemService(android.app.role.RoleManager::class.java)
        runCatching { rm?.isRoleHeld(android.app.role.RoleManager.ROLE_DIALER) == true }.getOrDefault(false)
    } else {
        val tm = context.getSystemService(android.telecom.TelecomManager::class.java)
        @Suppress("DEPRECATION")
        runCatching { tm?.defaultDialerPackage == context.packageName }.getOrDefault(false)
    }

    private fun openDefaultDialerSettings() {
        val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val rm = context.getSystemService(android.app.role.RoleManager::class.java)
            rm?.createRequestRoleIntent(android.app.role.RoleManager.ROLE_DIALER)
        } else {
            @Suppress("DEPRECATION")
            Intent(android.telecom.TelecomManager.ACTION_CHANGE_DEFAULT_DIALER)
                .putExtra(android.telecom.TelecomManager.EXTRA_CHANGE_DEFAULT_DIALER_PACKAGE_NAME, context.packageName)
        }
        intent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)?.let { runCatching { context.startActivity(it) } }
    }

    private companion object {
        val ANSWER = Regex("\\b(?:contesta|contestar|responde|responder|acepta)\\s*(?:la\\s+)?(?:llamada|el telefono)?\\b|^contesta$|^responde$")
        val HANGUP = Regex("\\b(?:cuelga|colgar|cuelgala|rechaza|rechazar|corta|termina)\\s*(?:la\\s+)?(?:llamada|el telefono)?\\b|^cuelga$|^rechaza$")
    }
}
