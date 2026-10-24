package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MusicSearchRulesTest {

    private val context = ContextWrapper(null)
    private val parser = IntentParser(
        AppLauncherTool(context).intentRules + MediaControlTool(context).intentRules,
    )

    @Test
    fun reproduceConNombreBuscaLaCancion() {
        assertEquals(Action.SearchMusic("bad bunny"), parser.parse("reproduce Bad Bunny"))
        assertEquals(Action.SearchMusic("bad bunny"), parser.parse("reproduce bad bunny en Spotify"))
        assertEquals(Action.SearchMusic("despacito"), parser.parse("quiero escuchar despacito"))
    }

    @Test
    fun ponYaNoAbreUnaAppInexistente() {
        assertEquals(Action.SearchMusic("coldplay"), parser.parse("pon Coldplay"))
    }

    @Test
    fun abrirSigueFuncionando() {
        assertEquals(Action.OpenApp("la camara"), parser.parse("abre la cámara"))
    }

    @Test
    fun ponUnaAlarmaNoEsMusica() {
        assertTrue(parser.parse("pon una alarma") !is Action.SearchMusic)
    }
}
