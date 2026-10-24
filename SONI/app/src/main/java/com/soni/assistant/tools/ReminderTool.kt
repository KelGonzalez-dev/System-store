package com.soni.assistant.tools

import android.content.Context
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool
import com.soni.assistant.data.memory.ReminderStore
import com.soni.assistant.reminders.ReminderScheduler
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/** «Recuérdame en 20 minutos…», «¿qué recordatorios tengo?», «borra mis recordatorios». */
class ReminderTool(private val context: Context) : SoniTool {

    override val name: String = "recordatorios"
    override val description: String = "Crea recordatorios que suenan y se dicen en voz alta a la hora indicada."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    private val store by lazy { ReminderStore.get(context) }

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text -> parse(text, LocalDateTime.now()) }
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.SetReminder || action is Action.ListReminders || action is Action.ClearReminders

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.SetReminder -> create(action)
        Action.ListReminders -> list()
        Action.ClearReminders -> clear()
        else -> ActionResult.Failed("No puedo hacer eso con los recordatorios.", FailureReason.NO_TOOL)
    }

    private fun create(action: Action.SetReminder): ActionResult {
        if (action.atMillis <= System.currentTimeMillis()) {
            return ActionResult.Failed("Esa hora ya pasó. Dime otra, por ejemplo «en 10 minutos».", FailureReason.INVALID_INPUT)
        }
        val reminder = store.add(action.text, action.atMillis)
        ReminderScheduler.schedule(context, reminder)
        val whenText = describeTime(action.atMillis)
        return ActionResult.Success(
            message = "Listo, te lo recuerdo $whenText: ${action.text}.",
            spokenMessage = "Listo, te lo recuerdo $whenText.",
            actionLabel = "Recordatorio creado",
        )
    }

    private fun list(): ActionResult {
        val pending = store.pending()
        if (pending.isEmpty()) {
            return ActionResult.Success(message = "No tienes recordatorios pendientes.", actionLabel = "Recordatorios")
        }
        val lines = pending.take(10).joinToString(". ") { "${describeTime(it.atMillis)}: ${it.text}" }
        val count = if (pending.size == 1) "un recordatorio" else "${pending.size} recordatorios"
        return ActionResult.Success(message = "Tienes $count. $lines.", actionLabel = "Recordatorios")
    }

    private fun clear(): ActionResult {
        val pending = store.pending()
        pending.forEach { ReminderScheduler.cancel(context, it) }
        store.clear()
        return ActionResult.Success(
            message = if (pending.isEmpty()) "No había recordatorios." else "Borré ${pending.size} recordatorios.",
            actionLabel = "Recordatorios borrados",
        )
    }

    private fun describeTime(millis: Long): String {
        val at = Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault())
        val hour = at.format(DateTimeFormatter.ofPattern("h:mm a", SoniLocale.locale))
        val today = LocalDate.now()
        return when (at.toLocalDate()) {
            today -> "hoy a las $hour"
            today.plusDays(1) -> "mañana a las $hour"
            else -> at.format(DateTimeFormatter.ofPattern("EEEE d 'de' MMMM", SoniLocale.locale)) + " a las $hour"
        }
    }

    companion object {
        private val LIST = Regex("\\b(?:que|cuales|mis|leeme|dime)\\s+(?:son\\s+)?(?:mis\\s+)?recordatorios\\b|\\bque recordatorios tengo\\b")
        private val CLEAR = Regex("^(?:borra|elimina|cancela|quita)\\s+(?:todos\\s+)?(?:mis|los)\\s+recordatorios$")

        fun parse(text: String, now: LocalDateTime): Action? {
            if (CLEAR.matches(text)) return Action.ClearReminders
            if (LIST.containsMatchIn(text)) return Action.ListReminders
            val parsed = ReminderParser.parse(text, now) ?: return null
            val millis = parsed.at.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
            return Action.SetReminder(parsed.text, millis)
        }
    }
}
