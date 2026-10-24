package com.soni.assistant.core

/**
 * Intenciones que SONI reconoce. Cada variante lleva sus parámetros ya tipados:
 * las herramientas nunca reciben texto libre sin validar.
 *
 * No es `sealed` para que cada herramienta nueva defina sus acciones junto a ella. Eso no
 * abre ninguna puerta: una acción solo se ejecuta si una herramienta del [ToolRegistry]
 * la acepta, y pasa siempre por la comprobación de permisos y riesgo del motor.
 */
interface Action {
    data object TellTime : Action
    data class TellDate(val dayOffset: Int = 0) : Action
    data class Calculate(val expression: String) : Action
    data class ConvertUnit(
        val value: Double,
        val sourceUnit: String,
        val targetUnit: String,
    ) : Action
    data object GetBatteryInfo : Action
    data object GetStorageInfo : Action
    data object GetDeviceInfo : Action
    data object GetAmbientTemperature : Action
    data class ToggleFlashlight(val enable: Boolean) : Action
    data class SetVolume(val percent: Int) : Action
    data class OpenApp(val appName: String) : Action
    data object MediaPlay : Action
    data object MediaPause : Action
    data object MediaNext : Action
    data object MediaPrevious : Action
    data object MediaNowPlaying : Action
    data class SearchMusic(val query: String) : Action
    data class SearchContact(val query: String) : Action
    data class CreateContact(val name: String, val phone: String) : Action
    data class DeleteContact(val name: String) : Action
    data class CallContact(val nameOrPhone: String) : Action
    data class SendSms(val recipient: String, val message: String) : Action
    data class SendWhatsApp(val recipient: String, val message: String) : Action
    data class WebSearch(val query: String) : Action
    /** Investigar en internet por debajo y responder hablando (sin abrir el navegador). */
    data class Research(val query: String) : Action
    /** «Apágate»: dejar de escuchar en segundo plano. */
    data object ShutdownSoni : Action
    /** Recordatorio: [text] a las [atMillis] (hora del teléfono, en milisegundos). */
    data class SetReminder(val text: String, val atMillis: Long) : Action
    data object ListReminders : Action
    data object ClearReminders : Action
    data class AddNote(val text: String) : Action
    data object ReadNotes : Action
    /** Borra las notas que contengan [query], o todas si es null. */
    data class DeleteNotes(val query: String?) : Action
    /** «Conoce a…»: abre la conversación para conocer a una persona. */
    data class MeetPerson(val nameHint: String?) : Action
    /** «¿Qué sabes de Laura?» */
    data class AboutPerson(val name: String) : Action
    /** «Léeme el libro…»: buscar el documento en el teléfono y leerlo en voz alta. */
    data class ReadDocument(val query: String, val fromStart: Boolean = false) : Action
    data class SummarizeDocument(val query: String) : Action
    data object ListDocuments : Action
    /** Controles de la lectura en curso. */
    data class ReaderControl(val command: ReaderCommand) : Action
    enum class ReaderCommand { PAUSE, RESUME, STOP, FORWARD, BACK, PROGRESS }
    /** Saltar en el documento: a un texto, a una fracción (0-1) o a una «página». */
    data class ReaderSeek(val text: String? = null, val fraction: Float? = null, val page: Int? = null) : Action
    /** Control de notificaciones y disponibilidad. */
    data class SetReadNotifications(val enabled: Boolean) : Action
    data class SetAwayMode(val enabled: Boolean) : Action
    /** Llamadas: contestar o colgar/rechazar. */
    data class CallControl(val answer: Boolean) : Action
    /** Describir una imagen: la última foto, o una que el usuario comparte con SONI. */
    data class DescribeImage(val uri: String?) : Action
    /** Medir la velocidad de internet. */
    data object InternetSpeed : Action
    /** Cámara. [selfie] usa la frontal; [count] fotos; [delaySeconds] cuenta regresiva; [review] = análisis de IA. */
    data class TakePhoto(val selfie: Boolean = false, val count: Int = 1, val delaySeconds: Int = 0, val review: Boolean = true) : Action
    data class RecordVideo(val seconds: Int, val selfie: Boolean = false) : Action
    data object OpenCamera : Action
    data object Greeting : Action
    data object Help : Action
    data class Unknown(val originalText: String) : Action
}
