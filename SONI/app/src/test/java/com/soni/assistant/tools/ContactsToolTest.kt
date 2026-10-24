package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import com.soni.assistant.core.RiskLevel
import org.junit.Assert.assertEquals
import org.junit.Test

class ContactsToolTest {

    private val tool = ContactsTool(ContextWrapper(null))
    private val parser = IntentParser(tool.intentRules)

    @Test
    fun reconoceConsultasYCreacionDeContactos() {
        assertEquals(Action.SearchContact("carlos"), parser.parse("busca el contacto Carlos"))
        assertEquals(Action.CreateContact("ana gomez", "3001234567"), parser.parse("guarda el contacto Ana Gomez con el numero 3001234567"))
    }

    @Test
    fun reconoceEliminacionDeContactoYExigeRiesgoAlto() {
        val action = Action.DeleteContact("carlos")
        assertEquals(action, parser.parse("elimina el contacto Carlos"))
        assertEquals(RiskLevel.HIGH, tool.riskOf(action))
    }
}
