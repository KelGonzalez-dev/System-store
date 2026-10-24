package com.soni.assistant.voice

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

/** Puente para pedir acciones de voz desde fuera del servicio (por ejemplo, «callar» en la burbuja). */
object SpeechController {

    private val _commands = MutableSharedFlow<Command>(extraBufferCapacity = 4)
    val commands = _commands.asSharedFlow()

    enum class Command { STOP_SPEAKING }

    fun stopSpeaking() { _commands.tryEmit(Command.STOP_SPEAKING) }
}
