package com.soni.assistant.tools

import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.log
import kotlin.math.log10
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.math.tan

class CalculationException(message: String) : Exception(message)

internal sealed class CalcToken {
    data class Number(val value: Double) : CalcToken()
    data class Operator(val symbol: Char) : CalcToken()
    data class Function(val name: String) : CalcToken()
    data object OpenParen : CalcToken()
    data object CloseParen : CalcToken()
}

/**
 * Evaluador aritmético y científico propio (descenso recursivo). No usa eval ni motores de scripts.
 * Admite: números decimales, + - * / ^ !, funciones (sqrt, sin, cos, tan, log, ln, abs, fact),
 * constantes (pi, e), paréntesis y signo negativo.
 */
class SafeCalculator(
    private val maxLength: Int = 300,
    private val maxTokens: Int = 150,
    private val maxDepth: Int = 40,
    private val maxExponent: Double = 1_000.0,
) {

    fun evaluate(expression: String): Double {
        if (expression.isBlank()) throw CalculationException("No hay ninguna operación.")
        if (expression.length > maxLength) throw CalculationException("La operación es demasiado larga.")

        val tokens = tokenize(expression)
        if (tokens.size > maxTokens) throw CalculationException("La operación es demasiado compleja.")

        val parser = Parser(tokens)
        val value = parser.parseExpression(depth = 0)
        if (!parser.isAtEnd()) throw CalculationException("La operación no está bien formada.")
        if (value.isNaN() || value.isInfinite()) {
            throw CalculationException("El resultado es demasiado grande o no está definido.")
        }
        return if (value == 0.0) 0.0 else value
    }

    private fun tokenize(input: String): List<CalcToken> {
        val tokens = mutableListOf<CalcToken>()
        var i = 0
        while (i < input.length) {
            val ch = input[i]
            when {
                ch.isWhitespace() -> i++
                ch in '0'..'9' || ch == '.' -> {
                    val start = i
                    while (i < input.length && (input[i] in '0'..'9' || input[i] == '.')) i++
                    val literal = input.substring(start, i)
                    if (literal == "." || literal.count { it == '.' } > 1) {
                        throw CalculationException("El número «$literal» no es válido.")
                    }
                    val number = literal.toDoubleOrNull()
                        ?: throw CalculationException("El número «$literal» no es válido.")
                    tokens += CalcToken.Number(number)
                }
                ch.isLetter() -> {
                    val start = i
                    while (i < input.length && input[i].isLetter()) i++
                    val word = input.substring(start, i).lowercase()
                    when (word) {
                        "pi" -> tokens += CalcToken.Number(Math.PI)
                        "e" -> tokens += CalcToken.Number(Math.E)
                        "sqrt", "sin", "cos", "tan", "log", "ln", "abs", "fact" -> tokens += CalcToken.Function(word)
                        else -> throw CalculationException("La función o constante «$word» no es conocida.")
                    }
                }
                ch in "+-*/^!" -> {
                    tokens += CalcToken.Operator(ch)
                    i++
                }
                ch == '(' -> {
                    tokens += CalcToken.OpenParen
                    i++
                }
                ch == ')' -> {
                    tokens += CalcToken.CloseParen
                    i++
                }
                else -> throw CalculationException("El símbolo «$ch» no está permitido.")
            }
        }
        if (tokens.isEmpty()) throw CalculationException("No hay ninguna operación.")
        return tokens
    }

    private inner class Parser(private val tokens: List<CalcToken>) {
        private var position = 0

        fun isAtEnd(): Boolean = position >= tokens.size

        private fun peek(): CalcToken? = tokens.getOrNull(position)

        private fun matchOperator(vararg symbols: Char): Char? {
            val token = peek()
            if (token is CalcToken.Operator && token.symbol in symbols) {
                position++
                return token.symbol
            }
            return null
        }

        private fun checkDepth(depth: Int) {
            if (depth > maxDepth) throw CalculationException("La operación tiene demasiados niveles.")
        }

        fun parseExpression(depth: Int): Double {
            checkDepth(depth)
            var result = parseTerm(depth)
            while (true) {
                val op = matchOperator('+', '-') ?: break
                val right = parseTerm(depth)
                result = if (op == '+') result + right else result - right
            }
            return result
        }

        private fun parseTerm(depth: Int): Double {
            var result = parseUnary(depth)
            while (true) {
                val op = matchOperator('*', '/') ?: break
                val right = parseUnary(depth)
                result = if (op == '*') {
                    result * right
                } else {
                    if (right == 0.0) throw CalculationException("No se puede dividir entre cero.")
                    result / right
                }
            }
            return result
        }

        private fun parseUnary(depth: Int): Double {
            checkDepth(depth)
            return when (matchOperator('-', '+')) {
                '-' -> -parseUnary(depth + 1)
                '+' -> parseUnary(depth + 1)
                else -> parsePostfix(depth)
            }
        }

        private fun parsePostfix(depth: Int): Double {
            var value = parsePower(depth)
            while (matchOperator('!') != null) {
                value = factorial(value)
            }
            return value
        }

        private fun parsePower(depth: Int): Double {
            val base = parsePrimary(depth)
            if (matchOperator('^') == null) return base
            val exponent = parseUnary(depth + 1)
            if (abs(exponent) > maxExponent) throw CalculationException("El exponente es demasiado grande.")
            val result = base.pow(exponent)
            if (result.isNaN()) throw CalculationException("Esa potencia no tiene un resultado real.")
            return result
        }

        private fun parsePrimary(depth: Int): Double {
            return when (val token = peek()) {
                is CalcToken.Number -> {
                    position++
                    token.value
                }
                is CalcToken.Function -> {
                    position++
                    parseFunctionCall(token.name, depth)
                }
                CalcToken.OpenParen -> {
                    position++
                    val value = parseExpression(depth + 1)
                    if (peek() != CalcToken.CloseParen) throw CalculationException("Falta cerrar un paréntesis.")
                    position++
                    value
                }
                null -> throw CalculationException("La operación está incompleta.")
                else -> throw CalculationException("La operación no está bien formada.")
            }
        }

        private fun parseFunctionCall(name: String, depth: Int): Double {
            val hasParen = peek() == CalcToken.OpenParen
            if (hasParen) position++
            val arg = parseExpression(depth + 1)
            if (hasParen) {
                if (peek() != CalcToken.CloseParen) throw CalculationException("Falta cerrar el paréntesis de la función «$name».")
                position++
            }
            return evaluateFunction(name, arg)
        }

        private fun evaluateFunction(name: String, arg: Double): Double {
            return when (name) {
                "sqrt" -> {
                    if (arg < 0.0) throw CalculationException("No se puede calcular la raíz de un número negativo.")
                    sqrt(arg)
                }
                "sin" -> {
                    val rad = Math.toRadians(arg)
                    val res = sin(rad)
                    if (abs(res) < 1e-15) 0.0 else res
                }
                "cos" -> {
                    val rad = Math.toRadians(arg)
                    val res = cos(rad)
                    if (abs(res) < 1e-15) 0.0 else res
                }
                "tan" -> {
                    val mod = (abs(arg) % 180.0)
                    if (abs(mod - 90.0) < 1e-9) throw CalculationException("La tangente no está definida para ese ángulo.")
                    val rad = Math.toRadians(arg)
                    tan(rad)
                }
                "log" -> {
                    if (arg <= 0.0) throw CalculationException("El logaritmo solo está definido para números positivos.")
                    log10(arg)
                }
                "ln" -> {
                    if (arg <= 0.0) throw CalculationException("El logaritmo natural solo está definido para números positivos.")
                    log(arg, Math.E)
                }
                "abs" -> abs(arg)
                "fact" -> factorial(arg)
                else -> throw CalculationException("Función desconocida «$name».")
            }
        }

        private fun factorial(n: Double): Double {
            if (n < 0 || n != Math.floor(n) || n > 20) {
                throw CalculationException("El factorial solo se define para números enteros entre 0 y 20.")
            }
            var res = 1.0
            val intN = n.toInt()
            for (i in 2..intN) {
                res *= i
            }
            return res
        }
    }
}
