package com.soni.assistant.tools

import android.Manifest
import android.app.SearchManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import com.soni.assistant.ai.GeminiBrain
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.BrainDecision
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Dos formas de buscar:
 * - «Investiga…», «qué es…», «cómo está el clima»: SONI investiga por debajo con Gemini + Google
 *   y te lo dice hablando, sin abrir nada.
 * - «Busca en Google…», «ábreme en el navegador…»: abre el navegador con los resultados.
 */
class WebSearchTool(private val context: Context) : SoniTool {

    override val name: String = "busqueda_web"
    override val description: String = "Investiga en internet y responde hablando, o abre Google si lo pides."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.FALLBACK + 10) { text -> parseQuery(text) }
    )

    override fun canHandle(action: Action): Boolean = action is Action.WebSearch || action is Action.Research

    /** La ubicación solo se pide para preguntas que dependen del lugar y no nombran otro. */
    override fun permissionsFor(action: Action): List<String> =
        if (action is Action.Research && needsLocation(action.query) && !LocationHelper.hasPermission(context)) {
            listOf(Manifest.permission.ACCESS_COARSE_LOCATION)
        } else {
            emptyList()
        }

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.Research -> research(action.query)
        is Action.WebSearch -> openBrowser(action.query)
        else -> ActionResult.Failed("No puedo realizar esta búsqueda.", FailureReason.NO_TOOL)
    }

    private suspend fun research(query: String): ActionResult {
        val brain = GeminiBrain.createOrNull()
            ?: return openBrowser(query) // sin clave de Gemini, al menos abre Google
        val place = if (needsLocation(query)) {
            withContext(Dispatchers.IO) { LocationHelper.describeCurrentPlace(context) }
        } else {
            null
        }
        return when (val answer = brain.research(query, place)) {
            is BrainDecision.Answer -> ActionResult.Success(message = answer.text, actionLabel = "Investigación")
            is BrainDecision.Error -> ActionResult.Failed(answer.message, FailureReason.UNEXPECTED, actionLabel = "Investigación")
            is BrainDecision.Run -> ActionResult.Failed("No encontré información sobre eso.", FailureReason.UNEXPECTED)
        }
    }

    private fun openBrowser(q: String): ActionResult {
        val searchIntent = Intent(Intent.ACTION_WEB_SEARCH)
            .putExtra(SearchManager.QUERY, q)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/search?q=${Uri.encode(q)}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        for (intent in listOf(searchIntent, browserIntent)) {
            try {
                context.startActivity(intent)
                return ActionResult.Success(
                    message = "Abrí Google con «$q».",
                    spokenMessage = "Te abrí la búsqueda en Google",
                    actionLabel = "Búsqueda web",
                )
            } catch (e: Exception) {
                // probar la siguiente forma
            }
        }
        return ActionResult.Failed("No se pudo abrir el navegador para buscar.", FailureReason.UNEXPECTED)
    }

    private companion object {
        /** Abrir el navegador: solo si el usuario lo pide explícitamente. */
        val OPEN_BROWSER = listOf(
            Regex("^(?:busca|buscar|buscame|abre|abreme|muestrame|ensename)\\s+en\\s+(?:google|el navegador|internet|chrome)\\s+(.+)$"),
            Regex("^(?:googlea|googlear)\\s+(.+)$"),
            Regex("^(?:abre|abreme)\\s+(?:google|el navegador)\\s+(?:y\\s+)?(?:busca|con)\\s+(.+)$"),
        )

        /** Investigar por debajo y responder hablando. */
        val RESEARCH = listOf(
            Regex("^(?:investiga|investigar|investigame|averigua|averiguame|consulta|consultar|busca|buscar|buscame|dime|cuentame|explicame|hablame)\\s+(?:informacion\\s+)?(?:sobre|de|acerca de|que|si|como|cual|cuando|donde|quien|cuanto|el|la|los|las)?\\s*(.+)$"),
            Regex("^(?:que es|que son|quien es|quien fue|quienes son|cual es|cuales son|como es|como funciona|como se|donde queda|donde esta|cuando es|cuando fue|cuanto cuesta|cuanto vale|por que)\\s+(.+)$"),
        )

        /** Preguntas sobre el clima aunque no empiecen por «investiga». */
        val WEATHER = Regex("\\b(?:clima|pronostico|va a llover|llovera|esta lloviendo|que tiempo hace|como esta el tiempo|que temperatura hace|temperatura (?:hay|hace|afuera|en))\\b")

        fun parseQuery(text: String): Action? {
            val trimmed = text.trim()
            OPEN_BROWSER.firstNotNullOfOrNull { it.matchEntire(trimmed) }?.let { m ->
                val q = m.groupValues[1].trim()
                if (q.isNotBlank()) return Action.WebSearch(q)
            }
            if (WEATHER.containsMatchIn(trimmed)) return Action.Research(trimmed)
            RESEARCH.firstNotNullOfOrNull { it.matchEntire(trimmed) }?.let { m ->
                if (m.groupValues[1].isNotBlank()) return Action.Research(trimmed)
            }
            return null
        }

        /** El clima o «cerca de mí» sin nombrar un lugar: hace falta la ubicación. */
        fun needsLocation(query: String): Boolean {
            val q = query.lowercase()
            val local = WEATHER.containsMatchIn(q) || Regex("\\b(?:cerca de mi|cerca de aqui|por aqui|aqui cerca|mi ciudad)\\b").containsMatchIn(q)
            val namesPlace = Regex("\\b(?:en|de)\\s+(?!mi\\b|aqui\\b|hoy\\b|la tarde\\b|la noche\\b|la manana\\b)[a-z]{3,}").containsMatchIn(
                q.replace(Regex("\\b(?:clima|tiempo|temperatura|pronostico)\\s+(?:de\\s+)?hoy\\b"), "")
            ) && !Regex("\\bcerca de mi\\b").containsMatchIn(q)
            return local && !namesPlace
        }
    }
}
