package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate
import java.time.LocalDateTime

class MemoryToolsTest {

    private val now = LocalDateTime.of(2026, 10, 22, 15, 10)

    @Test
    fun recordatoriosConHorasNaturales() {
        assertEquals(LocalDateTime.of(2026, 10, 22, 15, 30), ReminderParser.parse("recuerdame en 20 minutos sacar la ropa", now)?.at)
        assertEquals("sacar la ropa", ReminderParser.parse("recuerdame en 20 minutos sacar la ropa", now)?.text)
        assertEquals(LocalDateTime.of(2026, 10, 23, 8, 0), ReminderParser.parse("recuerdame manana a las 8 llamar al banco", now)?.at)
        assertEquals(LocalDateTime.of(2026, 10, 22, 17, 30), ReminderParser.parse("avisame a las 5 y media de la tarde que tengo cita", now)?.at)
        assertEquals(LocalDateTime.of(2026, 10, 22, 16, 10), ReminderParser.parse("recuerdame mas tarde comprar pan", now)?.at)
        assertNull(ReminderParser.parse("recuerdame que tengo que pagar el arriendo", now))
    }

    @Test
    fun notasPorVoz() {
        assertEquals(Action.AddNote("comprar pan y leche"), NotesTool.parse("anota comprar pan y leche"))
        assertEquals(Action.ReadNotes, NotesTool.parse("leeme mis notas"))
        assertEquals(Action.DeleteNotes(null), NotesTool.parse("borra todas las notas"))
        assertEquals(Action.DeleteNotes("la leche"), NotesTool.parse("borra la nota de la leche"))
    }

    @Test
    fun conocerPersonas() {
        val parser = IntentParser(PeopleTool(ContextWrapper(null)).intentRules)
        assertEquals(Action.MeetPerson("laura"), parser.parse("SONI, conoce a Laura"))
        assertEquals(Action.MeetPerson(null), parser.parse("te presento a"))
        // «quién es» de alguien desconocido no es de esta herramienta (se investiga en internet).
        assertTrue(parser.parse("quien es shakira") is Action.Unknown)
    }

    @Test
    fun edadYSigno() {
        val today = LocalDate.of(2026, 10, 22)
        val birth = Zodiac.parseBirthDate("nací el 3 de mayo de 1999", today)
        assertEquals(LocalDate.of(1999, 5, 3), birth)
        assertEquals(27, Zodiac.age(birth!!, today))
        assertEquals("Tauro", Zodiac.sign(birth))
        assertEquals(LocalDate.of(1999, 5, 3), Zodiac.parseBirthDate("03/05/1999", today))
        assertNull(Zodiac.parseBirthDate("no me acuerdo", today))
    }
}
