package com.soni.assistant.core

/**
 * Registro cerrado de herramientas. Solo lo que está aquí puede ejecutarse:
 * ni el parser ni un futuro modelo de IA pueden inventar herramientas nuevas.
 */
class ToolRegistry(tools: List<SoniTool>) {

    private val tools: List<SoniTool> = tools.toList()

    init {
        val names = this.tools.map { it.name }
        require(names.size == names.toSet().size) { "Hay herramientas con nombres duplicados: $names" }
    }

    fun findFor(action: Action): SoniTool? = tools.firstOrNull { it.canHandle(action) }

    fun all(): List<SoniTool> = tools

    /** Reglas de intención de todas las herramientas registradas (y de ninguna más). */
    fun intentRules(): List<IntentRule> = tools.flatMap { it.intentRules }
}
