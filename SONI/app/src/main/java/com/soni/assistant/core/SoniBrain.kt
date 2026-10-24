package com.soni.assistant.core

/**
 * Lo que decide la IA ante una orden que las reglas locales no entendieron.
 * La IA nunca ejecuta nada por sí misma: solo elige una [Action] tipada, que luego pasa
 * por el mismo control de permisos y riesgo del motor que cualquier otra orden.
 */
sealed interface BrainDecision {
    /** Ejecutar esta acción con las herramientas registradas. */
    data class Run(val action: Action) : BrainDecision

    /** Respuesta hablada (preguntas generales, clima, explicaciones…). */
    data class Answer(val text: String, val label: String = "Respuesta") : BrainDecision

    /** La IA no está disponible (sin internet, clave inválida, modelo inexistente…). */
    data class Error(val message: String) : BrainDecision
}

/** Cerebro opcional del motor. Separado de Android para poder probarlo con uno falso. */
fun interface SoniBrain {
    suspend fun decide(text: String): BrainDecision
}
