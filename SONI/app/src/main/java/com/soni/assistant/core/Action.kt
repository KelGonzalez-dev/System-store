package com.soni.assistant.core

/**
 * Intenciones que SONI reconoce. Cada variante lleva sus parámetros ya tipados:
 * las herramientas nunca reciben texto libre sin validar.
 *
 * No es `sealed` para que cada herramienta nueva defina sus acciones junto a ella. Eso no
 * abre ninguna puerta: una acción solo se ejecuta si una herramienta del [ToolRegistry]
 * la acepta, y pasa siempre por la comprobación de permisos y riesgo del motor.
 */
interface Action {
    data object TellTime : Action
    data class TellDate(val dayOffset: Int = 0) : Action
    data class Calculate(val expression: String) : Action
    data object Greeting : Action
    data object Help : Action
    data class Unknown(val originalText: String) : Action
}
