package com.soni.assistant.core

import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ConversationFlowTest {

    /** Herramienta de prueba: «pregúntame» abre una conversación de dos pasos. */
    private class AskTool : SoniTool, ConversationStarter {
        override val name = "pregunta"
        override val description = "prueba"
        override val requiredPermissions = emptyList<String>()
        override val riskLevel = RiskLevel.LOW
        override val intentRules = listOf(
            IntentRule(IntentPriority.EXPLICIT_COMMAND) { if (it == "preguntame") Action.MeetPerson(null) else null }
        )
        override fun canHandle(action: Action) = action is Action.MeetPerson
        override suspend fun execute(action: Action) = ActionResult.Success("no debería usarse", "prueba")
        override fun startFlow(action: Action) = object : ConversationFlow {
            override suspend fun start() = FlowReply("¿Cómo te llamas?", finished = false)
            override suspend fun next(input: String) = FlowReply("Hola, $input", finished = true)
        }
    }

    @Test
    fun laConversacionRecibeLaRespuestaSinInterpretarlaComoOrden() = runBlocking {
        val engine = SoniEngine(registry = ToolRegistry(listOf(AskTool(), com.soni.assistant.tools.TimeTool())), permissions = { emptyList() })
        assertEquals("¿Cómo te llamas?", engine.process("preguntame").message)
        assertTrue(engine.isInConversation)
        // «Qué hora es» sería una orden, pero aquí es la respuesta a la pregunta.
        assertEquals("Hola, que hora es", engine.process("que hora es").message)
        assertFalse(engine.isInConversation)
    }

    @Test
    fun sePuedeCancelar() = runBlocking {
        val engine = SoniEngine(registry = ToolRegistry(listOf(AskTool())), permissions = { emptyList() })
        engine.process("preguntame")
        engine.process("cancelar")
        assertFalse(engine.isInConversation)
    }

    @Test
    fun recuperaTildesYMayusculas() {
        assertEquals("Mami te amo ❤️", OriginalText.recover("SONI, envíale un mensaje a mi mamá, que diga, Mami te amo ❤️", "mami te amo ❤"))
        assertEquals("llamar a Andrés", OriginalText.recover("Recuérdame en 20 minutos llamar a Andrés", "llamar a andres"))
    }
}
