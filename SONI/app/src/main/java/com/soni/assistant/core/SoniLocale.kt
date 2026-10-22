package com.soni.assistant.core

import java.util.Locale

/**
 * Idioma de trabajo de SONI. Si el teléfono ya está en español se respeta su variante
 * (es-CO, es-MX, es-ES…); si no, se usa español de Colombia.
 */
object SoniLocale {
    private val FALLBACK: Locale = Locale.forLanguageTag("es-CO")

    val locale: Locale
        get() {
            val current = Locale.getDefault()
            return if (current.language == "es") current else FALLBACK
        }

    val languageTag: String
        get() = locale.toLanguageTag()
}
