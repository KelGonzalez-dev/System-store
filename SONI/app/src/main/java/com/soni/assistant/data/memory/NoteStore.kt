package com.soni.assistant.data.memory

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class Note(val id: Long, val text: String, val createdAt: Long)

/** Notas de voz guardadas solo en el teléfono. */
class NoteStore private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_notes", Context.MODE_PRIVATE)

    @Synchronized
    fun all(): List<Note> = runCatching {
        val array = JSONArray(prefs.getString(KEY, "[]"))
        List(array.length()) { i ->
            val o = array.getJSONObject(i)
            Note(o.getLong("id"), o.getString("text"), o.getLong("at"))
        }
    }.getOrDefault(emptyList())

    @Synchronized
    fun add(text: String): Note {
        val note = Note(System.currentTimeMillis(), text.trim(), System.currentTimeMillis())
        save(all() + note)
        return note
    }

    /** Borra las notas que contienen [query] (sin importar tildes ni mayúsculas), o todas. Devuelve cuántas borró. */
    @Synchronized
    fun delete(query: String?): Int {
        val notes = all()
        val keep = if (query.isNullOrBlank()) emptyList() else {
            val q = MemoryText.plain(query)
            notes.filterNot { MemoryText.plain(it.text).contains(q) }
        }
        save(keep)
        return notes.size - keep.size
    }

    private fun save(list: List<Note>) {
        val array = JSONArray()
        list.forEach { array.put(JSONObject().put("id", it.id).put("text", it.text).put("at", it.createdAt)) }
        prefs.edit().putString(KEY, array.toString()).apply()
    }

    companion object {
        private const val KEY = "notes"

        @Volatile
        private var instance: NoteStore? = null

        fun get(context: Context): NoteStore =
            instance ?: synchronized(this) { instance ?: NoteStore(context).also { instance = it } }
    }
}
