package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class MediaControlToolTest {

    private val tool = MediaControlTool(ContextWrapper(null))
    private val parser = IntentParser(tool.intentRules)

    @Test
    fun reconoceComandosDeReproduccion() {
        assertEquals(Action.MediaPlay, parser.parse("reproduce"))
        assertEquals(Action.MediaPlay, parser.parse("pon la musica"))
        assertEquals(Action.MediaPause, parser.parse("pausa"))
        assertEquals(Action.MediaPause, parser.parse("para la musica"))
        assertEquals(Action.MediaNext, parser.parse("siguiente cancion"))
        assertEquals(Action.MediaPrevious, parser.parse("cancion anterior"))
        assertEquals(Action.MediaNowPlaying, parser.parse("que suena"))
    }

    @Test
    fun reconoceBusquedasDeMusica() {
        assertEquals(Action.SearchMusic("rock de los 80"), parser.parse("pon rock de los 80"))
        assertEquals(Action.SearchMusic("coldplay"), parser.parse("busca en spotify Coldplay"))
    }
}
