package com.soni.assistant.tools

import android.content.Context
import com.soni.assistant.ai.GeminiBrain
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.ConversationFlow
import com.soni.assistant.core.ConversationStarter
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.FlowReply
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool
import com.soni.assistant.data.memory.MemoryText
import com.soni.assistant.data.memory.Person
import com.soni.assistant.data.memory.PeopleStore
import com.soni.assistant.data.settings.SoniSettings
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * «Conoce a…»: SONI saluda, pregunta nombre y fecha de nacimiento, calcula edad y signo,
 * habla del signo, pregunta qué es esa persona para el jefe y lo guarda.
 * «¿Qué sabes de Laura?»: dice lo que recuerda.
 */
class PeopleTool(private val context: Context) : SoniTool, ConversationStarter {

    override val name: String = "personas"
    override val description: String = "Conoce personas nuevas y recuerda sus datos."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    private val store by lazy { PeopleStore.get(context) }

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text -> parse(text) }
    )

    private fun parse(text: String): Action? {
        val meet = MEET.matchEntire(text)
        if (meet != null) return Action.MeetPerson(meet.groupValues[1].trim().ifBlank { null })
        val about = ABOUT.matchEntire(text) ?: return null
        val who = about.groupValues[1].trim()
        // Solo si es alguien que SONI conoció; si no, «quién es…» se investiga en internet.
        val known = runCatching { store.find(who) }.getOrNull()
        return if (known != null) Action.AboutPerson(who) else null
    }

    override fun canHandle(action: Action): Boolean = action is Action.MeetPerson || action is Action.AboutPerson

    override fun startFlow(action: Action): ConversationFlow? =
        if (action is Action.MeetPerson) MeetPersonFlow(context, store) else null

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.AboutPerson -> describe(action.name)
        is Action.MeetPerson -> ActionResult.Success(message = "¡Hola! ¿Cómo te llamas?", actionLabel = "Conocer a alguien")
        else -> ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)
    }

    private fun describe(name: String): ActionResult {
        val person = store.find(name)
            ?: return ActionResult.Failed("Todavía no conozco a $name. Dime «conoce a $name» para presentármela.", FailureReason.INVALID_INPUT)
        return ActionResult.Success(message = summary(person, bossName(context)), actionLabel = "Lo que sé de ${person.name}")
    }

    companion object {
        private val MEET = Regex(
            "^(?:conoce a|conoce|quiero que conozcas a|te presento a|te quiero presentar a|presentate con|saluda a|ven a conocer a)\\s*(.*)$"
        )
        private val ABOUT = Regex("^(?:que sabes de|quien es|que me puedes decir de|recuerdas a|te acuerdas de|conoces a|cuando cumple|cuantos anos tiene)\\s+(.+)$")

        private val DATE_FORMAT = DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy", SoniLocale.locale)

        fun bossName(context: Context): String =
            SoniSettings.get(context).current.userName.ifBlank { "mi jefe" }

        fun summary(person: Person, boss: String): String = buildString {
            append(person.name)
            person.relation?.let { append(" es $it de $boss") }
            person.birthDate?.let { birth ->
                append(if (person.relation != null) ". " else " ")
                append("Nació el ${birth.format(DATE_FORMAT)}, tiene ${Zodiac.age(birth)} años")
                append(" y es ${person.sign ?: Zodiac.sign(birth)}")
                nextBirthdayText(birth)?.let { append(". $it") }
            }
            append(".")
        }

        private fun nextBirthdayText(birth: LocalDate, today: LocalDate = LocalDate.now()): String? {
            var next = birth.withYear(today.year)
            if (next.isBefore(today)) next = next.plusYears(1)
            val days = java.time.temporal.ChronoUnit.DAYS.between(today, next)
            return when (days) {
                0L -> "¡Hoy es su cumpleaños!"
                1L -> "Mañana es su cumpleaños"
                in 2L..30L -> "Su cumpleaños es en $days días"
                else -> null
            }
        }
    }
}

