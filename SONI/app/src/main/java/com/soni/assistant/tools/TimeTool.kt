package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool
import java.time.Clock
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Locale

/**
 * Hora y fecha locales del dispositivo. El reloj se pide en cada consulta para respetar
 * cambios de zona horaria mientras la app está abierta.
 */
class TimeTool(
    private val clockProvider: () -> Clock = { Clock.systemDefaultZone() },
    private val locale: Locale = SoniLocale.locale,
) : SoniTool {

    override val name: String = "fecha_y_hora"
    override val description: String = "Indica la hora y la fecha del teléfono."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.SPECIFIC_QUESTION) { text ->
            if (TIME_PATTERNS.any { it.containsMatchIn(text) }) Action.TellTime else null
        },
        IntentRule(IntentPriority.SPECIFIC_QUESTION + 1) { text ->
            if (DATE_PATTERNS.any { it.containsMatchIn(text) }) Action.TellDate(dayOffsetOf(text)) else null
        },
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.TellTime || action is Action.TellDate

    override suspend fun execute(action: Action): ActionResult = when (action) {
        Action.TellTime -> ActionResult.Success(
            message = describeTime(LocalTime.now(clockProvider())),
            actionLabel = "Hora consultada",
        )
        is Action.TellDate -> ActionResult.Success(
            message = describeDate(action.dayOffset),
            actionLabel = "Fecha consultada",
        )
        else -> ActionResult.Failed("Esta herramienta solo da la hora y la fecha.", FailureReason.NO_TOOL)
    }

    private fun describeTime(time: LocalTime): String {
        val hour24 = time.hour
        val hour12 = if (hour24 % 12 == 0) 12 else hour24 % 12
        val period = when (hour24) {
            in 0..5 -> "de la madrugada"
            in 6..11 -> "de la mañana"
            12 -> "del mediodía"
            in 13..18 -> "de la tarde"
            else -> "de la noche"
        }
        val verb = if (hour12 == 1) "Es la" else "Son las"
        val minutes = time.minute.toString().padStart(2, '0')
        return "$verb $hour12:$minutes $period."
    }

    private fun describeDate(dayOffset: Int): String {
        val date = LocalDate.now(clockProvider()).plusDays(dayOffset.toLong())
        val formatted = date.format(DateTimeFormatter.ofPattern("EEEE, d 'de' MMMM 'de' yyyy", locale))
        val prefix = when (dayOffset) {
            0 -> "Hoy es"
            1 -> "Mañana será"
            2 -> "Pasado mañana será"
            -1 -> "Ayer fue"
            -2 -> "Anteayer fue"
            else -> if (dayOffset > 0) "Ese día será" else "Ese día fue"
        }
        return "$prefix $formatted."
    }

    private fun dayOffsetOf(text: String): Int = when {
        "pasado manana" in text -> 2
        BEFORE_YESTERDAY.containsMatchIn(text) -> -2
        TOMORROW.containsMatchIn(text) -> 1
        YESTERDAY.containsMatchIn(text) -> -1
        else -> 0
    }

    private companion object {
        val TIME_PATTERNS = listOf(
            Regex("\\bque hora\\b"),
            Regex("\\bhora es\\b"),
            Regex("\\b(?:dime|dame|sabes|me dices) la hora\\b"),
            Regex("^(?:la )?hora$"),
        )
        val DATE_PATTERNS = listOf(
            Regex("\\bque (?:dia|fecha)\\b"),
            Regex("\\bfecha\\b"),
            Regex("\\ba (?:cuanto|que) estamos\\b"),
        )
        val BEFORE_YESTERDAY = Regex("\\b(?:anteayer|antier|antes de ayer)\\b")
        val TOMORROW = Regex("\\bmanana\\b")
        val YESTERDAY = Regex("\\bayer\\b")
    }
}
