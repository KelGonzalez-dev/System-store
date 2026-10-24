package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class VisionSpeedRulesTest {

    private val context = ContextWrapper(null)
    private val parser = IntentParser(VisionTool(context).intentRules + InternetSpeedTool(context).intentRules)

    @Test
    fun describirFotos() {
        assertEquals(Action.DescribeImage(null), parser.parse("describe la última foto"))
        assertEquals(Action.DescribeImage(null), parser.parse("qué hay en la foto"))
        assertEquals(Action.DescribeImage(null), parser.parse("qué ves"))
    }

    @Test
    fun velocidadDeInternet() {
        assertEquals(Action.InternetSpeed, parser.parse("cómo está el wifi"))
        assertEquals(Action.InternetSpeed, parser.parse("mide la velocidad de internet"))
        assertEquals(Action.InternetSpeed, parser.parse("qué tan rápido va el internet"))
    }
}
