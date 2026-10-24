package com.soni.assistant.tools

import android.Manifest
import android.content.ContentProviderOperation
import android.content.Context
import android.provider.ContactsContract
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool

class ContactsTool(private val context: Context) : SoniTool {

    override val name: String = "contactos"
    override val description: String = "Busca, crea o elimina contactos en la agenda del teléfono con confirmación de seguridad."
    override val requiredPermissions: List<String> = listOf(
        Manifest.permission.READ_CONTACTS,
        Manifest.permission.WRITE_CONTACTS,
    )
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            when {
                text.startsWith("elimina el contacto ") || text.startsWith("borra el contacto ") || text.startsWith("eliminar contacto ") -> {
                    val name = text.substringAfter("contacto").trim()
                    if (name.isNotBlank()) Action.DeleteContact(name) else null
                }
                text.startsWith("guarda el contacto ") || text.startsWith("crea el contacto ") || text.startsWith("agrega el contacto ") -> {
                    parseCreateContactQuery(text)
                }
                text.startsWith("busca el contacto ") || text.startsWith("buscar contacto ") || text.startsWith("contacto ") -> {
                    val name = text.substringAfter("contacto").trim()
                    if (name.isNotBlank()) Action.SearchContact(name) else null
                }
                else -> null
            }
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.SearchContact ||
        action is Action.CreateContact ||
        action is Action.DeleteContact

    override fun permissionsFor(action: Action): List<String> = when (action) {
        is Action.SearchContact -> listOf(Manifest.permission.READ_CONTACTS)
        is Action.CreateContact, is Action.DeleteContact -> listOf(
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.WRITE_CONTACTS,
        )
        else -> requiredPermissions
    }

    override fun riskOf(action: Action): RiskLevel = when (action) {
        is Action.DeleteContact -> RiskLevel.HIGH
        else -> RiskLevel.LOW
    }

    override fun describe(action: Action): String = when (action) {
        is Action.DeleteContact -> "eliminar el contacto «${action.name}»"
        is Action.CreateContact -> "crear el contacto «${action.name}» (${action.phone})"
        else -> super.describe(action)
    }

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.SearchContact -> searchContact(action.query)
        is Action.CreateContact -> createContact(action.name, action.phone)
        is Action.DeleteContact -> deleteContact(action.name)
        else -> ActionResult.Failed("No puedo realizar esta acción de contactos.", FailureReason.NO_TOOL)
    }

    private fun searchContact(query: String): ActionResult {
        val cr = context.contentResolver
        val uri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
        val projection = arrayOf(
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
            ContactsContract.CommonDataKinds.Phone.NUMBER,
        )

        val selection = "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} LIKE ?"
        val selectionArgs = arrayOf("%$query%")

        val matches = mutableListOf<String>()

        cr.query(uri, projection, selection, selectionArgs, null)?.use { cursor ->
            val nameIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
            val phoneIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)

            while (cursor.moveToNext()) {
                val name = if (nameIdx >= 0) cursor.getString(nameIdx) else "Contacto"
                val phone = if (phoneIdx >= 0) cursor.getString(phoneIdx) else ""
                matches += "$name ($phone)"
            }
        }

        if (matches.isEmpty()) {
            return ActionResult.Failed("No encontré ningún contacto que coincida con «$query».", FailureReason.INVALID_INPUT)
        }

        val listStr = matches.distinct().take(5).joinToString("\n• ")
        return ActionResult.Success(
            message = "Contactos encontrados:\n• $listStr",
            spokenMessage = "Encontré los datos de $query.",
            actionLabel = "Contacto encontrado",
        )
    }

    private fun createContact(name: String, phone: String): ActionResult {
        val ops = ArrayList<ContentProviderOperation>()

        ops.add(
            ContentProviderOperation.newInsert(ContactsContract.RawContacts.CONTENT_URI)
                .withValue(ContactsContract.RawContacts.ACCOUNT_TYPE, null)
                .withValue(ContactsContract.RawContacts.ACCOUNT_NAME, null)
                .build()
        )

        ops.add(
            ContentProviderOperation.newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME, name)
                .build()
        )

        ops.add(
            ContentProviderOperation.newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER, phone)
                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE, ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE)
                .build()
        )

        return try {
            context.contentResolver.applyBatch(ContactsContract.AUTHORITY, ops)
            ActionResult.Success(
                message = "Contacto «$name» guardado correctamente con el teléfono $phone.",
                spokenMessage = "Contacto $name guardado correctamente.",
                actionLabel = "Contacto creado",
            )
        } catch (e: Exception) {
            ActionResult.Failed("No se pudo guardar el contacto.", FailureReason.UNEXPECTED)
        }
    }

    private fun deleteContact(name: String): ActionResult {
        val cr = context.contentResolver
        val uri = ContactsContract.RawContacts.CONTENT_URI
        val selection = "${ContactsContract.RawContacts.DISPLAY_NAME_PRIMARY} LIKE ?"
        val selectionArgs = arrayOf("%$name%")

        return try {
            val deletedRows = cr.delete(uri, selection, selectionArgs)
            if (deletedRows > 0) {
                ActionResult.Success(
                    message = "El contacto «$name» fue eliminado de tu agenda.",
                    spokenMessage = "El contacto $name fue eliminado.",
                    actionLabel = "Contacto eliminado",
                )
            } else {
                ActionResult.Failed("No encontré ningún contacto con el nombre «$name» para eliminar.", FailureReason.INVALID_INPUT)
            }
        } catch (e: Exception) {
            ActionResult.Failed("No se pudo eliminar el contacto.", FailureReason.UNEXPECTED)
        }
    }

    private companion object {
        fun parseCreateContactQuery(text: String): Action? {
            val body = text.substringAfter("contacto").trim()
            val phoneMatch = Regex("(\\d[\\d\\s-]{6,15})").find(body)
            if (phoneMatch != null) {
                val phone = phoneMatch.value.replace(" ", "").replace("-", "")
                val name = body.replace(phoneMatch.value, "").replace(" con el numero", "").replace(" numero", "").trim()
                if (name.isNotBlank()) {
                    return Action.CreateContact(name, phone)
                }
            }
            return null
        }
    }
}
