package com.soni.assistant.tools

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

/** Recordatorio entendido de una frase: qué recordar y cuándo. */
data class ParsedReminder(val text: String, val at: LocalDateTime)

/**
 * Entiende frases como:
 * «recuérdame en 20 minutos sacar la ropa», «recuérdame mañana a las 8 llamar al banco»,
 * «avísame a las 5 y media de la tarde que tengo cita», «recuérdame más tarde comprar pan».
 * Trabaja sobre el texto ya normalizado (minúsculas y sin tildes). Las frases que no entiende
 * (devuelve null) se las pasa el motor a la IA, que sí sabe de fechas complejas.
 */
object ReminderParser {

    private val TRIGGER = Regex(
        "^(?:recuerdame|recordarme|recuerdeme|recuerdamelo|avisame|ponme un recordatorio|pon un recordatorio|" +
            "crea un recordatorio|creame un recordatorio|haz un recordatorio|hazme un recordatorio|no me dejes olvidar)" +
            "\\b\\s*(.*)$"
    )

    private const val NUMBER =
        "(\\d{1,3}|cuarenta y cinco|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|cuarenta)"

    private val NUMBER_WORDS = mapOf(
        "un" to 1, "una" to 1, "uno" to 1, "dos" to 2, "tres" to 3, "cuatro" to 4, "cinco" to 5,
        "seis" to 6, "siete" to 7, "ocho" to 8, "nueve" to 9, "diez" to 10, "once" to 11, "doce" to 12,
        "quince" to 15, "veinte" to 20, "treinta" to 30, "cuarenta" to 40, "cuarenta y cinco" to 45,
    )

    private val RELATIVE = Regex(
        "\\b(?:en|dentro de)\\s+(?:$NUMBER\\s+(minutos?|horas?|dias?)(\\s+y\\s+media)?|(media)\\s+hora)\\b"
    )
    private val CLOCK = Regex(
        "\\b(?:(hoy|pasado manana|manana)\\s+)?a\\s+las?\\s+$NUMBER" +
            "(?:(?::|\\s+y\\s+)(\\d{1,2}|media|cuarto))?" +
            "(?:\\s+(de la manana|de la tarde|de la noche|de la madrugada|del mediodia|am|pm|a m|p m))?\\b"
    )
    private val DAY_WORD = Regex("\\b(pasado manana|manana|esta noche|esta tarde|esta manana)\\b")
    private val LATER = Regex("\\b(?:mas tarde|en un rato|en un ratico|ahorita|luego)\\b")

    private val LEADING_FILLER = Regex("^(?:(?:que|de que|para que|de|para|por favor)\\s+)+")
    private val TRAILING_FILLER = Regex("(?:\\s+(?:por favor|porfa|gracias))+$")

    /** true si la frase pide un recordatorio (aunque no se entienda la hora). */
    fun isReminderRequest(text: String): Boolean = TRIGGER.matches(text.trim())

    fun parse(text: String, now: LocalDateTime): ParsedReminder? {
        val body = TRIGGER.matchEntire(text.trim())?.groupValues?.get(1)?.trim() ?: return null

        var at: LocalDateTime? = null
        var span: IntRange? = null

        RELATIVE.find(body)?.let { m ->
            span = m.range
            at = if (m.groupValues[4] == "media") {
                now.plusMinutes(30)
            } else {
                val amount = number(m.groupValues[1]) ?: return null
                val unit = m.groupValues[2]
                val half = m.groupValues[3].isNotBlank()
                when {
                    unit.startsWith("minuto") -> now.plusMinutes(amount.toLong())
                    unit.startsWith("hora") -> now.plusMinutes(amount * 60L + if (half) 30 else 0)
                    else -> now.plusDays(amount.toLong()).withHour(9).withMinute(0)
                }
            }
        }

        if (at == null) CLOCK.find(body)?.let { m ->
            span = m.range
            at = clockTime(now, day = m.groupValues[1], hourText = m.groupValues[2], minuteText = m.groupValues[3], period = m.groupValues[4])
        }

        if (at == null) DAY_WORD.find(body)?.let { m ->
            span = m.range
            val today = now.toLocalDate()
            at = when (m.groupValues[1]) {
                "manana" -> today.plusDays(1).atTime(9, 0)
                "pasado manana" -> today.plusDays(2).atTime(9, 0)
                "esta noche" -> today.atTime(20, 0)
                "esta tarde" -> today.atTime(15, 0)
                else -> today.atTime(9, 0)
            }.let { if (it.isAfter(now)) it else now.plusHours(1) }
        }

        if (at == null) LATER.find(body)?.let { m ->
            span = m.range
            at = now.plusHours(1)
        }

        val time = at ?: return null
        val range = span ?: return null
        val rest = (body.removeRange(range))
            .replace(Regex("\\s+"), " ")
            .trim()
            .replace(LEADING_FILLER, "")
            .replace(TRAILING_FILLER, "")
            .trim()
        val what = when (rest) {
            "", "esto", "eso", "lo", "algo" -> "lo que me pediste"
            else -> rest
        }
        return ParsedReminder(what, time.withSecond(0).withNano(0))
    }

    private fun number(text: String): Int? = text.toIntOrNull() ?: NUMBER_WORDS[text]

    private fun clockTime(now: LocalDateTime, day: String, hourText: String, minuteText: String, period: String): LocalDateTime? {
        var hour = number(hourText) ?: return null
        if (hour > 24) return null
        val minute = when (minuteText) {
            "" -> 0
            "media" -> 30
            "cuarto" -> 15
            else -> minuteText.toIntOrNull()?.takeIf { it < 60 } ?: return null
        }

        val pm = period in setOf("de la tarde", "de la noche", "pm", "p m")
        val am = period in setOf("de la manana", "de la madrugada", "am", "a m")
        when {
            pm && hour < 12 -> hour += 12
            am && hour == 12 -> hour = 0
            period == "del mediodia" -> hour = 12
        }
        if (hour == 24) hour = 0

        val baseDay: LocalDate = when (day) {
            "manana" -> now.toLocalDate().plusDays(1)
            "pasado manana" -> now.toLocalDate().plusDays(2)
            else -> now.toLocalDate()
        }

        if (pm || am || hour > 12 || period == "del mediodia") {
            val candidate = baseDay.atTime(LocalTime.of(hour, minute))
            return if (candidate.isAfter(now) || day.isNotBlank()) candidate else candidate.plusDays(1)
        }

        // Sin «de la mañana/tarde»: para otro día, de 1 a 6 se asume tarde; hoy, la próxima vez que llegue esa hora.
        if (day == "manana" || day == "pasado manana") {
            val h = if (hour in 1..6) hour + 12 else hour
            return baseDay.atTime(LocalTime.of(h % 24, minute))
        }
        // De 1 a 6 sin aclarar casi siempre es por la tarde («a las 3» = 15:00).
        val hours = if (hour in 1..6) listOf(hour + 12) else listOf(hour % 12, hour % 12 + 12)
        val options = hours.map { baseDay.atTime(LocalTime.of(it, minute)) }
        return options.firstOrNull { it.isAfter(now) } ?: options.first().plusDays(1)
    }
}
