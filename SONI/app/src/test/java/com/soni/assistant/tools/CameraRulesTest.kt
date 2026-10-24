package com.soni.assistant.tools

import com.soni.assistant.core.Action
import org.junit.Assert.assertEquals
import org.junit.Test

class CameraRulesTest {

    @Test
    fun fotos() {
        assertEquals(Action.TakePhoto(count = 1), CameraTool.parse("toma una foto"))
        assertEquals(Action.TakePhoto(selfie = true), CameraTool.parse("tómate una selfie"))
        assertEquals(Action.TakePhoto(delaySeconds = 10), CameraTool.parse("toma una foto en 10 segundos"))
        assertEquals(Action.TakePhoto(count = 3), CameraTool.parse("toma 3 fotos"))
        assertEquals(Action.TakePhoto(count = 3), CameraTool.parse("tómame una foto con diferente zoom"))
    }

    @Test
    fun video() {
        assertEquals(Action.RecordVideo(seconds = 15), CameraTool.parse("graba un video de 15 segundos"))
    }

    @Test
    fun abrirSoloAbre() {
        assertEquals(Action.OpenCamera, CameraTool.parse("abre la cámara"))
    }
}
