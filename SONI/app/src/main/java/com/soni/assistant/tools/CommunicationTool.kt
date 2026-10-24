package com.soni.assistant.tools

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.ContactsContract
import android.telephony.SmsManager
import androidx.core.content.ContextCompat
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.accessibility.SoniAccessibilityService
import com.soni.assistant.data.contacts.ContactRoleStore

class CommunicationTool(private val context: Context) : SoniTool {

    override val name: String = "comunicacion"
    override val description: String = "Llama, envía SMS y escribe y envía mensajes de WhatsApp a contactos o roles («mi mamá»)."
    override val requiredPermissions: List<String> = listOf(
        Manifest.permission.CALL_PHONE,
        Manifest.permission.SEND_SMS,
    )
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            parseMessageQuery(text) ?: parseCallQuery(text)
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.CallContact ||
        action is Action.SendSms ||
        action is Action.SendWhatsApp

    override fun permissionsFor(action: Action): List<String> = when (action) {
        is Action.CallContact -> listOf(Manifest.permission.CALL_PHONE)
        is Action.SendSms -> listOf(Manifest.permission.SEND_SMS)
        is Action.SendWhatsApp -> emptyList()
        else -> requiredPermissions
    }

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.CallContact -> makeCall(action.nameOrPhone)
        is Action.SendSms -> sendSms(action.recipient, action.message)
        is Action.SendWhatsApp -> sendWhatsApp(action.recipient, action.message)
        else -> ActionResult.Failed("No puedo realizar esta acción de comunicación.", FailureReason.NO_TOOL)
    }

    private val resolver by lazy { ContactResolver(context) }

    private fun notFound(who: String): ActionResult {
        val noContacts = ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) !=
            PackageManager.PERMISSION_GRANTED
        return ActionResult.Failed(
            message = if (noContacts) {
                "No encontré a «$who». Dale a SONI permiso de contactos, o asígnale un rol en Contactos (icono de personas)."
            } else {
                "No encontré a «$who» en tus contactos. Puedes asignarle un rol en Contactos (icono de personas)."
            },
            spokenMessage = "No encontré a $who en tus contactos.",
            reason = FailureReason.INVALID_INPUT,
        )
    }

    private fun makeCall(nameOrPhone: String): ActionResult {
        val contact = resolver.resolve(nameOrPhone) ?: return notFound(nameOrPhone)

        val hasCallPermission = ContextCompat.checkSelfPermission(context, Manifest.permission.CALL_PHONE) ==
            PackageManager.PERMISSION_GRANTED
        val intent = Intent(
            if (hasCallPermission) Intent.ACTION_CALL else Intent.ACTION_DIAL,
            Uri.parse("tel:" + Uri.encode(contact.phone)),
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        return try {
            context.startActivity(intent)
            ActionResult.Success(
                message = "Llamando a ${contact.name} (${contact.phone}).",
                spokenMessage = "Llamando a ${spokenName(nameOrPhone, contact)}",
                actionLabel = "Llamada iniciada",
            )
        } catch (e: Exception) {
            ActionResult.Failed("No se pudo realizar la llamada.", FailureReason.UNEXPECTED)
        }
    }

    private fun sendSms(recipient: String, message: String): ActionResult {
        val contact = resolver.resolve(recipient) ?: return notFound(recipient)
        val text = tidy(message)

        val hasSmsPermission = ContextCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) ==
            PackageManager.PERMISSION_GRANTED
        if (hasSmsPermission) {
            return try {
                val smsManager = context.getSystemService(SmsManager::class.java)
                smsManager.sendTextMessage(contact.phone, null, text, null, null)
                ActionResult.Success(
                    message = "SMS enviado a ${contact.name}: «$text».",
                    spokenMessage = "Listo, le envié el mensaje a ${spokenName(recipient, contact)}",
                    actionLabel = "SMS enviado",
                )
            } catch (e: Exception) {
                ActionResult.Failed("No se pudo enviar el SMS.", FailureReason.UNEXPECTED)
            }
        }
        val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:" + Uri.encode(contact.phone)))
            .putExtra("sms_body", text)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        return ActionResult.Success(
            message = "SMS preparado para ${contact.name}. Pulsa enviar.",
            spokenMessage = "Te dejé el mensaje listo para ${spokenName(recipient, contact)}",
            actionLabel = "SMS preparado",
        )
    }

    private fun sendWhatsApp(recipient: String, message: String): ActionResult {
        val contact = resolver.resolve(recipient) ?: return notFound(recipient)
        val text = tidy(message)
        if (text.isBlank()) {
            return ActionResult.Failed(
                message = "¿Qué le digo a ${contact.name}? Dímelo así: «dile a ${recipient.trim()} que…».",
                reason = FailureReason.INVALID_INPUT,
            )
        }

        val pkg = SoniAccessibilityService.WHATSAPP_PACKAGES
            .firstOrNull { context.packageManager.getLaunchIntentForPackage(it) != null }
            ?: return ActionResult.Failed("No encontré WhatsApp instalado.", FailureReason.NO_TOOL)

        val url = "https://api.whatsapp.com/send?phone=${contact.internationalDigits}&text=${Uri.encode(text)}"
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            .setPackage(pkg)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        // Se pide pulsar «Enviar» siempre: si el servicio está activo, lo hará aunque tarde en conectarse.
        val autoSend = SoniAccessibilityService.isEnabled(context)
        SoniAccessibilityService.requestWhatsAppSend()

        return try {
            context.startActivity(intent)
            if (autoSend) {
                ActionResult.Success(
                    message = "WhatsApp a ${contact.name}: «$text». Enviando…",
                    spokenMessage = "Listo, le escribí a ${spokenName(recipient, contact)}",
                    actionLabel = "WhatsApp enviado",
                )
            } else {
                ActionResult.Success(
                    message = "Dejé el mensaje escrito para ${contact.name}: «$text». Para que lo envíe solo, " +
                        "activa «SONI: enviar mensajes» en Ajustes → Accesibilidad (o desde Mis contactos → Activar).",
                    spokenMessage = "Te dejé el mensaje escrito para ${spokenName(recipient, contact)}. Solo pulsa enviar.",
                    actionLabel = "WhatsApp preparado",
                )
            }
        } catch (e: Exception) {
            ActionResult.Failed("No pude abrir WhatsApp.", FailureReason.UNEXPECTED)
        }
    }

    /** «mi mamá» se dice tal cual; si no, el nombre de la agenda sin emojis. */
    private fun spokenName(spoken: String, contact: ResolvedContact): String =
        if (contact.fromRole) {
            spoken.trim().replace(Regex("^(?:a|al)\\s+"), "")
        } else {
            ContactRoleStore.plain(contact.name).ifBlank { spoken }
        }

    /** El texto llega en minúsculas y sin tildes desde el parser: al menos la primera en mayúscula. */
    private fun tidy(message: String): String =
        message.trim().trim(',', '.', ' ').replaceFirstChar { it.uppercase() }

    private companion object {
        private const val CONNECTOR = "(?:que\\s+diga|que\\s+dice|que\\s+le\\s+diga|diciendo|que)"

        /** «envíale un mensaje (por whatsapp) a mi mamá que diga…», «escríbele a Juan diciendo…». */
        private val SEND = Regex(
            "^(?:envia|enviale|enviar|manda|mandale|mandar|escribe|escribele|escribir|dejale)\\s+" +
                "(?:un\\s+|una\\s+)?(?:(mensaje de texto|mensaje|msj|whatsapp|wasap|wasa|sms|texto|nota)\\s+)?" +
                "(?:por\\s+(whatsapp|wasap|sms|mensaje de texto)\\s+)?" +
                "(?:a|al|para)\\s+(.+?)(?:\\s+por\\s+(whatsapp|wasap|sms))?\\s+$CONNECTOR\\s+(.+)$"
        )

        /** «whatsapp a mamá diciendo…» (sin verbo). */
        private val BARE = Regex(
            "^(?:un\\s+)?(whatsapp|wasap|sms|mensaje de texto|mensaje)\\s+(?:a|al|para)\\s+(.+?)\\s+$CONNECTOR\\s+(.+)$"
        )

        /** «dile a mi mamá que…», «avísale a mi jefa que…». */
        private val TELL = Regex("^(?:dile|dele|avisale|preguntale)\\s+(?:a|al)\\s+(.+?)\\s+que\\s+(.+)$")

        private val CALL = Regex(
            "^(?:llama|llamale|llamar|marca|marcale|marcar|telefonea)\\s+(?:a|al)?\\s*(.+?)(?:\\s+por\\s+(?:telefono|celular))?$"
        )

        fun parseCallQuery(text: String): Action? {
            val m = CALL.find(text.replace(",", " ").replace(Regex("\\s+"), " ").trim()) ?: return null
            val who = m.groupValues[1].trim()
            return if (who.isNotBlank()) Action.CallContact(who) else null
        }

        fun parseMessageQuery(text: String): Action? {
            val clean = text.replace(",", " ").replace(Regex("\\s+"), " ").trim()

            TELL.find(clean)?.let { m ->
                return Action.SendWhatsApp(m.groupValues[1].trim(), m.groupValues[2].trim())
            }

            BARE.find(clean)?.let { b ->
                val who = b.groupValues[2].trim()
                val message = b.groupValues[3].trim()
                val isSms = b.groupValues[1] == "sms" || b.groupValues[1] == "mensaje de texto"
                return if (isSms) Action.SendSms(who, message) else Action.SendWhatsApp(who, message)
            }

            val m = SEND.find(clean) ?: return null
            val channel = listOf(m.groupValues[1], m.groupValues[2], m.groupValues[4]).joinToString(" ")
            val who = m.groupValues[3].trim()
            val message = m.groupValues[5].trim()
            if (who.isBlank() || message.isBlank()) return null
            val isSms = channel.contains("sms") || channel.contains("mensaje de texto")
            return if (isSms) Action.SendSms(who, message) else Action.SendWhatsApp(who, message)
        }
    }
}