/** La conversación paso a paso para conocer a alguien. */
private class MeetPersonFlow(
    private val context: Context,
    private val store: PeopleStore,
) : ConversationFlow {

    private enum class Step { NAME, BIRTH, RELATION }

    private var step = Step.NAME
    private var name = ""
    private var birth: LocalDate? = null
    private var sign: String? = null
    private var birthAttempts = 0

    private val boss get() = PeopleTool.bossName(context)

    override suspend fun start(): FlowReply =
        FlowReply("¡Hola! Mucho gusto, soy SONI, el asistente de $boss. ¿Cómo te llamas?", finished = false, label = "Conocer a alguien")

    override suspend fun next(input: String): FlowReply = when (step) {
        Step.NAME -> onName(input)
        Step.BIRTH -> onBirth(input)
        Step.RELATION -> onRelation(input)
    }

    private fun onName(input: String): FlowReply {
        val cleaned = input.trim()
            .replace(Regex("^(?i)(?:hola[,.]?\\s*)?(?:me llamo|mi nombre es|soy|yo soy|me dicen)\\s+"), "")
            .trim(' ', '.', ',', '!', '¡')
        if (cleaned.isBlank()) return FlowReply("No te escuché bien. ¿Cómo te llamas?", finished = false)
        name = cleaned.split(Regex("\\s+")).take(3).joinToString(" ") { w -> w.lowercase().replaceFirstChar { it.uppercase() } }

        store.find(name)?.takeIf { it.birthDate != null && it.relation != null }?.let { known ->
            return FlowReply(
                "¡Hola de nuevo, ${known.name}! Ya te conozco. ${PeopleTool.summary(known, boss)}",
                finished = true,
            )
        }
        step = Step.BIRTH
        return FlowReply("¡Mucho gusto, $name! ¿Cuál es tu fecha de nacimiento? Por ejemplo: 3 de mayo de 1999.", finished = false)
    }

    private suspend fun onBirth(input: String): FlowReply {
        val date = Zodiac.parseBirthDate(input)
        if (date == null) {
            birthAttempts++
            if (birthAttempts >= 3) {
                step = Step.RELATION
                return FlowReply("No logré entender la fecha, lo dejamos para después. Cuéntame, ¿qué eres para $boss?", finished = false)
            }
            return FlowReply("No entendí la fecha. Dímela así: día, mes y año, por ejemplo 3 de mayo de 1999.", finished = false)
        }
        birth = date
        val zodiac = Zodiac.sign(date)
        sign = zodiac
        val age = Zodiac.age(date)

        val analysis = GeminiBrain.createOrNull(context)?.chat(
            "Haz un análisis breve, cálido y divertido (3 o 4 frases) de las características que la astrología " +
                "le atribuye al signo $zodiac, dirigido a $name, que tiene $age años. Empieza con «Según la astrología». " +
                "Sin markdown ni listas, para leer en voz alta."
        ) ?: Zodiac.traits(zodiac)

        step = Step.RELATION
        return FlowReply(
            "Tienes $age años y eres $zodiac. $analysis Y ahora cuéntame, $name, ¿qué eres para $boss?",
            finished = false,
        )
    }

    private fun onRelation(input: String): FlowReply {
        val relation = input.trim()
            .replace(Regex("^(?i)(?:yo\\s+)?(?:soy|es)\\s+"), "")
            .replace(Regex("(?i)\\s+de\\s+(?:el|ella|${Regex.escape(MemoryText.plain(boss))}|${Regex.escape(boss)})$"), "")
            .trim(' ', '.', ',', '!')
            .ifBlank { "conocido" }
        val person = Person(
            name = name,
            birthDate = birth,
            sign = sign,
            relation = relation.lowercase(SoniLocale.locale),
            metAt = System.currentTimeMillis(),
        )
        store.save(person)
        return FlowReply(
            "¡Perfecto, $name! Ya te conozco: eres ${person.relation} de $boss. Lo guardé en mi memoria. Fue un gusto.",
            finished = true,
            label = "Persona guardada",
        )
    }
}
