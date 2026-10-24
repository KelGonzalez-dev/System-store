package com.soni.assistant.core

/**
 * Una conversación de varios pasos («¿cómo te llamas?» → «¿cuándo naciste?» → …).
 * Mientras hay una activa, el motor le pasa a ella lo que diga el usuario en lugar de
 * interpretarlo como una orden nueva.
 */
interface ConversationFlow {
    /** Primera respuesta al empezar la conversación. */
    suspend fun start(): FlowReply

    /** Lo siguiente que dijo el usuario. */
    suspend fun next(input: String): FlowReply
}

/** Respuesta de una conversación. Con [finished] = true el motor vuelve al modo normal. */
data class FlowReply(val message: String, val finished: Boolean, val label: String = "Conversación")

/** Herramienta que, para ciertas acciones, abre una conversación en vez de responder de una vez. */
interface ConversationStarter {
    fun startFlow(action: Action): ConversationFlow?
}
