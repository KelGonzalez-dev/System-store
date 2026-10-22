package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.Clock
import java.time.Instant
import java.time.ZoneId
import java.util.Locale

class TimeToolTest {

    private val zone = ZoneId.of("America/Bogota")
    private val locale = Locale.forLanguageTag("es-CO")

    private fun toolAt(isoInstant: String) =
        TimeTool(clockProvider = { Clock.fixed(Instant.parse(isoInstant), zone) }, locale = locale)

    @Test
    fun diceLaHoraLocalEnEspanol() = runBlocking {
        // 20:45 UTC = 15:45 en Bogotá (UTC-5).
        assertEquals("Son las 3:45 de la tarde.", toolAt("2026-10-20T20:45:00Z").execute(Action.TellTime).message)
        assertEquals("Es la 1:05 de la madrugada.", toolAt("2026-10-20T06:05:00Z").execute(Action.TellTime).message)
        assertEquals("Son las 12:30 del mediodía.", toolAt("2026-10-20T17:30:00Z").execute(Action.TellTime).message)
    }

    @Test
    fun diceLaFechaYLosDiasRelativos() = runBlocking {
        val tool = toolAt("2026-10-20T20:45:00Z")
        val today = tool.execute(Action.TellDate(0))
        assertTrue(today is ActionResult.Success)
        assertEquals("Hoy es martes, 20 de octubre de 2026.", today.message)
        assertEquals("Mañana será miércoles, 21 de octubre de 2026.", tool.execute(Action.TellDate(1)).message)
        assertEquals("Ayer fue lunes, 19 de octubre de 2026.", tool.execute(Action.TellDate(-1)).message)
    }
}
