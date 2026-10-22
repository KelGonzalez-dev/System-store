package com.soni.assistant.core

/** Estados de ejecución definidos en el documento maestro (sección 6.1). */
enum class ExecutionState { PENDING, NEEDS_PERMISSION, NEEDS_CONFIRMATION, RUNNING, SUCCESS, FAILED }

enum class FailureReason {
    UNKNOWN_COMMAND,
    INVALID_INPUT,
    NO_TOOL,
    TIMEOUT,
    UNEXPECTED,
    USER_CANCELLED,
    CONFIRMATION_EXPIRED,
}

/**
 * Resultado estructurado de cualquier acción. Distingue éxito, error,
 * necesidad de permiso y necesidad de confirmación.
 */
sealed interface ActionResult {
    /** Texto que se muestra en pantalla. */
    val message: String

    /** Texto que se pronuncia (puede ser más corto que [message]). */
    val spokenMessage: String

    /** Etiqueta breve que indica qué acción se ejecutó, p. ej. «Hora consultada». */
    val actionLabel: String

    val state: ExecutionState

    data class Success(
        override val message: String,
        override val actionLabel: String,
        override val spokenMessage: String = message,
    ) : ActionResult {
        override val state: ExecutionState get() = ExecutionState.SUCCESS
    }

    data class Failed(
        override val message: String,
        val reason: FailureReason,
        override val actionLabel: String = "Sin acción",
        override val spokenMessage: String = message,
    ) : ActionResult {
        override val state: ExecutionState get() = ExecutionState.FAILED
    }

    /** Faltan permisos: la acción NO se ejecutó. La interfaz los pide y repite la orden. */
    data class NeedsPermission(
        val permissions: List<String>,
        override val message: String,
        override val actionLabel: String = "Permiso necesario",
    ) : ActionResult {
        override val spokenMessage: String get() = message
        override val state: ExecutionState get() = ExecutionState.NEEDS_PERMISSION
    }

    /**
     * Acción de riesgo alto pendiente: NO se ejecutó. Solo se ejecuta si el usuario confirma
     * con [confirmationId], que vale para esta acción concreta, una sola vez y por poco tiempo.
     */
    data class NeedsConfirmation(
        val pendingAction: Action,
        val confirmationId: String,
        override val message: String,
        override val actionLabel: String = "Confirmación necesaria",
    ) : ActionResult {
        override val spokenMessage: String get() = message
        override val state: ExecutionState get() = ExecutionState.NEEDS_CONFIRMATION
    }
}
