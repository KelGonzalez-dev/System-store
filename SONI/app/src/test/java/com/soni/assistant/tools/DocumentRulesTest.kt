package com.soni.assistant.tools

import com.soni.assistant.core.Action
import com.soni.assistant.core.Action.ReaderCommand
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class DocumentRulesTest {

    @Test
    fun leerLibros() {
        assertEquals(Action.ReadDocument("nosotros en la luna"), DocumentTool.parse("leeme el libro nosotros en la luna", false))
        assertEquals(Action.ReadDocument("nosotros en la luna", fromStart = true), DocumentTool.parse("lee nosotros en la luna desde el principio", false))
        assertNull(DocumentTool.parse("leeme mis notas", false))
    }

    @Test
    fun controlarLaLectura() {
        assertEquals(Action.ReaderControl(ReaderCommand.PAUSE), DocumentTool.parse("pausa la lectura", false))
        assertEquals(Action.ReaderControl(ReaderCommand.RESUME), DocumentTool.parse("sigue leyendo", false))
        assertEquals(Action.ReaderControl(ReaderCommand.STOP), DocumentTool.parse("cierra el libro", false))
        // «pausa» a secas es para el lector solo si está leyendo; si no, es para la música.
        assertEquals(Action.ReaderControl(ReaderCommand.PAUSE), DocumentTool.parse("pausa", true))
        assertNull(DocumentTool.parse("pausa", false))
    }

    @Test
    fun resumirYListar() {
        assertEquals(Action.SummarizeDocument("contrato"), DocumentTool.parse("resumeme el documento contrato", false))
        assertEquals(Action.ListDocuments, DocumentTool.parse("que libros tengo", false))
    }

    @Test
    fun saltarEnLaLectura() {
        assertEquals(Action.ReaderSeek(text = "la guerra"), DocumentTool.parse("ve a donde habla de la guerra", true))
        assertEquals(Action.ReaderSeek(text = "capitulo 3"), DocumentTool.parse("salta al capítulo 3", true))
        assertEquals(Action.ReaderSeek(page = 50), DocumentTool.parse("ve a la página 50", true))
        assertEquals(Action.ReaderSeek(fraction = 0.5f), DocumentTool.parse("salta a la mitad", true))
    }
}
