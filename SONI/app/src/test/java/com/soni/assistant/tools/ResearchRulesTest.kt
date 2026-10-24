package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class ResearchRulesTest {

    private val context = ContextWrapper(null)
    private val parser = IntentParser(
        WebSearchTool(context).intentRules + SoniControlTool(context).intentRules + MediaControlTool(context).intentRules,
    )

    @Test
    fun investigarNoAbreElNavegador() {
        assertEquals(Action.Research("investiga sobre los agujeros negros"), parser.parse("Investiga sobre los agujeros negros"))
        assertEquals(Action.Research("que temperatura hace"), parser.parse("¿Qué temperatura hace?"))
        assertEquals(Action.Research("como esta el clima en medellin"), parser.parse("cómo está el clima en Medellín"))
    }

    @Test
    fun soloAbreGoogleSiSeLoPiden() {
        assertEquals(Action.WebSearch("recetas de arepas"), parser.parse("busca en Google recetas de arepas"))
    }

    @Test
    fun apagate() {
        assertEquals(Action.ShutdownSoni, parser.parse("SONI, apágate"))
        assertEquals(Action.ShutdownSoni, parser.parse("deja de escucharme"))
    }

    @Test
    fun cambiarDeCancion() {
        assertEquals(Action.MediaNext, parser.parse("cambia de canción"))
        assertEquals(Action.MediaNext, parser.parse("pasa la canción"))
        assertEquals(Action.MediaPrevious, parser.parse("regresa a la canción anterior"))
    }
}
