package com.soni.assistant.core

import com.soni.assistant.tools.CalculatorTool
import com.soni.assistant.tools.TimeTool
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withTimeout
import java.util.UUID

/**
 * Orquesta una orden: texto → intención → herramienta registrada → permisos → riesgo → resultado.
 * La interpretación y la ejecución están separadas; nunca se ejecuta texto como código.
 *
 * Antes de ejecutar:
 * - Si faltan permisos, devuelve [ActionResult.NeedsPermission] y no ejecuta nada.
 * - Si la acción es de riesgo alto, devuelve [ActionResult.NeedsConfirmation] y solo la
 *   ejecuta cuando el usuario confirma con ese identificador (una vez y antes de que caduque).
 * Cada intento de usar una herramienta queda en el registro de acciones.
 */
class SoniEngine(
    private val registry: ToolRegistry,
    private val permissions: PermissionChecker,
    private val logger: ActionLogger = ActionLogger.NONE,
    private val parser: IntentParser = IntentParser(registry.intentRules()),
    private val clock: () -> Long = System::currentTimeMillis,
    private val toolTimeoutMs: Long = 5_000,
    private val confirmationTtlMs: Long = 2 * 60_000,
) {

    private class PendingConfirmation(val id: String, val action: Action, val expiresAt: Long)

    private val pendingLock = Mutex()
    private var pending: PendingConfirmation? = null

    suspend fun process(input: String): ActionResult {
        return when (val action = parser.parse(input)) {
            Action.Greeting -> ActionResult.Success(
                message = "Hola, aquí estoy. Puedo decirte la hora, la fecha o hacer cálculos.",
                actionLabel = "Saludo",
            )
            Action.Help -> ActionResult.Success(
                message = HELP_TEXT,
                spokenMessage = "Por ahora puedo decirte la hora, la fecha y hacer cálculos. Prueba con: cuánto es quince por tres.",
                actionLabel = "Ayuda",
            )
            is Action.Unknown -> ActionResult.Failed(
                message = "Todavía no sé hacer eso. Prueba con «qué hora es», «qué día es hoy» o «cuánto es 12 por 8».",
                spokenMessage = "Todavía no sé hacer eso. Prueba a preguntarme la hora o a pedirme un cálculo.",
                reason = FailureReason.UNKNOWN_COMMAND,
            )
            else -> runTool(action, confirmed = false)
        }
    }

    /** Ejecuta la acción pendiente si [confirmationId] es el que se mostró y no ha caducado. */
    suspend fun confirm(confirmationId: String): ActionResult {
        val confirmed = takePending(confirmationId)
            ?: return ActionResult.Failed(
                message = "Esa confirmación ya no es válida. Repite la orden si aún quieres hacerlo.",
                reason = FailureReason.CONFIRMATION_EXPIRED,
                actionLabel = "Confirmación caducada",
            )
        return runTool(confirmed.action, confirmed = true)
    }

    /** Descarta la acción pendiente. No se ejecuta nada. */
    suspend fun cancel(confirmationId: String): ActionResult {
        val cancelled = takePending(confirmationId)
        if (cancelled != null) {
            registry.findFor(cancelled.action)?.let { tool ->
                log(tool, cancelled.action, "Cancelada por ti", ExecutionState.FAILED)
            }
        }
        return ActionResult.Failed(
            message = "Acción cancelada. No hice nada.",
            reason = FailureReason.USER_CANCELLED,
            actionLabel = "Acción cancelada",
        )
    }

    private suspend fun runTool(action: Action, confirmed: Boolean): ActionResult {
        val tool = registry.findFor(action)
            ?: return ActionResult.Failed("No tengo una herramienta para esa acción.", FailureReason.NO_TOOL)

        val missing = permissions.missing(tool.permissionsFor(action))
        if (missing.isNotEmpty()) {
            val labels = missing.joinToString(", ") { PermissionManager.label(it) }
            val result = ActionResult.NeedsPermission(
                permissions = missing,
                message = "Para ${tool.describe(action)} necesito permiso de: $labels. " +
                    "Si no lo concedes, no haré nada.",
            )
            log(tool, action, result.actionLabel, result.state)
            return result
        }

        if (tool.riskOf(action) == RiskLevel.HIGH && !confirmed) {
            val id = UUID.randomUUID().toString()
            pendingLock.withLock { pending = PendingConfirmation(id, action, clock() + confirmationTtlMs) }
            val result = ActionResult.NeedsConfirmation(
                pendingAction = action,
                confirmationId = id,
                message = "Voy a ${tool.describe(action)}. ¿Lo confirmas?",
            )
            log(tool, action, result.actionLabel, result.state)
            return result
        }

        val result = try {
            withTimeout(toolTimeoutMs) { tool.execute(action) }
        } catch (e: TimeoutCancellationException) {
            ActionResult.Failed("La acción tardó demasiado y se canceló.", FailureReason.TIMEOUT)
        } catch (e: CancellationException) {
            throw e
        } catch (e: SecurityException) {
            // Un permiso retirado entre la comprobación y la ejecución.
            ActionResult.Failed("Android denegó la acción por falta de permisos.", FailureReason.UNEXPECTED)
        } catch (e: Exception) {
            ActionResult.Failed("Ocurrió un error inesperado al ejecutar la acción.", FailureReason.UNEXPECTED)
        }
        log(tool, action, result.actionLabel, result.state)
        return result
    }

    private suspend fun takePending(confirmationId: String): PendingConfirmation? = pendingLock.withLock {
        val current = pending?.takeIf { it.id == confirmationId }
        // Una confirmación se usa una sola vez, tanto si se acepta como si se rechaza.
        if (current != null) pending = null
        current?.takeIf { clock() <= it.expiresAt }
    }

    private suspend fun log(tool: SoniTool, action: Action, label: String, state: ExecutionState) {
        try {
            logger.record(
                ActionLogEntry(
                    timestampMillis = clock(),
                    toolName = tool.name,
                    actionLabel = label,
                    riskLevel = tool.riskOf(action),
                    state = state,
                )
            )
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            // El registro nunca debe impedir ni deshacer una acción.
        }
    }

    companion object {
        private const val HELP_TEXT =
            "Por ahora puedo:\n" +
                "• Decirte la hora: «qué hora es».\n" +
                "• Decirte la fecha: «qué día es hoy», «qué día es mañana».\n" +
                "• Hacer cálculos: «cuánto es 15 por 3», «el 20 por ciento de 80», «2 elevado a 10»."

        fun defaultTools(): List<SoniTool> = listOf(TimeTool(), CalculatorTool())

        fun createDefault(permissions: PermissionChecker, logger: ActionLogger = ActionLogger.NONE): SoniEngine =
            SoniEngine(
                registry = ToolRegistry(defaultTools()),
                permissions = permissions,
                logger = logger,
            )
    }
}
