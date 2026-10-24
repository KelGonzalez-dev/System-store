package com.soni.assistant.core

import java.text.Normalizer

/**
 * Las reglas trabajan con texto normalizado («mami te amo», sin tildes ni mayúsculas).
 * Esto recupera el fragmento tal como lo dijo el usuario («Mami, te amo ❤️»), para que
 * los mensajes, notas y recordatorios se guarden y envíen con su escritura real.
 */
object OriginalText {

    fun recover(raw: String, fragment: String): String? {
        if (fragment.isBlank()) return null
        return find(raw, fragment, commasAsSpace = false) ?: find(raw, fragment, commasAsSpace = true)
    }

    private fun find(raw: String, fragment: String, commasAsSpace: Boolean): String? {
        val chars = StringBuilder()
        val origin = ArrayList<Int>()
        for ((index, c) in raw.withIndex()) {
            val mapped = when {
                c.isWhitespace() || c in IGNORED || (commasAsSpace && c == ',') -> " "
                else -> Normalizer.normalize(c.lowercase(), Normalizer.Form.NFD).replace(MARKS, "")
            }
            for (m in mapped) {
                if (m == ' ' && (chars.isEmpty() || chars.last() == ' ')) continue
                chars.append(m)
                origin.add(index)
            }
        }
        val target = if (commasAsSpace) fragment.replace(',', ' ').replace(Regex("\\s+"), " ").trim() else fragment.trim()
        val start = chars.indexOf(target)
        if (start < 0) return null
        val end = start + target.length - 1
        // Incluye marcas que van pegadas al último carácter (tildes sueltas, el «️» de los emojis).
        var stop = origin[end] + 1
        while (stop < raw.length && Character.getType(raw[stop]) == Character.NON_SPACING_MARK.toInt()) stop++
        return raw.substring(origin[start], stop).trim()
    }

    private val MARKS = Regex("\\p{Mn}+")
    private val IGNORED = setOf('¿', '?', '¡', '!', '"', '“', '”', '«', '»')
}
