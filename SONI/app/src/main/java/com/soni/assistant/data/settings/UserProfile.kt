package com.soni.assistant.data.settings

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Lo que SONI sabe de ti para tratarte mejor. Todo opcional y guardado solo en el teléfono.
 * Estos datos se le pasan a la IA como contexto, así que puede saludarte por tu nombre,
 * tener en cuenta tus gustos y recordar lo que le pediste que no olvide.
 */
data class ProfileData(
    val nickname: String = "",       // cómo quieres que te llame
    val age: String = "",
    val occupation: String = "",     // a qué te dedicas
    val city: String = "",
    val likes: String = "",          // gustos, aficiones
    val dislikes: String = "",       // lo que no te gusta
    val health: String = "",         // algo de salud que SONI deba tener en cuenta (alergias, etc.)
    val notes: String = "",          // cualquier cosa que SONI deba recordar siempre
)

class UserProfile private constructor(context: Context) {

    private val prefs = context.applicationContext.getSharedPreferences("soni_profile", Context.MODE_PRIVATE)
    private val _state = MutableStateFlow(load())
    val state: StateFlow<ProfileData> = _state.asStateFlow()
    val current: ProfileData get() = _state.value

    fun update(transform: (ProfileData) -> ProfileData) {
        val d = transform(_state.value)
        prefs.edit()
            .putString("nickname", d.nickname).putString("age", d.age)
            .putString("occupation", d.occupation).putString("city", d.city)
            .putString("likes", d.likes).putString("dislikes", d.dislikes)
            .putString("health", d.health).putString("notes", d.notes)
            .apply()
        _state.value = d
    }

    /** Resumen para darle a la IA como contexto. Vacío si no hay nada. */
    fun promptSummary(): String {
        val d = _state.value
        val parts = buildList {
            if (d.nickname.isNotBlank()) add("Llámalo ${d.nickname}")
            if (d.age.isNotBlank()) add("tiene ${d.age} años")
            if (d.occupation.isNotBlank()) add("se dedica a ${d.occupation}")
            if (d.city.isNotBlank()) add("vive en ${d.city}")
            if (d.likes.isNotBlank()) add("le gusta: ${d.likes}")
            if (d.dislikes.isNotBlank()) add("no le gusta: ${d.dislikes}")
            if (d.health.isNotBlank()) add("salud a tener en cuenta: ${d.health}")
            if (d.notes.isNotBlank()) add("recuerda siempre: ${d.notes}")
        }
        return if (parts.isEmpty()) "" else "Sobre el usuario: ${parts.joinToString("; ")}."
    }

    private fun load() = ProfileData(
        nickname = prefs.getString("nickname", "") ?: "",
        age = prefs.getString("age", "") ?: "",
        occupation = prefs.getString("occupation", "") ?: "",
        city = prefs.getString("city", "") ?: "",
        likes = prefs.getString("likes", "") ?: "",
        dislikes = prefs.getString("dislikes", "") ?: "",
        health = prefs.getString("health", "") ?: "",
        notes = prefs.getString("notes", "") ?: "",
    )

    companion object {
        @Volatile private var instance: UserProfile? = null
        fun get(context: Context): UserProfile =
            instance ?: synchronized(this) { instance ?: UserProfile(context).also { instance = it } }
    }
}
