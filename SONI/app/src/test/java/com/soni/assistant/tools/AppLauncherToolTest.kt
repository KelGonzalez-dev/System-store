package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class AppLauncherToolTest {

    private val tool = AppLauncherTool(ContextWrapper(null))
    private val parser = IntentParser(tool.intentRules)

    @Test
    fun reconoceOrdenesDeAbrirAplicaciones() {
        assertEquals(Action.OpenApp("whatsapp"), parser.parse("abre WhatsApp"))
        assertEquals(Action.OpenApp("spotify"), parser.parse("abrir Spotify"))
        assertEquals(Action.OpenApp("youtube"), parser.parse("inicia YouTube"))
        assertEquals(Action.OpenApp("tiktok"), parser.parse("lanza TikTok"))
    }

    @Test
    fun reconoceCamaraYAplicacionesDirectas() {
        assertEquals(Action.OpenApp("la camara"), parser.parse("abre la cámara"))
        assertEquals(Action.OpenApp("camara"), parser.parse("cámara"))
        assertEquals(Action.OpenApp("los ajustes"), parser.parse("abre los ajustes"))
        assertEquals(Action.OpenApp("fotos"), parser.parse("fotos"))
    }
}
