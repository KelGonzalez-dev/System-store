package com.soni.assistant.data.contacts

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray
import org.json.JSONObject
import java.text.Normalizer

/** Un contacto al que el usuario le asignó un rol: «Mamá», «Mi jefa», «Hermano»… */
data class ContactRole(
    /** Rol tal como lo escribió el usuario, para mostrarlo: «Mamá». */
    val role: String,
    /** Nombre del contacto en la agenda: «Madre ❤️». */
    val contactName: String,
    /** Número tal como está en la agenda. */
    val phone: String,
)

/**
 * Guarda los roles en el teléfono (SharedPreferences, sin internet).
 * Es síncrono a propósito: las herramientas lo leen al instante al resolver «llama a mi mamá».
 */
class ContactRoleStore private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_contact_roles", Context.MODE_PRIVATE)
    private val _roles = MutableStateFlow(load())
    val roles: StateFlow<List<ContactRole>> = _roles.asStateFlow()

    /** Asigna (o reemplaza) el contacto de un rol. */
    fun assign(role: String, contactName: String, phone: String) {
        val key = canonicalRole(role)
        val updated = _roles.value.filterNot { canonicalRole(it.role) == key } +
            ContactRole(role.trim().replaceFirstChar { it.uppercase() }, contactName, phone)
        save(updated.sortedBy { it.role })
    }

    fun remove(role: String) {
        val key = canonicalRole(role)
        save(_roles.value.filterNot { canonicalRole(it.role) == key })
    }

    /** «mi mamá», «a mi madre», «mami» → el contacto con rol Mamá, si existe. */
    fun find(spoken: String): ContactRole? {
        val key = canonicalRole(spoken)
        if (key.isBlank()) return null
        return _roles.value.firstOrNull { canonicalRole(it.role) == key }
    }

    private fun load(): List<ContactRole> = runCatching {
        val array = JSONArray(prefs.getString(KEY, "[]"))
        List(array.length()) { i ->
            val o = array.getJSONObject(i)
            ContactRole(o.getString("role"), o.getString("name"), o.getString("phone"))
        }
    }.getOrDefault(emptyList())

    private fun save(list: List<ContactRole>) {
        val array = JSONArray()
        list.forEach { array.put(JSONObject().put("role", it.role).put("name", it.contactName).put("phone", it.phone)) }
        prefs.edit().putString(KEY, array.toString()).apply()
        _roles.value = list
    }

    companion object {
        private const val KEY = "roles"

        @Volatile
        private var instance: ContactRoleStore? = null

        fun get(context: Context): ContactRoleStore =
            instance ?: synchronized(this) { instance ?: ContactRoleStore(context).also { instance = it } }

        /** Palabras que significan lo mismo; la primera es la forma canónica. */
        private val ROLE_SYNONYMS: List<List<String>> = listOf(
            listOf("mama", "mami", "madre", "mamita", "ma", "mom", "mother", "jefa de la casa"),
            listOf("papa", "papi", "padre", "papito", "pa", "dad", "father"),
            listOf("abuela", "abue", "abuelita", "nona"),
            listOf("abuelo", "abuelito", "nono"),
            listOf("hermano", "hermanito", "brother", "bro"),
            listOf("hermana", "hermanita", "sister"),
            listOf("esposa", "mujer", "senora", "wife"),
            listOf("esposo", "marido", "husband"),
            listOf("novia", "girlfriend", "amor"),
            listOf("novio", "boyfriend"),
            listOf("jefe", "patron", "boss"),
            listOf("jefa", "patrona"),
            listOf("hijo", "hijito"),
            listOf("hija", "hijita"),
            listOf("tio"), listOf("tia"),
            listOf("mejor amigo", "parcero", "parce", "compa"),
            listOf("mejor amiga", "parcera"),
        )

        private val PREFIX = Regex("^(?:(?:a|al|para|con)\\s+)?(?:(?:mi|mis|el|la|los|las)\\s+)?")

        /** Minúsculas, sin tildes, sin emojis ni signos: «Mamá ❤️» → «mama». */
        fun plain(text: String): String =
            Normalizer.normalize(text.lowercase(), Normalizer.Form.NFD)
                .replace(Regex("\\p{Mn}+"), "")
                .replace(Regex("[^a-z0-9ñ ]"), " ")
                .replace(Regex("\\s+"), " ")
                .trim()

        /** Forma canónica de un rol: «a mi mami» → «mama». */
        fun canonicalRole(text: String): String {
            val base = plain(text).replace(PREFIX, "").trim()
            return ROLE_SYNONYMS.firstOrNull { base in it }?.first() ?: base
        }

        /** Todas las palabras equivalentes a un rol (para buscar en la agenda): «mama» → mama, mami, madre… */
        fun synonymsOf(text: String): List<String> {
            val key = canonicalRole(text)
            return ROLE_SYNONYMS.firstOrNull { it.first() == key } ?: listOf(key)
        }

        /** Roles sugeridos en la pantalla de asignación. */
        val SUGGESTED_ROLES = listOf("Mamá", "Papá", "Jefa", "Jefe", "Hermano", "Hermana", "Novia", "Esposa", "Mejor amigo")
    }
}
