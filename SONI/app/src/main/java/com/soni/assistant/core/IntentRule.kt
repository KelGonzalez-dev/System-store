package com.soni.assistant.core

/**
 * Regla de intención que declara una herramienta. Recibe el texto ya normalizado
 * (minúsculas, sin tildes ni palabra de activación) y devuelve una [Action] tipada o null.
 *
 * Las reglas se prueban de menor a mayor [priority]; gana la primera que reconoce el texto.
 */
class IntentRule(val priority: Int, val match: (String) -> Action?)

/** Prioridades de referencia para que las herramientas no se pisen entre sí. */
object IntentPriority {
    /** Órdenes con un verbo inequívoco al principio («calcula…», «cuánto es…»). */
    const val EXPLICIT_COMMAND = 10

    /** Preguntas con palabras clave concretas («qué hora es»). */
    const val SPECIFIC_QUESTION = 20

    /** Peticiones de ayuda del propio SONI. */
    const val HELP = 40

    /** Interpretaciones amplias que solo valen si nada más encajó («15 por 4»). */
    const val FALLBACK = 50

    /** Saludos: lo último, para no tapar órdenes que empiezan con «hola». */
    const val GREETING = 90
}
