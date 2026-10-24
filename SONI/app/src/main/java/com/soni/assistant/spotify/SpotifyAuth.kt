package com.soni.assistant.spotify

import android.content.Context

/**
 * Guarda el token de Spotify que devuelve la pantalla de login del SDK. Cuando caduca,
 * SONI vuelve a pedir login (abriendo la pantalla oficial, sin navegador).
 */
object SpotifyAuth {

    const val REDIRECT_URI = "soni://callback"
    // Permisos: buscar y controlar reproducción.
    const val SCOPES = "user-read-private user-modify-playback-state user-read-playback-state streaming"

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences("soni_spotify", Context.MODE_PRIVATE)

    fun needsLogin(context: Context): Boolean {
        val p = prefs(context)
        val token = p.getString("access_token", null)
        val expiry = p.getLong("expires_at", 0L)
        return token.isNullOrBlank() || System.currentTimeMillis() >= expiry - 30_000
    }

    fun isLoggedIn(context: Context): Boolean = !needsLogin(context)

    /** Un token válido, o null si caducó o no hay sesión (entonces hay que volver a loguear). */
    fun validAccessToken(context: Context): String? {
        val p = prefs(context)
        val token = p.getString("access_token", null)
        val expiry = p.getLong("expires_at", 0L)
        return if (!token.isNullOrBlank() && System.currentTimeMillis() < expiry - 30_000) token else null
    }

    /** Guarda el token devuelto por la pantalla de login del SDK. expiresIn viene en segundos. */
    fun saveToken(context: Context, accessToken: String?, expiresInSeconds: Int) {
        if (accessToken.isNullOrBlank()) {
            android.util.Log.w("SoniSpotifyAuth", "saveToken: token vacío, no se guarda")
            return
        }
        val ok = prefs(context).edit()
            .putString("access_token", accessToken)
            .putLong("expires_at", System.currentTimeMillis() + expiresInSeconds * 1000L)
            .commit()   // commit (no apply) para guardar YA, antes de que vuelvan a preguntar
        android.util.Log.i("SoniSpotifyAuth", "saveToken: guardado=$ok expiraEnSeg=$expiresInSeconds")
    }

    fun logout(context: Context) {
        prefs(context).edit().clear().apply()
    }
}
