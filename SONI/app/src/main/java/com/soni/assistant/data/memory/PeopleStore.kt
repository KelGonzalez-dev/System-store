package com.soni.assistant.data.memory

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.text.Normalizer
import java.time.LocalDate

/** Una persona que SONI conoció: «Laura, nació el 3 de mayo de 1999, Tauro, es la novia del jefe». */
data class Person(
    val name: String,
    val birthDate: LocalDate?,
    val sign: String?,
    /** Qué es para el usuario: «mi novia», «amigo del trabajo». */
    val relation: String?,
    val metAt: Long,
)

/** Personas conocidas, guardadas solo en el teléfono. */
class PeopleStore private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_people", Context.MODE_PRIVATE)

    @Synchronized
    fun all(): List<Person> = runCatching {
        val array = JSONArray(prefs.getString(KEY, "[]"))
        List(array.length()) { i ->
            val o = array.getJSONObject(i)
            Person(
                name = o.getString("name"),
                birthDate = o.optString("birth").takeIf { it.isNotBlank() }?.let { LocalDate.parse(it) },
                sign = o.optString("sign").takeIf { it.isNotBlank() },
                relation = o.optString("relation").takeIf { it.isNotBlank() },
                metAt = o.optLong("met", 0L),
            )
        }
    }.getOrDefault(emptyList())

    /** Guarda o actualiza (por nombre). */
    @Synchronized
    fun save(person: Person) {
        val key = MemoryText.plain(person.name)
        val list = all().filterNot { MemoryText.plain(it.name) == key } + person
        val array = JSONArray()
        list.forEach {
            array.put(
                JSONObject()
                    .put("name", it.name)
                    .put("birth", it.birthDate?.toString() ?: "")
                    .put("sign", it.sign ?: "")
                    .put("relation", it.relation ?: "")
                    .put("met", it.metAt)
            )
        }
        prefs.edit().putString(KEY, array.toString()).apply()
    }

    /** Busca por nombre completo o por el primer nombre: «laura» encuentra «Laura Gómez». */
    fun find(name: String): Person? {
        val q = MemoryText.plain(name)
        if (q.isBlank()) return null
        val people = all()
        return people.firstOrNull { MemoryText.plain(it.name) == q }
            ?: people.firstOrNull { MemoryText.plain(it.name).split(" ").firstOrNull() == q.split(" ").first() }
    }

    companion object {
        private const val KEY = "people"

        @Volatile
        private var instance: PeopleStore? = null

        fun get(context: Context): PeopleStore =
            instance ?: synchronized(this) { instance ?: PeopleStore(context).also { instance = it } }
    }
}

/** Texto comparable: minúsculas, sin tildes ni signos. */
object MemoryText {
    fun plain(text: String): String =
        Normalizer.normalize(text.lowercase(), Normalizer.Form.NFD)
            .replace(Regex("\\p{Mn}+"), "")
            .replace(Regex("[^a-z0-9 ]"), " ")
            .replace(Regex("\\s+"), " ")
            .trim()
}
