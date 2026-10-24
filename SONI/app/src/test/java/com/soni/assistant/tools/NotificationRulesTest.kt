package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class NotificationRulesTest {

    private val context = ContextWrapper(null)
    private val parser = IntentParser(AvailabilityTool(context).intentRules + CallTool(context).intentRules)

    @Test
    fun leerNotificaciones() {
        assertEquals(Action.SetReadNotifications(true), parser.parse("léeme las notificaciones"))
        assertEquals(Action.SetReadNotifications(false), parser.parse("ya no me leas las notificaciones"))
    }

    @Test
    fun modoNoDisponible() {
        assertEquals(Action.SetAwayMode(true), parser.parse("no estoy para responder mensajes ahora"))
        assertEquals(Action.SetAwayMode(true), parser.parse("activa el modo no disponible"))
        assertEquals(Action.SetAwayMode(false), parser.parse("ya puedo responder"))
    }

    @Test
    fun llamadas() {
        assertEquals(Action.CallControl(answer = true), parser.parse("contesta la llamada"))
        assertEquals(Action.CallControl(answer = false), parser.parse("cuelga"))
        assertEquals(Action.CallControl(answer = false), parser.parse("rechaza la llamada"))
    }
}
