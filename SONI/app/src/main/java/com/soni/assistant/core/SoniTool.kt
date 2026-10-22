package com.soni.assistant.core

enum class RiskLevel { LOW, MEDIUM, HIGH }

/**
 * Contrato de herramientas (sección 6.2). Una herramienta declara qué puede hacer,
 * cómo se le piden las cosas, qué permisos necesita y su nivel de riesgo, y devuelve
 * siempre un [ActionResult].
 *
 * El motor comprueba permisos y riesgo ANTES de llamar a [execute]: una herramienta nunca
 * se ejecuta sin sus permisos ni, si es de riesgo alto, sin confirmación del usuario.
 */
interface SoniTool {
    val name: String
    val description: String
    val requiredPermissions: List<String>
    val riskLevel: RiskLevel

    /** Reglas con las que la herramienta reconoce sus propias órdenes. */
    val intentRules: List<IntentRule> get() = emptyList()

    fun canHandle(action: Action): Boolean

    /** Permisos que necesita esta acción concreta (p. ej. leer contactos frente a borrarlos). */
    fun permissionsFor(action: Action): List<String> = requiredPermissions

    /** Riesgo de esta acción concreta; por defecto, el de la herramienta. */
    fun riskOf(action: Action): RiskLevel = riskLevel

    /**
     * Qué va a ocurrir exactamente, en infinitivo y sin punto final («borrar el contacto «Ana»»).
     * Se muestra antes de pedir confirmación o permisos, así que debe ser concreto.
     */
    fun describe(action: Action): String = "usar la herramienta «$name»"

    suspend fun execute(action: Action): ActionResult
}
