package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale
import kotlin.math.abs

class CalculatorTool(
    private val calculator: SafeCalculator = SafeCalculator(),
    private val locale: Locale = SoniLocale.locale,
) : SoniTool {

    override val name: String = "calculadora"
    override val description: String = "Resuelve operaciones aritméticas básicas en el teléfono, sin internet."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW
    override val intentRules: List<IntentRule> = ArithmeticIntents.rules

    override fun canHandle(action: Action): Boolean = action is Action.Calculate

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.Calculate) {
            return ActionResult.Failed("La calculadora no puede ejecutar esa acción.", FailureReason.NO_TOOL)
        }
        return try {
            val value = calculator.evaluate(action.expression)
            val formatted = formatNumber(value, locale)
            ActionResult.Success(
                message = "${prettyExpression(action.expression, locale)} = $formatted",
                spokenMessage = "El resultado es $formatted",
                actionLabel = "Cálculo realizado",
            )
        } catch (e: CalculationException) {
            val reason = e.message.orEmpty().replaceFirstChar { it.lowercase(locale) }
            ActionResult.Failed(
                message = "No pude hacer ese cálculo: $reason",
                reason = FailureReason.INVALID_INPUT,
                actionLabel = "Cálculo no realizado",
            )
        }
    }

    companion object {
        fun formatNumber(value: Double, locale: Locale): String {
            val symbols = DecimalFormatSymbols.getInstance(locale)
            val magnitude = abs(value)
            val pattern = if (magnitude != 0.0 && (magnitude >= 1e15 || magnitude < 1e-6)) {
                "0.######E0"
            } else {
                "#,##0.##########"
            }
            return DecimalFormat(pattern, symbols).format(value)
        }

        /** «2*3.5» → «2 × 3,5» para mostrarlo en pantalla. */
        fun prettyExpression(expression: String, locale: Locale): String {
            val decimal = DecimalFormatSymbols.getInstance(locale).decimalSeparator
            return expression
                .replace(Regex("\\s*([+\\-*/^])\\s*"), " \$1 ")
                .replace("*", "×")
                .replace("/", "÷")
                .replace(Regex("(\\d)\\.(\\d)"), "\$1$decimal\$2")
                .replace(Regex("\\(\\s+"), "(")
                .replace(Regex("\\s+\\)"), ")")
                .replace(Regex("\\s+"), " ")
                .trim()
        }
    }
}
