package com.soni.assistant.tools

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.provider.ContactsContract
import android.telephony.PhoneNumberUtils
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat
import com.soni.assistant.data.contacts.ContactRoleStore
import java.util.Locale

/** Contacto encontrado, listo para llamar o escribir. */
data class ResolvedContact(
    val name: String,
    /** Número tal como está en la agenda. */
    val phone: String,
    /** Número internacional sin «+» ni espacios (lo que pide WhatsApp): 573001234567. */
    val internationalDigits: String,
    /** true si salió de un rol asignado por el usuario. */
    val fromRole: Boolean,
)

/**
 * Encuentra a quién se refiere el usuario, en este orden:
 * 1. Un número dicho directamente.
 * 2. Un rol asignado en la app («mi mamá», «mi jefa»).
 * 3. La agenda: nombre exacto, nombre que lo contiene o, para roles familiares,
 *    contactos guardados como «Madre ❤️», «Mami 🥰»… (se ignoran emojis y tildes).
 */
class ContactResolver(private val context: Context) {

    private val roles by lazy { ContactRoleStore.get(context) }

    fun resolve(spoken: String): ResolvedContact? {
        val digits = spoken.replace(Regex("[\\s-]"), "")
        if (digits.matches(Regex("^\\+?[0-9]{7,15}$"))) {
            return ResolvedContact(spoken.trim(), digits, international(digits), fromRole = false)
        }

        roles.find(spoken)?.let {
            return ResolvedContact(it.contactName, it.phone, international(it.phone), fromRole = true)
        }

        return searchAgenda(spoken)
    }

    private fun searchAgenda(spoken: String): ResolvedContact? {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) !=
            PackageManager.PERMISSION_GRANTED
        ) return null

        val wanted = ContactRoleStore.canonicalRole(spoken)
        if (wanted.isBlank()) return null
        val synonyms = ContactRoleStore.synonymsOf(spoken)

        data class Entry(val name: String, val plain: String, val phone: String)

        val entries = mutableListOf<Entry>()
        context.contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            arrayOf(
                ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                ContactsContract.CommonDataKinds.Phone.NUMBER,
            ),
            null, null, null,
        )?.use { cursor ->
            val nameIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
            val numIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
            while (cursor.moveToNext()) {
                val name = cursor.getString(nameIdx) ?: continue
                val phone = cursor.getString(numIdx) ?: continue
                entries += Entry(name, ContactRoleStore.plain(name), phone)
            }
        }
        if (entries.isEmpty()) return null

        fun words(s: String) = s.split(" ").filter { it.isNotBlank() }

        val best = entries.firstOrNull { it.plain == wanted }
            ?: entries.firstOrNull { e -> synonyms.any { syn -> e.plain == syn } }
            // Nombre que contiene la palabra completa: «mama» en «mama bella», «madre» en «madre ❤️».
            ?: entries.firstOrNull { e -> synonyms.any { syn -> syn in words(e.plain) || (" " in syn && syn in e.plain) } }
            // Nombres de persona: «juan» → «Juan Pérez».
            ?: entries.firstOrNull { e -> words(wanted).all { w -> words(e.plain).any { it.startsWith(w) } } }
            ?: return null

        return ResolvedContact(best.name, best.phone, international(best.phone), fromRole = false)
    }

    /** Convierte a formato internacional usando el país de la SIM («300 123 4567» → «573001234567»). */
    private fun international(phone: String): String {
        val tm = context.getSystemService(TelephonyManager::class.java)
        val country = (tm?.simCountryIso?.takeIf { it.isNotBlank() }
            ?: tm?.networkCountryIso?.takeIf { it.isNotBlank() }
            ?: Locale.getDefault().country).uppercase(Locale.ROOT)
        val e164 = PhoneNumberUtils.formatNumberToE164(phone, country)
        return (e164 ?: phone).replace(Regex("[^0-9]"), "")
    }
}
