package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule

/**
 * Reconocimiento de operaciones dichas en español. Convención numérica española: la coma es
 * separador decimal («2,5») y el punto seguido de tres cifras separa miles («1.500» = 1500).
 */
object ArithmeticIntents {

    val rules: List<IntentRule> = listOf(
        // «cuánto es 2 más 3», «calcula 2 elevado a 10», «cuánto es la raíz cuadrada de 2025».
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            CALC_PREFIX.matchEntire(text)?.let { match ->
                buildExpression(match.groupValues[1])?.let { Action.Calculate(it) }
            }
        },
        // Una operación dicha sin prefijo: «15 por 4», «2 + 2», «raíz cuadrada de 2025», «seno de 30».
        IntentRule(IntentPriority.FALLBACK) { text ->
            buildExpression(text)
                ?.takeIf { BINARY_OPERATOR.containsMatchIn(it) || FUNCTION_OPERATOR.containsMatchIn(it) }
                ?.let { Action.Calculate(it) }
        },
    )

    /**
     * Convierte una operación en lenguaje natural a una expresión con símbolos y funciones
     * (+ - * / ^ ! sqrt sin cos tan log ln abs fact pi e y paréntesis).
     */
    internal fun buildExpression(fragment: String): String? {
        var e = " ${fragment.trim()} "
        e = e.replace(LEADING_ARTICLE, " ")
        e = e.replace(PERCENT_OF) { "(${it.groupValues[1]}/100)*" }
        e = e.replace(PERCENT) { "(${it.groupValues[1]}/100)" }
        for ((word, digits) in NUMBER_WORDS) {
            e = e.replace(Regex("\\b$word\\b"), digits)
        }
        for ((phrase, replacement) in FUNCTION_WORDS) {
            e = e.replace(Regex("\\b${Regex.escape(phrase)}\\b"), " $replacement ")
        }
        for ((words, symbol) in OPERATOR_WORDS) {
            e = e.replace(Regex("\\b${Regex.escape(words)}\\b"), " $symbol ")
        }
        e = e.replace(TIMES_SIGN, "*").replace('÷', '/')
        e = e.replace(THOUSANDS) { it.value.replace(".", "") }
        e = e.replace(',', '.')

        // Cierra paréntesis abiertos automáticamente si no coinciden
        val openCount = e.count { it == '(' }
        val closeCount = e.count { it == ')' }
        if (openCount > closeCount) {
            e += ")".repeat(openCount - closeCount)
        }

        e = e.replace(WHITESPACE, " ").trim()

        if (e.isEmpty() || !ALLOWED_EXPRESSION.matches(e)) return null

        // Verifica que no haya palabras que no correspondan a funciones ni constantes conocidas
        val words = e.split(Regex("[^a-z]+")).filter { it.isNotEmpty() }
        if (words.any { it !in ALLOWED_WORDS }) return null

        if (e.none { it in '0'..'9' } && words.isEmpty()) return null

        return e
    }

    private val WHITESPACE = Regex("\\s+")

    private val CALC_PREFIX = Regex(
        "^(?:cuanto (?:es|son|da|dan|seria|serian)|dime cuanto (?:es|son)|calcula(?:me)?|calcular|resuelve|resultado de)\\s+(.+)$"
    )

    private val LEADING_ARTICLE = Regex("^\\s*(?:el|la|los|las)\\s+")
    private val PERCENT_OF = Regex("(\\d+(?:[.,]\\d+)?)\\s*(?:por ciento|porciento|%)\\s*de\\b")
    private val PERCENT = Regex("(\\d+(?:[.,]\\d+)?)\\s*(?:por ciento|porciento|%)")
    private val TIMES_SIGN = Regex("(?<=[\\d)])\\s*[x×·]\\s*(?=[\\d(])")
    private val THOUSANDS = Regex("(?<![\\d.,])[1-9]\\d{0,2}(?:\\.\\d{3})+(?![\\d.])")
    private val ALLOWED_EXPRESSION = Regex("^[a-z0-9.+\\-*/^()!\\s]+$")
    private val BINARY_OPERATOR = Regex("[0-9)]\\s*[+\\-*/^]")
    private val FUNCTION_OPERATOR = Regex("(?:sqrt|sin|cos|tan|log|ln|abs|fact|!|pi|e)")
    private val ALLOWED_WORDS = setOf("sqrt", "sin", "cos", "tan", "log", "ln", "abs", "fact", "pi", "e")

    private val NUMBER_WORDS = listOf(
        "cero" to "0", "uno" to "1", "dos" to "2", "tres" to "3", "cuatro" to "4",
        "cinco" to "5", "seis" to "6", "siete" to "7", "ocho" to "8", "nueve" to "9",
        "diez" to "10", "once" to "11", "doce" to "12",
    )

    private val FUNCTION_WORDS = listOf(
        "raiz cuadrada de" to "sqrt(",
        "raiz cuadrada" to "sqrt(",
        "raiz de" to "sqrt(",
        "seno de" to "sin(",
        "coseno de" to "cos(",
        "tangente de" to "tan(",
        "logaritmo natural de" to "ln(",
        "logaritmo base 10 de" to "log(",
        "logaritmo de" to "log(",
        "valor absoluto de" to "abs(",
        "factorial de" to "fact(",
        "factorial" to "!",
    )

    private val OPERATOR_WORDS = listOf(
        "abre parentesis" to "(",
        "cierra parentesis" to ")",
        "multiplicado por" to "*",
        "dividido entre" to "/",
        "dividido por" to "/",
        "dividido en" to "/",
        "dividido" to "/",
        "elevado a la" to "^",
        "elevado al" to "^",
        "elevado a" to "^",
        "a la potencia" to "^",
        "al cuadrado" to "^2",
        "al cubo" to "^3",
        "mas" to "+",
        "menos" to "-",
        "por" to "*",
        "entre" to "/",
        "sobre" to "/",
    )
}
