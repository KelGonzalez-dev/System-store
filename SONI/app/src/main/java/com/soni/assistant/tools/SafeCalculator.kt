package com.soni.assistant.tools

import kotlin.math.abs
import kotlin.math.pow

class CalculationException(message: String) : Exception(message)

/**
 * Evaluador aritmético propio (descenso recursivo). No usa eval ni motores de scripts.
 * Admite: números decimales, + - * / ^, paréntesis y signo negativo.
 * Precedencia: paréntesis > potencia (asociativa por la derecha) > signo > * / > + -.
 */
class SafeCalculator(
    private val maxLength: Int = 200,
    private val maxTokens: Int = 120,
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
        return if (value == 0.0) 0.0 else value // Evita mostrar «-0».
    }

    private sealed interface Token {
        data class Number(val value: Double) : Token
        data class Operator(val symbol: Char) : Token
        data object OpenParen : Token
        data object CloseParen : Token
    }

    private fun tokenize(input: String): List<Token> {
        val tokens = mutableListOf<Token>()
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
                    tokens += Token.Number(number)
                }
                ch in "+-*/^" -> {
                    tokens += Token.Operator(ch)
                    i++
                }
                ch == '(' -> {
                    tokens += Token.OpenParen
                    i++
                }
                ch == ')' -> {
                    tokens += Token.CloseParen
                    i++
                }
                else -> throw CalculationException("El símbolo «$ch» no está permitido.")
            }
        }
        if (tokens.isEmpty()) throw CalculationException("No hay ninguna operación.")
        return tokens
    }

    private inner class Parser(private val tokens: List<Token>) {
        private var position = 0

        fun isAtEnd(): Boolean = position >= tokens.size

        private fun peek(): Token? = tokens.getOrNull(position)

        private fun matchOperator(vararg symbols: Char): Char? {
            val token = peek()
            if (token is Token.Operator && token.symbol in symbols) {
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
                else -> parsePower(depth)
            }
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
                is Token.Number -> {
                    position++
                    token.value
                }
                Token.OpenParen -> {
                    position++
                    val value = parseExpression(depth + 1)
                    if (peek() != Token.CloseParen) throw CalculationException("Falta cerrar un paréntesis.")
                    position++
                    value
                }
                null -> throw CalculationException("La operación está incompleta.")
                else -> throw CalculationException("La operación no está bien formada.")
            }
        }
    }
}
