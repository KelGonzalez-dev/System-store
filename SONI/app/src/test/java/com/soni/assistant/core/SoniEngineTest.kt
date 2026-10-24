package com.soni.assistant.core

import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SoniEngineTest {

    private val engine = SoniEngine.createDefault(permissions = { emptyList() })

    @Test
    fun unaOrdenConocidaDevuelveExito() = runBlocking {
        val result = engine.process("cuánto es 6 por 7")
        assertTrue(result is ActionResult.Success)
        assertTrue(result.message.endsWith("= 42"))
        assertEquals("Cálculo realizado", result.actionLabel)
    }

    @Test
    fun unaOrdenDesconocidaFallaSinFingirExito() = runBlocking {
        val result = engine.process("llama a mamá")
        assertTrue(result is ActionResult.Failed)
        assertEquals(FailureReason.UNKNOWN_COMMAND, (result as ActionResult.Failed).reason)
    }

    @Test
    fun unErrorDeCalculoSeExplica() = runBlocking {
        val result = engine.process("cuánto es 5 entre 0")
        assertTrue(result is ActionResult.Failed)
        assertTrue(result.message.contains("dividir entre cero"))
    }

    @Test
    fun consultaDeAccionesYPermisosMuestraInformacionDetallada() = runBlocking {
        val result = engine.process("SONI, acciones")
        assertTrue(result is ActionResult.Success)
        val success = result as ActionResult.Success
        assertTrue(success.message.contains("Micrófono"))
        assertTrue(success.message.contains("Fecha y hora"))
        assertTrue(success.message.contains("Calculadora"))
        assertEquals("Acciones y permisos", success.actionLabel)
    }
}
