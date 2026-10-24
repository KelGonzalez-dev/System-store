package com.soni.assistant.tools

import com.soni.assistant.data.memory.MemoryText
import java.time.LocalDate
import java.time.Period

/** Fechas de nacimiento, edad y signo zodiacal. Sin dependencias de Android (se prueba en el PC). */
object Zodiac {

    private val MONTHS = mapOf(
        "enero" to 1, "febrero" to 2, "marzo" to 3, "abril" to 4, "mayo" to 5, "junio" to 6, "julio" to 7,
        "agosto" to 8, "septiembre" to 9, "setiembre" to 9, "octubre" to 10, "noviembre" to 11, "diciembre" to 12,
    )
    private val DAY_WORDS = mapOf(
        "primero" to 1, "uno" to 1, "dos" to 2, "tres" to 3, "cuatro" to 4, "cinco" to 5, "seis" to 6,
        "siete" to 7, "ocho" to 8, "nueve" to 9, "diez" to 10, "once" to 11, "doce" to 12, "trece" to 13,
        "catorce" to 14, "quince" to 15, "dieciseis" to 16, "diecisiete" to 17, "dieciocho" to 18,
        "diecinueve" to 19, "veinte" to 20, "veintiuno" to 21, "veintidos" to 22, "veintitres" to 23,
        "veinticuatro" to 24, "veinticinco" to 25, "veintiseis" to 26, "veintisiete" to 27,
        "veintiocho" to 28, "veintinueve" to 29, "treinta" to 30, "treinta y uno" to 31,
    )
    private val MONTH_NAMES = MONTHS.keys.filter { it != "setiembre" }.joinToString("|")
    private val DAY = "(\\d{1,2}|treinta y uno|" + DAY_WORDS.keys.filter { it != "treinta y uno" }.joinToString("|") + ")"

    private val WRITTEN = Regex("\\b$DAY\\s+(?:de\\s+)?($MONTH_NAMES|setiembre)\\s+(?:de\\s+|del\\s+)?(\\d{2,4})\\b")
    private val NUMERIC = Regex("\\b(\\d{1,2})\\s*[/.-]\\s*(\\d{1,2})\\s*[/.-]\\s*(\\d{2,4})\\b")

    /** «3 de mayo de 1999», «tres de mayo del 99», «03/05/1999». Null si no hay una fecha válida. */
    fun parseBirthDate(text: String, today: LocalDate = LocalDate.now()): LocalDate? {
        val t = MemoryText.plain(text)
        val raw = text.lowercase()
        val (day, month, yearText) = WRITTEN.find(t)?.let { m ->
            val d = m.groupValues[1].toIntOrNull() ?: DAY_WORDS[m.groupValues[1]] ?: return null
            Triple(d, MONTHS[m.groupValues[2]] ?: return null, m.groupValues[3])
        } ?: NUMERIC.find(raw)?.let { m ->
            Triple(m.groupValues[1].toInt(), m.groupValues[2].toInt(), m.groupValues[3])
        } ?: return null

        var year = yearText.toInt()
        if (yearText.length == 2) year += if (year <= today.year % 100) 2000 else 1900
        val date = runCatching { LocalDate.of(year, month, day) }.getOrNull() ?: return null
        if (date.isAfter(today) || date.isBefore(today.minusYears(120))) return null
        return date
    }

    fun age(birth: LocalDate, today: LocalDate = LocalDate.now()): Int = Period.between(birth, today).years

    fun sign(date: LocalDate): String {
        val md = date.monthValue * 100 + date.dayOfMonth
        return when {
            md >= 1222 || md <= 119 -> "Capricornio"
            md <= 218 -> "Acuario"
            md <= 320 -> "Piscis"
            md <= 419 -> "Aries"
            md <= 520 -> "Tauro"
            md <= 620 -> "Géminis"
            md <= 722 -> "Cáncer"
            md <= 822 -> "Leo"
            md <= 922 -> "Virgo"
            md <= 1022 -> "Libra"
            md <= 1121 -> "Escorpio"
            else -> "Sagitario"
        }
    }

    /** Lo que la astrología suele atribuir a cada signo (respaldo si no hay internet). */
    fun traits(sign: String): String = when (sign) {
        "Aries" -> "Según la astrología, Aries es fuego puro: valiente, directo, con mucha energía y ganas de ser el primero en todo."
        "Tauro" -> "Según la astrología, Tauro es leal, paciente y muy constante; disfruta la buena comida, la comodidad y no le gusta que lo apuren."
        "Géminis" -> "Según la astrología, Géminis es curioso, conversador y muy ingenioso; se adapta rápido y nunca se aburre."
        "Cáncer" -> "Según la astrología, Cáncer es protector, sensible y muy familiar; cuida a los suyos como nadie."
        "Leo" -> "Según la astrología, Leo es carismático, generoso y seguro de sí mismo; le encanta brillar y que lo reconozcan."
        "Virgo" -> "Según la astrología, Virgo es detallista, trabajador y práctico; le gusta el orden y ayudar a los demás."
        "Libra" -> "Según la astrología, Libra busca la armonía y la justicia; es sociable, diplomático y con buen gusto."
        "Escorpio" -> "Según la astrología, Escorpio es intenso, apasionado y muy intuitivo; leal hasta el final, pero no olvida fácil."
        "Sagitario" -> "Según la astrología, Sagitario es aventurero, optimista y libre; ama viajar y aprender cosas nuevas."
        "Capricornio" -> "Según la astrología, Capricornio es responsable, disciplinado y ambicioso; sabe lo que quiere y trabaja por ello."
        "Acuario" -> "Según la astrología, Acuario es original, independiente y adelantado a su tiempo; piensa diferente."
        else -> "Según la astrología, Piscis es soñador, empático y creativo; siente todo con mucha intensidad."
    }
}
