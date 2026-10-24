package com.soni.assistant.data.memory

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class Reminder(val id: Int, val text: String, val atMillis: Long)

/** Recordatorios pendientes (para reprogramarlos al reiniciar el teléfono y poder listarlos). */
class ReminderStore private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_reminders", Context.MODE_PRIVATE)

    @Synchronized
    fun all(): List<Reminder> = runCatching {
        val array = JSONArray(prefs.getString(KEY, "[]"))
        List(array.length()) { i ->
            val o = array.getJSONObject(i)
            Reminder(o.getInt("id"), o.getString("text"), o.getLong("at"))
        }
    }.getOrDefault(emptyList()).sortedBy { it.atMillis }

    /** Pendientes (los vencidos hace más de un minuto se descartan). */
    fun pending(now: Long = System.currentTimeMillis()): List<Reminder> = all().filter { it.atMillis > now - 60_000 }

    @Synchronized
    fun add(text: String, atMillis: Long): Reminder {
        val id = ((System.currentTimeMillis() / 1000) % Int.MAX_VALUE).toInt()
        val reminder = Reminder(id, text.trim(), atMillis)
        save(pending() + reminder)
        return reminder
    }

    @Synchronized
    fun remove(id: Int) = save(all().filterNot { it.id == id })

    @Synchronized
    fun clear() = save(emptyList())

    private fun save(list: List<Reminder>) {
        val array = JSONArray()
        list.forEach { array.put(JSONObject().put("id", it.id).put("text", it.text).put("at", it.atMillis)) }
        prefs.edit().putString(KEY, array.toString()).apply()
    }

    companion object {
        private const val KEY = "reminders"

        @Volatile
        private var instance: ReminderStore? = null

        fun get(context: Context): ReminderStore =
            instance ?: synchronized(this) { instance ?: ReminderStore(context).also { instance = it } }
    }
}
