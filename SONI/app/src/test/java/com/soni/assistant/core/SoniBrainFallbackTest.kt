package com.soni.assistant.core

import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SoniBrainFallbackTest {

    @Test
    fun loQueLasReglasNoEntiendenLoRespondeLaIA() = runBlocking {
        val engine = SoniEngine.createDefault(
            permissions = { emptyList() },
            brain = { BrainDecision.Answer("Hoy hace 24 grados en Bogotá.", "Búsqueda en Google") },
        )
        val result = engine.process("qué temperatura hace afuera")
        assertTrue(result is ActionResult.Success)
        assertEquals("Hoy hace 24 grados en Bogotá.", result.message)
    }

    @Test
    fun laAccionElegidaPorLaIAPasaPorElMotor() = runBlocking {
        val engine = SoniEngine.createDefault(
            permissions = { emptyList() },
            brain = { BrainDecision.Run(Action.TellTime) },
        )
        val result = engine.process("oye dime cómo va el reloj")
        assertTrue(result is ActionResult.Success)
        assertEquals("Hora consultada", result.actionLabel)
    }

    @Test
    fun siLaIAFallaSeDiceSinFingirExito() = runBlocking {
        val engine = SoniEngine.createDefault(
            permissions = { emptyList() },
            brain = { BrainDecision.Error("No tengo conexión a internet.") },
        )
        val result = engine.process("cuéntame un chiste")
        assertTrue(result is ActionResult.Failed)
        assertEquals("No tengo conexión a internet.", result.message)
    }

    @Test
    fun lasOrdenesConocidasNoGastanIA() = runBlocking {
        var calls = 0
        val engine = SoniEngine.createDefault(
            permissions = { emptyList() },
            brain = { calls++; BrainDecision.Error("no debería llamarse") },
        )
        engine.process("cuánto es 6 por 7")
        assertEquals(0, calls)
    }
}
