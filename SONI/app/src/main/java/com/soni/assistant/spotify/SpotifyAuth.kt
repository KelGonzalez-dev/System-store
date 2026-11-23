package com.soni.assistant.spotify

import android.content.Context
import android.util.Log

/**
 * Sesión de Spotify con el flujo del SDK (token directo). El usuario autoriza UNA vez (una
 * pantalla de Spotify). Después, cuando el token caduca, SONI lo renueva EN SILENCIO relanzando
 * la autorización del SDK sin diálogo: como Spotify ya recuerda el permiso, devuelve un token
 * nuevo sin que el usuario tenga que hacer nada. Así, para el usuario, nunca se desconecta.
 */
object SpotifyAuth {

    const val REDIRECT_URI = "soni://callback"
    const val SCOPES = "user-read-private user-modify-playback-state user-read-playback-state streaming"

    private const val TAG = "SoniSpotifyAuth"

    private const val KEY_ACCESS = "access_token"
    private const val KEY_EXPIRES = "expires_at"
    private const val KEY_EVER = "ever_connected"

    /** Último error visible para diagnóstico en Ajustes. */
    @Volatile var lastError: String = ""
        private set

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences("soni_spotify", Context.MODE_PRIVATE)

    /** ¿Hay un token válido ahora mismo? Si no, hay que (re)autorizar (puede ser en silencio). */
    fun needsLogin(context: Context): Boolean {
        val p = prefs(context)
        val token = p.getString(KEY_ACCESS, null)
        val expiry = p.getLong(KEY_EXPIRES, 0L)
        return token.isNullOrBlank() || System.currentTimeMillis() >= expiry - 30_000
    }

    fun isLoggedIn(context: Context): Boolean = !needsLogin(context)

    /** ¿El usuario ya autorizó alguna vez? Entonces la renovación puede hacerse en silencio. */
    fun everConnected(context: Context): Boolean = prefs(context).getBoolean(KEY_EVER, false)

    /** Token válido actual, o null si caducó/no hay (hay que relanzar la autorización). Sin red. */
    fun validAccessToken(context: Context): String? {
        val p = prefs(context)
        val token = p.getString(KEY_ACCESS, null)
        val expiry = p.getLong(KEY_EXPIRES, 0L)
        return if (!token.isNullOrBlank() && System.currentTimeMillis() < expiry - 30_000) token else null
    }

    /** Guarda el token que devuelve la pantalla del SDK. expiresIn en segundos. */
    fun saveToken(context: Context, accessToken: String?, expiresInSeconds: Int) {
        if (accessToken.isNullOrBlank()) {
            lastError = "token vacío"
            Log.w(TAG, "saveToken: token vacío, no se guarda")
            return
        }
        val ok = prefs(context).edit()
            .putString(KEY_ACCESS, accessToken)
            .putLong(KEY_EXPIRES, System.currentTimeMillis() + expiresInSeconds * 1000L)
            .putBoolean(KEY_EVER, true)
            .commit()
        lastError = ""
        Log.i(TAG, "saveToken: guardado=$ok expiraEnSeg=$expiresInSeconds")
    }

    fun reportError(message: String) { lastError = message }

    /** Cierra sesión por completo (borra también el recuerdo de que autorizó). */
    fun logout(context: Context) {
        prefs(context).edit().clear().apply()
    }
}
