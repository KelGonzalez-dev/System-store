package com.soni.assistant.core

import com.soni.assistant.tools.SafeCalculator
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class IntentParserTest {

    private val parser = IntentParser(ToolRegistry(SoniEngine.defaultTools()).intentRules())
    private val calculator = SafeCalculator()

    private fun evaluate(input: String): Double {
        val action = parser.parse(input)
        assertTrue("Se esperaba un cálculo para «$input», pero fue $action", action is Action.Calculate)
        return calculator.evaluate((action as Action.Calculate).expression)
    }

    @Test
    fun reconoceLaHoraConYSinPalabraDeActivacion() {
        assertEquals(Action.TellTime, parser.parse("¿Qué hora es?"))
        assertEquals(Action.TellTime, parser.parse("SONI, ¿qué hora es?"))
        assertEquals(Action.TellTime, parser.parse("Sony dime la hora"))
    }

    @Test
    fun reconoceLaFechaYElDiaRelativo() {
        assertEquals(Action.TellDate(0), parser.parse("¿Qué día es hoy?"))
        assertEquals(Action.TellDate(1), parser.parse("qué día es mañana"))
        assertEquals(Action.TellDate(2), parser.parse("qué fecha es pasado mañana"))
        assertEquals(Action.TellDate(-1), parser.parse("qué día fue ayer"))
        assertEquals(Action.TellDate(-2), parser.parse("qué día fue antes de ayer"))
    }

    @Test
    fun interpretaCalculosEnLenguajeNatural() {
        assertEquals(5.0, evaluate("cuánto es 2 más 3"), 1e-9)
        assertEquals(60.0, evaluate("15 x 4"), 1e-9)
        assertEquals(60.0, evaluate("SONI, cuánto es 15 por 4"), 1e-9)
        assertEquals(30.0, evaluate("cuánto es el 20 por ciento de 150"), 1e-9)
        assertEquals(10.0, evaluate("cuánto es 2,5 por 4"), 1e-9)
        assertEquals(2000.0, evaluate("1.500 + 500"), 1e-9)
        assertEquals(8.0, evaluate("cuánto es 2 por (3 más 1)"), 1e-9)
        assertEquals(1024.0, evaluate("calcula 2 elevado a 10"), 1e-9)
        assertEquals(4.0, evaluate("dos más dos"), 1e-9)
        assertEquals(5.0, evaluate("cuánto es 20 dividido entre 4"), 1e-9)
        assertEquals(49.0, evaluate("cuánto es 7 al cuadrado"), 1e-9)
    }

    @Test
    fun saludoAyudaYOrdenesDesconocidas() {
        assertEquals(Action.Greeting, parser.parse("Hola"))
        assertEquals(Action.Greeting, parser.parse("SONI"))
        assertEquals(Action.Help, parser.parse("¿Qué puedes hacer?"))
        assertEquals(Action.Help, parser.parse("acciones"))
        assertEquals(Action.Help, parser.parse("SONI, acciones"))
        assertEquals(Action.Help, parser.parse("¿Qué haces?"))
        assertEquals(Action.Help, parser.parse("permisos"))
        assertEquals(Action.Help, parser.parse("qué permisos tienes"))
        assertTrue(parser.parse("pon música de rock") is Action.Unknown)
        assertTrue(parser.parse("cuánto es la vida") is Action.Unknown)
        assertTrue(parser.parse("   ") is Action.Unknown)
    }
}
