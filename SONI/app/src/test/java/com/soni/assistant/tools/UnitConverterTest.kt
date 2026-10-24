package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.SoniEngine
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class UnitConverterTest {

    private val converter = UnitConverter()
    private val engine = SoniEngine.createDefault(permissions = { emptyList() })

    @Test
    fun convierteUnidadesDeLongitud() {
        val res = converter.convert(10.0, "millas", "kilometros")
        assertEquals(16.09344, res.value, 1e-4)
        assertEquals("millas", res.sourceUnitName)
        assertEquals("km", res.targetUnitName)
    }

    @Test
    fun convierteUnidadesDeMasa() {
        val res = converter.convert(1.0, "kg", "libras")
        assertEquals(2.20462, res.value, 1e-3)
    }

    @Test
    fun convierteTemperaturas() {
        val fahrenheit = converter.convert(0.0, "celsius", "fahrenheit")
        assertEquals(32.0, fahrenheit.value, 1e-4)

        val celsius = converter.convert(100.0, "fahrenheit", "celsius")
        assertEquals(37.7777, celsius.value, 1e-3)
    }

    @Test
    fun convierteDatosYVelocidad() {
        val mb = converter.convert(2.0, "gigabytes", "megabytes")
        assertEquals(2048.0, mb.value, 1e-4)

        val ms = converter.convert(36.0, "km/h", "m/s")
        assertEquals(10.0, ms.value, 1e-4)
    }

    @Test
    fun reconoseConsultasDeConversionEnElMotor() = runBlocking {
        val result = engine.process("cuántos kilómetros son 10 millas")
        assertTrue("Resultado debía ser Success pero fue $result", result is ActionResult.Success)
        val success = result as ActionResult.Success
        assertTrue(success.message.contains("10 millas"))
        assertTrue(success.message.contains("16,093"))
    }

    @Test
    fun reconoseConsultasDeTemperaturaEnElMotor() = runBlocking {
        val result = engine.process("convierte 25 grados celsius a fahrenheit")
        assertTrue("Resultado debía ser Success pero fue $result", result is ActionResult.Success)
        val success = result as ActionResult.Success
        assertTrue(success.message.contains("77 °F"))
    }
}
