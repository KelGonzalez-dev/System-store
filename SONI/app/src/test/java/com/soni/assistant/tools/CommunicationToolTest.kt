package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class CommunicationToolTest {

    private val tool = CommunicationTool(ContextWrapper(null))
    private val parser = IntentParser(tool.intentRules)

    @Test
    fun reconoceLlamadas() {
        assertEquals(Action.CallContact("mama"), parser.parse("llama a Mama"))
        assertEquals(Action.CallContact("3001234567"), parser.parse("llamar a 3001234567"))
    }

    @Test
    fun reconoceSmsYWhatsApp() {
        assertEquals(
            Action.SendSms("carlos", "hola como estas"),
            parser.parse("envia un sms a Carlos diciendo hola como estas")
        )
        assertEquals(
            Action.SendWhatsApp("mama", "ya voy en camino"),
            parser.parse("whatsapp a Mama diciendo ya voy en camino")
        )
    }

    @Test
    fun entiendeFrasesNaturalesConRoles() {
        assertEquals(
            Action.SendWhatsApp("mi mama", "mami te amo"),
            parser.parse("Envíale un mensaje a mi mamá, que diga, mami te amo"),
        )
        assertEquals(
            Action.SendWhatsApp("mi jefa", "llego en 10 minutos"),
            parser.parse("dile a mi jefa que llego en 10 minutos"),
        )
        assertEquals(
            Action.SendWhatsApp("mi mama", "la quiero"),
            parser.parse("escríbele a mi mamá por whatsapp que la quiero"),
        )
        assertEquals(Action.CallContact("mi jefa"), parser.parse("llámale a mi jefa"))
    }
}
