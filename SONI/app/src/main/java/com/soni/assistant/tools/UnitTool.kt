package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool
import java.util.Locale

// «convierte 10 millas a kilometros», «pasa 25 grados celsius a fahrenheit», «100 km/h en mph»
private val STANDARD_CONVERT = Regex(
    "^(?:convierte|pasa|calcula|cuanto es|cuanto son)?\\s*(\\d+(?:[.,]\\d+)?)\\s+([a-zA-Z°/\\s]+?)\\s+(?:a|en|por)\\s+([a-zA-Z°/\\s]+)$"
)

// «cuantos kilometros son 10 millas», «cuantas millas son 5000 metros»
private val INVERTED_CONVERT = Regex(
    "^(?:cuantos|cuantas)\\s+([a-zA-Z°/\\s]+?)\\s+(?:son|equivalen a|da|dan)\\s+(\\d+(?:[.,]\\d+)?)\\s+([a-zA-Z°/\\s]+)$"
)

private fun parseStandardQuery(text: String): Action? {
    val match = STANDARD_CONVERT.matchEntire(text.trim()) ?: return null
    val valStr = match.groupValues[1].replace(',', '.')
    val valNum = valStr.toDoubleOrNull() ?: return null
    val source = match.groupValues[2].trim()
    val target = match.groupValues[3].trim()
    if (source.isBlank() || target.isBlank()) return null
    return Action.ConvertUnit(valNum, source, target)
}

private fun parseInvertedQuery(text: String): Action? {
    val match = INVERTED_CONVERT.matchEntire(text.trim()) ?: return null
    val target = match.groupValues[1].trim()
    val valStr = match.groupValues[2].replace(',', '.')
    val valNum = valStr.toDoubleOrNull() ?: return null
    val source = match.groupValues[3].trim()
    if (source.isBlank() || target.isBlank()) return null
    return Action.ConvertUnit(valNum, source, target)
}

class UnitTool(
    private val converter: UnitConverter = UnitConverter(),
    private val locale: Locale = SoniLocale.locale,
) : SoniTool {

    override val name: String = "conversor_de_unidades"
    override val description: String = "Convierte unidades de longitud, masa, temperatura, tiempo, datos, velocidad y divisas."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        // «cuántos kilómetros son 10 millas», «cuántas millas equivalen a 100 kilómetros»
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            parseInvertedQuery(text) ?: parseStandardQuery(text)
        },
    )

    override fun canHandle(action: Action): Boolean = action is Action.ConvertUnit

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.ConvertUnit) {
            return ActionResult.Failed("El conversor no puede ejecutar esa acción.", FailureReason.NO_TOOL)
        }

        return try {
            val res = converter.convert(action.value, action.sourceUnit, action.targetUnit)
            val valFormatted = CalculatorTool.formatNumber(action.value, locale)
            val resFormatted = CalculatorTool.formatNumber(res.value, locale)

            val msg = "$valFormatted ${res.sourceUnitName} = $resFormatted ${res.targetUnitName}" +
                (if (res.note != null) " (${res.note})" else "")

            ActionResult.Success(
                message = msg,
                spokenMessage = "$valFormatted ${res.sourceUnitName} equivalen a $resFormatted ${res.targetUnitName}",
                actionLabel = "Conversión realizada",
            )
        } catch (e: UnitConversionException) {
            ActionResult.Failed(
                message = e.message ?: "No pude realizar la conversión.",
                reason = FailureReason.INVALID_INPUT,
                actionLabel = "Conversión no realizada",
            )
        }
    }
}
