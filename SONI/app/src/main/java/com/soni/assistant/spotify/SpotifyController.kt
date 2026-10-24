package com.soni.assistant.spotify

import android.content.Context
import com.soni.assistant.BuildConfig
import com.spotify.android.appremote.api.ConnectionParams
import com.spotify.android.appremote.api.Connector
import com.spotify.android.appremote.api.SpotifyAppRemote
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.coroutines.resume

/**
 * Reproduce en Spotify con el SDK oficial (App Remote): pone la canción exacta por debajo,
 * sin que tengas que tocar nada. Requiere Spotify instalado, sesión iniciada y, para control
 * de reproducción, cuenta Premium.
 */
object SpotifyController {

    private const val REDIRECT_URI = "soni://callback"
    private var remote: SpotifyAppRemote? = null

    val isConfigured: Boolean get() = BuildConfig.SPOTIFY_CLIENT_ID.isNotBlank()

    /** Conecta con Spotify (lo abre en segundo plano si hace falta). Devuelve true si conectó. */
    private suspend fun connect(context: Context): Boolean {
        remote?.let { if (it.isConnected) return true }
        if (!isConfigured) return false

        val params = ConnectionParams.Builder(BuildConfig.SPOTIFY_CLIENT_ID)
            .setRedirectUri(REDIRECT_URI)
            .showAuthView(true) // la primera vez pide permiso; luego ya no
            .build()

        // Límite propio de 12s: si Spotify no conecta, falla rápido en vez de colgarse.
        return withTimeoutOrNull(12_000) {
            suspendCancellableCoroutine { cont ->
                SpotifyAppRemote.connect(context.applicationContext, params, object : Connector.ConnectionListener {
                    override fun onConnected(appRemote: SpotifyAppRemote) {
                        remote = appRemote
                        if (cont.isActive) cont.resume(true)
                    }

                    override fun onFailure(error: Throwable) {
                        remote = null
                        if (cont.isActive) cont.resume(false)
                    }
                })
            }
        } ?: false
    }

    /** Resultado de intentar reproducir. */
    sealed interface PlayResult {
        data object Ok : PlayResult
        data object NotInstalled : PlayResult       // falta la app de Spotify
        data object NotConnected : PlayResult        // no se pudo conectar (sesión, red…)
        data class Error(val message: String) : PlayResult
    }

    /**
     * Busca [query] y reproduce el primer resultado por debajo.
     * El SDK no busca por texto, así que la búsqueda se hace con la Web API (otra clase) o,
     * si ya tenemos un URI de pista, se reproduce directo. Aquí recibimos un [spotifyUri] ya resuelto.
     */
    suspend fun playUri(context: Context, spotifyUri: String): PlayResult {
        if (!SpotifyInstalled.isInstalled(context)) return PlayResult.NotInstalled
        if (!connect(context)) return PlayResult.NotConnected
        return try {
            remote?.playerApi?.play(spotifyUri)
            PlayResult.Ok
        } catch (e: Exception) {
            PlayResult.Error(e.message ?: "error de reproducción")
        }
    }

    /** Pausa, reanuda, siguiente o anterior por el SDK. Devuelve true si Spotify estaba conectado
     *  (o se conectó) y recibió la orden; false si no, para que el llamador use otro método. */
    suspend fun pause(context: Context): Boolean = control(context) { it.playerApi.pause() }
    suspend fun resume(context: Context): Boolean = control(context) { it.playerApi.resume() }
    suspend fun next(context: Context): Boolean = control(context) { it.playerApi.skipNext() }
    suspend fun previous(context: Context): Boolean = control(context) { it.playerApi.skipPrevious() }

    private suspend fun control(context: Context, block: (SpotifyAppRemote) -> Unit): Boolean {
        if (!SpotifyInstalled.isInstalled(context)) return false
        if (!connect(context)) return false
        return try {
            remote?.let { block(it); true } ?: false
        } catch (e: Exception) {
            false
        }
    }

    fun disconnect() {
        remote?.let { SpotifyAppRemote.disconnect(it) }
        remote = null
    }
}

/** Comprueba si Spotify está instalado, sin depender del SDK. */
object SpotifyInstalled {
    fun isInstalled(context: Context): Boolean =
        context.packageManager.getLaunchIntentForPackage("com.spotify.music") != null
}
