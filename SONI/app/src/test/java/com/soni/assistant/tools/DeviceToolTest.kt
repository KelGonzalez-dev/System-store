package com.soni.assistant.tools

import android.content.ContextWrapper
import com.soni.assistant.core.Action
import com.soni.assistant.core.IntentParser
import org.junit.Assert.assertEquals
import org.junit.Test

class DeviceToolTest {

    private val tool = DeviceTool(ContextWrapper(null))
    private val parser = IntentParser(tool.intentRules)

    @Test
    fun reconoceConsultasDeBateria() {
        assertEquals(Action.GetBatteryInfo, parser.parse("cuánta batería tengo"))
        assertEquals(Action.GetBatteryInfo, parser.parse("nivel de batería"))
        assertEquals(Action.GetBatteryInfo, parser.parse("temperatura de la batería"))
    }

    @Test
    fun reconoceConsultasDeAlmacenamientoYMemoria() {
        assertEquals(Action.GetStorageInfo, parser.parse("cuánto almacenamiento libre tengo"))
        assertEquals(Action.GetStorageInfo, parser.parse("memoria ram"))
        assertEquals(Action.GetStorageInfo, parser.parse("espacio libre"))
    }

    @Test
    fun reconoceConsultasDeDispositivoYTemperatura() {
        assertEquals(Action.GetDeviceInfo, parser.parse("modelo del teléfono"))
        assertEquals(Action.GetDeviceInfo, parser.parse("versión de android"))
        assertEquals(Action.GetAmbientTemperature, parser.parse("temperatura ambiente"))
    }

    @Test
    fun reconoceComandosDeLinternaYVolumen() {
        assertEquals(Action.ToggleFlashlight(true), parser.parse("enciende la linterna"))
        assertEquals(Action.ToggleFlashlight(false), parser.parse("apaga la linterna"))
        assertEquals(Action.SetVolume(50), parser.parse("volumen al 50%"))
        assertEquals(Action.SetVolume(80), parser.parse("sube el volumen"))
        assertEquals(Action.SetVolume(30), parser.parse("baja el volumen"))
    }
}
