package com.soni.assistant.tools

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test
import java.util.Locale

class SafeCalculatorTest {

    private val calculator = SafeCalculator()

    @Test
    fun respetaLaPrecedencia() {
        assertEquals(14.0, calculator.evaluate("2 + 3 * 4"), 1e-9)
        assertEquals(20.0, calculator.evaluate("(2 + 3) * 4"), 1e-9)
        assertEquals(512.0, calculator.evaluate("2 ^ 3 ^ 2"), 1e-9)
        assertEquals(-4.0, calculator.evaluate("-2 ^ 2"), 1e-9)
        assertEquals(0.5, calculator.evaluate("2 ^ -1"), 1e-9)
        assertEquals(2.5, calculator.evaluate("10 / 4"), 1e-9)
        assertEquals(0.3, calculator.evaluate("0.1 + 0.2"), 1e-9)
    }

    @Test
    fun rechazaExpresionesInvalidas() {
        listOf("5 / 0", "2 +", "(2 + 3", "2 3", "1..2", "abc", "2 ^ 5000", "(-8) ^ 0.5", "").forEach { expr ->
            assertThrows("Debía fallar: «$expr»", CalculationException::class.java) {
                calculator.evaluate(expr)
            }
        }
    }

    @Test
    fun rechazaExpresionesDemasiadoLargasOProfundas() {
        assertThrows(CalculationException::class.java) { calculator.evaluate("1+".repeat(150) + "1") }
        assertThrows(CalculationException::class.java) { calculator.evaluate("(".repeat(60) + "1" + ")".repeat(60)) }
    }

    @Test
    fun formateaConComaDecimal() {
        val es = Locale.forLanguageTag("es-CO")
        assertEquals("2,5", CalculatorTool.formatNumber(2.5, es))
        assertEquals("0,3", CalculatorTool.formatNumber(0.1 + 0.2, es))
        assertEquals("2 × 3,5", CalculatorTool.prettyExpression("2*3.5", es))
    }
}
