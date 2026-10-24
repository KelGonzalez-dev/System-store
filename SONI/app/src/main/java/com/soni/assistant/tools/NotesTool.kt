package com.soni.assistant.tools

import android.content.Context
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.data.memory.NoteStore

/** Bloc de notas por voz: «anota que…», «léeme mis notas», «borra la nota de la leche». */
class NotesTool(private val context: Context) : SoniTool {

    override val name: String = "notas"
    override val description: String = "Guarda, lee y borra notas por voz."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    private val store by lazy { NoteStore.get(context) }

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text -> parse(text) }
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.AddNote || action is Action.ReadNotes || action is Action.DeleteNotes

    /** Borrar todas las notas pide confirmación. */
    override fun riskOf(action: Action): RiskLevel =
        if (action is Action.DeleteNotes && action.query == null) RiskLevel.HIGH else RiskLevel.LOW

    override fun describe(action: Action): String = when (action) {
        is Action.DeleteNotes -> if (action.query == null) "borrar todas tus notas" else "borrar las notas sobre «${action.query}»"
        else -> "usar tus notas"
    }

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.AddNote -> {
            store.add(capitalize(action.text))
            ActionResult.Success(
                message = "Anotado: «${capitalize(action.text)}».",
                spokenMessage = "Anotado.",
                actionLabel = "Nota guardada",
            )
        }
        Action.ReadNotes -> read()
        is Action.DeleteNotes -> {
            val removed = store.delete(action.query)
            ActionResult.Success(
                message = when {
                    removed == 0 -> "No encontré notas para borrar."
                    removed == 1 -> "Borré una nota."
                    else -> "Borré $removed notas."
                },
                actionLabel = "Notas borradas",
            )
        }
        else -> ActionResult.Failed("No puedo hacer eso con las notas.", FailureReason.NO_TOOL)
    }

    private fun read(): ActionResult {
        val notes = store.all()
        if (notes.isEmpty()) return ActionResult.Success(message = "No tienes notas guardadas.", actionLabel = "Notas")
        val recent = notes.takeLast(10).reversed()
        val intro = if (notes.size == 1) "Tienes una nota" else "Tienes ${notes.size} notas" +
            if (notes.size > 10) ". Te leo las 10 más recientes" else ""
        val body = recent.mapIndexed { i, n -> "${i + 1}: ${n.text}" }.joinToString(". ")
        return ActionResult.Success(message = "$intro. $body.", actionLabel = "Notas")
    }

    private fun capitalize(text: String) = text.trim().replaceFirstChar { it.uppercase() }

    companion object {
        private val ADD = Regex(
            "^(?:anota|anotame|apunta|apuntame|toma nota|guarda una nota|guardame una nota|crea una nota|haz una nota|" +
                "escribe una nota|agrega una nota|nueva nota)\\s*(?:de que|que|de|diciendo|:)?\\s+(.+)$"
        )
        private val READ = Regex(
            "\\b(?:lee|leeme|dime|cuales son|que dicen|muestrame|repasa)\\s+(?:mis|las)\\s+notas\\b|^(?:mis notas|que notas tengo|tengo notas)$"
        )
        private val DELETE_ALL = Regex("^(?:borra|elimina|quita)\\s+(?:todas\\s+)?(?:mis|las)\\s+notas$")
        private val DELETE_ONE = Regex("^(?:borra|elimina|quita)\\s+la\\s+nota\\s+(?:de|del|que dice|sobre|con)\\s+(.+)$")

        fun parse(text: String): Action? {
            DELETE_ONE.matchEntire(text)?.let { return Action.DeleteNotes(it.groupValues[1].trim()) }
            if (DELETE_ALL.matches(text)) return Action.DeleteNotes(null)
            if (READ.containsMatchIn(text)) return Action.ReadNotes
            ADD.matchEntire(text)?.let { m ->
                val note = m.groupValues[1].trim()
                if (note.isNotBlank()) return Action.AddNote(note)
            }
            return null
        }
    }
}
