package com.soni.assistant.ui.home

enum class AssistantStatus { IDLE, LISTENING, PROCESSING, SUCCESS, ERROR }

enum class MessageKind { USER, SUCCESS, ERROR, INFO }

data class ChatMessage(
    val id: Long,
    val kind: MessageKind,
    val text: String,
    /** Qué acción se ejecutó realmente, p. ej. «Cálculo realizado». */
    val actionLabel: String? = null,
)

/** La orden necesita permisos: la pantalla los pide y, si se conceden, repite [retryText]. */
data class PermissionRequest(val permissions: List<String>, val retryText: String)

/** Acción de riesgo alto esperando que el usuario confirme o cancele. */
data class ConfirmationRequest(val id: String, val message: String)

data class HomeUiState(
    val status: AssistantStatus = AssistantStatus.IDLE,
    val statusDetail: String? = null,
    val partialTranscript: String = "",
    val micLevel: Float = 0f,
    val messages: List<ChatMessage> = emptyList(),
    val voiceInputAvailable: Boolean = true,
    val permissionRequest: PermissionRequest? = null,
    val pendingConfirmation: ConfirmationRequest? = null,
)
