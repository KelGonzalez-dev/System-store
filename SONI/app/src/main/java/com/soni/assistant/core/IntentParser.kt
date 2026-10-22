package com.soni.assistant.core

import java.text.Normalizer
import java.util.Locale

/**
 * Motor de intenciones local basado en reglas. No usa internet ni IA externa.
 *
 * Solo normaliza el texto y prueba, por prioridad, las [IntentRule] que declaran las
 * herramientas registradas más las propias de SONI (ayuda y saludo). Añadir una herramienta
 * no obliga a tocar este archivo.
 */
class IntentParser(toolRules: List<IntentRule>) {

    private val rules: List<IntentRule> = (toolRules + CORE_RULES).sortedBy { it.priority }

    fun parse(rawInput: String): Action {
        if (rawInput.isBlank()) return Action.Unknown(rawInput)
        val text = normalize(rawInput)

        // Solo se dijo la palabra de activación («SONI»).
        if (text.isEmpty()) {
            return if (WAKE_WORD_ANYWHERE.containsMatchIn(rawInput.lowercase(Locale.ROOT))) {
                Action.Greeting
            } else {
                Action.Unknown(rawInput)
            }
        }

        return rules.firstNotNullOfOrNull { it.match(text) } ?: Action.Unknown(rawInput)
    }

    /** Minúsculas, sin tildes, sin signos de interrogación/exclamación y sin la palabra de activación. */
    internal fun normalize(input: String): String {
        val lower = input.lowercase(Locale.ROOT)
        val withoutAccents = Normalizer.normalize(lower, Normalizer.Form.NFD).replace(COMBINING_MARKS, "")
        val withoutPunctuation = withoutAccents.replace(IGNORED_PUNCTUATION, " ")
        val collapsed = withoutPunctuation.replace(WHITESPACE, " ").trim()
        val withoutWakeWord = collapsed.replace(WAKE_WORD_PREFIX, "")
        return withoutWakeWord.trim().trimEnd('.', ',', ';', ':').trim()
    }

    private companion object {
        val COMBINING_MARKS = Regex("\\p{Mn}+")
        val IGNORED_PUNCTUATION = Regex("[¿?¡!\"“”«»]")
        val WHITESPACE = Regex("\\s+")

        // El reconocedor suele transcribir «SONI» como «Sony».
        val WAKE_WORD_PREFIX = Regex("^(?:(?:oye|hey|ok|okey)\\s+)?(?:soni|sony|sonni|sonny)\\b[\\s,.:;]*")
        val WAKE_WORD_ANYWHERE = Regex("\\bson+[iy]\\b")

        val HELP_PATTERNS = listOf(
            Regex("\\bayuda\\b"),
            Regex("\\bque (?:puedes|sabes) hacer\\b"),
            Regex("\\bcomandos\\b"),
        )
        val GREETING = Regex("^(?:hola|buenos dias|buenas tardes|buenas noches|buenas|hey|que tal)\\b")

        val CORE_RULES = listOf(
            IntentRule(IntentPriority.HELP) { text ->
                if (HELP_PATTERNS.any { it.containsMatchIn(text) }) Action.Help else null
            },
            IntentRule(IntentPriority.GREETING) { text ->
                if (GREETING.containsMatchIn(text)) Action.Greeting else null
            },
        )
    }
}
