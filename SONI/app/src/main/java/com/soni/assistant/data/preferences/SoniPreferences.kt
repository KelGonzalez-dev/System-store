package com.soni.assistant.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.soniDataStore: DataStore<Preferences> by preferencesDataStore(name = "soni_preferences")

/** Preferencias no sensibles de SONI. Nunca guardar aquí contraseñas ni tokens. */
class SoniPreferences(context: Context) {

    private val dataStore = context.applicationContext.soniDataStore

    /** El usuario quiere que SONI espere la palabra «SONI» en segundo plano. */
    val backgroundListening: Flow<Boolean> =
        dataStore.data.map { it[BACKGROUND_LISTENING] ?: false }

    suspend fun isBackgroundListeningEnabled(): Boolean = backgroundListening.first()

    suspend fun setBackgroundListening(enabled: Boolean) {
        dataStore.edit { it[BACKGROUND_LISTENING] = enabled }
    }

    private companion object {
        val BACKGROUND_LISTENING = booleanPreferencesKey("background_listening")
    }
}
