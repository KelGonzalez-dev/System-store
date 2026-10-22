package com.soni.assistant.core

/**
 * Una entrada del registro de acciones: qué herramienta, cuándo, con qué riesgo y cómo terminó.
 *
 * A propósito NO contiene el texto de la orden ni el de la respuesta: podrían llevar datos
 * privados (nombres, números, mensajes). Solo lo necesario para saber qué hizo SONI.
 */
data class ActionLogEntry(
    val timestampMillis: Long,
    val toolName: String,
    val actionLabel: String,
    val riskLevel: RiskLevel,
    val state: ExecutionState,
)

fun interface ActionLogger {
    suspend fun record(entry: ActionLogEntry)

    companion object {
        val NONE = ActionLogger { }
    }
}
