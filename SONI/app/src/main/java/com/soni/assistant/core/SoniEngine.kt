package com.soni.assistant.core

import android.Manifest
import android.content.Context
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
    // Generoso porque investigar en internet puede tardar; las herramientas locales responden al instante.
    private val toolTimeoutMs: Long = 40_000,
    private val confirmationTtlMs: Long = 2 * 60_000,
    /** IA opcional para lo que las reglas locales no entienden. Sin ella, SONI funciona solo con reglas. */
    private val brain: SoniBrain? = null,
) {

    internal class PendingConfirmation(val id: String, val action: Action, val expiresAt: Long)

    private val pendingLock = Mutex()
    private var pending: PendingConfirmation? = null

    /** Conversación de varios pasos en curso (por ejemplo, conocer a una persona). */
    @Volatile
    private var activeFlow: ConversationFlow? = null

    @Volatile
    private var lastFlowActivity = 0L

    /** true si SONI acaba de hacer una pregunta y espera la respuesta (sin decir «SONI» otra vez). */
    val isInConversation: Boolean
        get() {
            if (activeFlow != null && System.currentTimeMillis() - lastFlowActivity > FLOW_EXPIRY_MS) activeFlow = null
            return activeFlow != null
        }

    /** Abandona la conversación en curso (el usuario se fue o no contesta). */
    fun cancelConversation() {
        activeFlow = null
    }

    /** Ejecuta una acción ya decidida (por ejemplo, una imagen compartida con SONI). */
    suspend fun process2(action: Action): ActionResult {
        startFlowIfAny(action)?.let { return it }
        return runTool(action, confirmed = false)
    }

    suspend fun process(input: String): ActionResult {
        if (isInConversation) activeFlow?.let { flow ->
            lastFlowActivity = System.currentTimeMillis()
            return continueFlow(flow, input)
        }
        return when (val action = withOriginalText(parser.parse(input), input)) {
            Action.Greeting -> ActionResult.Success(
                message = "Hola, aquí estoy. Dime qué necesitas: abrir apps, poner música, llamar, buscar información…",
                spokenMessage = "Hola, aquí estoy. ¿Qué necesitas?",
                actionLabel = "Saludo",
            )
            Action.Help -> generateHelpResult()
            is Action.Unknown -> askBrain(input) ?: ActionResult.Failed(
                message = "Todavía no sé hacer eso. Para entender cualquier orden, configura la clave de Gemini " +
                    "(GEMINI_API_KEY en local.properties).",
                spokenMessage = "Todavía no sé hacer eso.",
                reason = FailureReason.UNKNOWN_COMMAND,
            )
            else -> {
                startFlowIfAny(action)?.let { return it }
                val result = runTool(action, confirmed = false)
                // Las reglas creyeron entender pero el dato no sirvió (p. ej. una app que no existe):
                // se le da una segunda oportunidad a la IA con la frase original.
                if (result is ActionResult.Failed && result.reason == FailureReason.INVALID_INPUT) {
                    askBrain(input) ?: result
                } else {
                    result
                }
            }
        }
    }

    /** Devuelve el texto libre (mensajes, notas, recordatorios) con las tildes y mayúsculas originales. */
    private fun withOriginalText(action: Action, raw: String): Action {
        fun keep(fragment: String) = OriginalText.recover(raw, fragment) ?: fragment
        return when (action) {
            is Action.SendWhatsApp -> action.copy(message = keep(action.message))
            is Action.SendSms -> action.copy(message = keep(action.message))
            is Action.AddNote -> action.copy(text = keep(action.text))
            is Action.SetReminder -> if (action.text == "lo que me pediste") action else action.copy(text = keep(action.text))
            else -> action
        }
    }

    private suspend fun continueFlow(flow: ConversationFlow, input: String): ActionResult {
        if (CANCEL_FLOW.containsMatchIn(parser.normalize(input))) {
            activeFlow = null
            return ActionResult.Success(message = "Listo, lo dejamos ahí.", actionLabel = "Conversación cancelada")
        }
        val reply = try {
            flow.next(input)
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            FlowReply("Se me enredó la conversación. Empecemos de nuevo cuando quieras.", finished = true)
        }
        if (reply.finished) activeFlow = null
        return ActionResult.Success(message = reply.message, actionLabel = reply.label)
    }

    /** Si una herramienta abre conversación para esta acción, la empieza. */
    private suspend fun startFlowIfAny(action: Action): ActionResult? {
        val starter = registry.all().firstOrNull { it is ConversationStarter && it.canHandle(action) } as? ConversationStarter
            ?: return null
        val flow = starter.startFlow(action) ?: return null
        val reply = flow.start()
        activeFlow = if (reply.finished) null else flow
        lastFlowActivity = System.currentTimeMillis()
        return ActionResult.Success(message = reply.message, actionLabel = reply.label)
    }

    /** Pregunta a la IA. Devuelve null si no hay IA configurada. */
    private suspend fun askBrain(input: String): ActionResult? {
        val activeBrain = brain ?: return null
        val decision = try {
            activeBrain.decide(input)
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            BrainDecision.Error("La IA no respondió. Intenta de nuevo.")
        }
        return when (decision) {
            // La acción elegida por la IA pasa por los mismos permisos y confirmaciones que las demás.
            is BrainDecision.Run -> when (decision.action) {
                Action.Help -> generateHelpResult()
                Action.Greeting, is Action.Unknown -> null
                else -> startFlowIfAny(decision.action) ?: runTool(decision.action, confirmed = false)
            }
            is BrainDecision.Answer -> ActionResult.Success(message = decision.text, actionLabel = decision.label)
            is BrainDecision.Error -> ActionResult.Failed(
                message = decision.message,
                reason = FailureReason.UNEXPECTED,
                actionLabel = "IA no disponible",
            )
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

    private fun generateHelpResult(): ActionResult {
        val isMicGranted = permissions.missing(listOf(Manifest.permission.RECORD_AUDIO)).isEmpty()
        val micStatusLabel = if (isMicGranted) "Concedido" else "Sin conceder"
        val micSpokenLabel = if (isMicGranted) "concedido" else "sin conceder"

        val toolsInfo = registry.all().joinToString("\n") { tool ->
            val formattedName = tool.name.replace('_', ' ')
                .replaceFirstChar { if (it.isLowerCase()) it.titlecase(SoniLocale.locale) else it.toString() }
            val permText = if (tool.requiredPermissions.isEmpty()) {
                "Sin permisos especiales requeridos"
            } else {
                val missing = permissions.missing(tool.requiredPermissions)
                if (missing.isEmpty()) {
                    "Permisos concedidos: " + tool.requiredPermissions.joinToString(", ") { PermissionManager.label(it) }
                } else {
                    "Falta permiso de: " + missing.joinToString(", ") { PermissionManager.label(it) }
                }
            }
            "• **$formattedName**: ${tool.description} ($permText)"
        }

        val message = "Esto es todo lo que puedo hacer hasta ahora y el estado de mis permisos:\n\n" +
                "• **Micrófono (Entrada de voz)**: $micStatusLabel\n" +
                toolsInfo + "\n\n" +
                "Ejemplos de órdenes que puedes probar:\n" +
                "- «Qué hora es» / «Qué día es hoy»\n" +
                "- «Cuánto es la raíz cuadrada de 2025» / «15 por 4»\n" +
                "- «Cuántos kilómetros son 10 millas» / «25°C a °F»\n" +
                "- «Batería» / «Almacenamiento» / «Linterna» / «Volumen al 50%»\n" +
                "- «Abre WhatsApp» / «Abre Spotify» / «Abre YouTube»\n" +
                "- «Reproduce» / «Pausa» / «Siguiente canción» / «Pon Coldplay»\n" +
                "- «Busca el contacto Carlos» / «Guarda el contacto Ana con 3001234567»\n" +
                "- «Llama a Mamá» / «WhatsApp a Mamá diciendo ya voy en camino»\n" +
                "- «Acciones» o «Qué haces»"

        val spokenMessage = "Hasta ahora puedo decirte la hora y la fecha, hacer cálculos científicos, convertir unidades y divisas, consultar tu batería, almacenamiento y memoria, encender la linterna, cambiar el volumen, abrir cualquier aplicación instalada, controlar la música y reproducir en Spotify, buscar o guardar contactos, hacer llamadas y enviar mensajes por SMS o WhatsApp. El micrófono está $micSpokenLabel."

        return ActionResult.Success(
            message = message,
            spokenMessage = spokenMessage,
            actionLabel = "Acciones y permisos",
        )
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
        private const val FLOW_EXPIRY_MS = 3 * 60_000L

        private val CANCEL_FLOW = Regex("^(?:cancela|cancelar|olvidalo|dejalo|deja eso|ya no|no importa|salir|para)\\b")

        fun defaultTools(context: Context? = null): List<SoniTool> {
            val tools = mutableListOf<SoniTool>(TimeTool(), CalculatorTool(), com.soni.assistant.tools.UnitTool())
            if (context != null) {
                tools += com.soni.assistant.tools.DeviceTool(context)
                // Antes que la música: con un libro en curso, «pausa» es para la lectura.
                tools += com.soni.assistant.tools.DocumentTool(context)
                tools += com.soni.assistant.tools.AppLauncherTool(context)
                tools += com.soni.assistant.tools.MediaControlTool(context)
                tools += com.soni.assistant.tools.ContactsTool(context)
                tools += com.soni.assistant.tools.CommunicationTool(context)
                tools += com.soni.assistant.tools.WebSearchTool(context)
                tools += com.soni.assistant.tools.SoniControlTool(context)
                tools += com.soni.assistant.tools.ReminderTool(context)
                tools += com.soni.assistant.tools.NotesTool(context)
                tools += com.soni.assistant.tools.PeopleTool(context)
                tools += com.soni.assistant.tools.AvailabilityTool(context)
                tools += com.soni.assistant.tools.CallTool(context)
                tools += com.soni.assistant.tools.VisionTool(context)
                tools += com.soni.assistant.tools.InternetSpeedTool(context)
                tools += com.soni.assistant.tools.CameraTool(context)
            }
            return tools
        }

        /**
         * Motor con todas las herramientas. Con [context] se activan las herramientas del teléfono
         * y, si hay clave en local.properties, la IA de Gemini.
         */
        fun createDefault(
            permissions: PermissionChecker,
            logger: ActionLogger = ActionLogger.NONE,
            context: Context? = null,
            brain: SoniBrain? = null,
        ): SoniEngine =
            SoniEngine(
                registry = ToolRegistry(defaultTools(context)),
                permissions = permissions,
                logger = logger,
                brain = brain ?: context?.let { com.soni.assistant.ai.GeminiBrain.createOrNull(it) },
            )
    }
}
