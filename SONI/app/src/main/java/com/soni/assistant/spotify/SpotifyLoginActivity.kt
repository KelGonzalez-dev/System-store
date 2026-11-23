package com.soni.assistant.spotify

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.soni.assistant.BuildConfig
import com.spotify.sdk.android.auth.AuthorizationClient
import com.spotify.sdk.android.auth.AuthorizationRequest
import com.spotify.sdk.android.auth.AuthorizationResponse

/**
 * Autorización de Spotify con la pantalla oficial del SDK (sin navegador). La primera vez muestra
 * la pantalla de permiso; luego, con [silent], renueva el token sin diálogo (Spotify ya recuerda
 * el permiso), de forma casi invisible.
 */
class SpotifyLoginActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (savedInstanceState == null) startLogin()
    }

    private fun startLogin() {
        val silent = intent?.getBooleanExtra(EXTRA_SILENT, false) ?: false
        val request = AuthorizationRequest.Builder(
            BuildConfig.SPOTIFY_CLIENT_ID,
            AuthorizationResponse.Type.TOKEN,
            SpotifyAuth.REDIRECT_URI,
        )
            .setScopes(SpotifyAuth.SCOPES.split(" ").toTypedArray())
            .setShowDialog(false) // si ya autorizó, no muestra nada y devuelve token al instante
            .build()
        AuthorizationClient.openLoginActivity(this, REQUEST_CODE, request)
        this.silent = silent
    }

    private var silent = false

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_CODE) {
            val response = AuthorizationClient.getResponse(resultCode, data)
            Log.i(TAG, "tipo=${response.type} tokenVacio=${response.accessToken.isNullOrBlank()} expira=${response.expiresIn} error=${response.error}")
            when (response.type) {
                AuthorizationResponse.Type.TOKEN -> {
                    SpotifyAuth.saveToken(applicationContext, response.accessToken, response.expiresIn)
                    if (!silent) toast("Spotify conectado")
                }
                else -> {
                    SpotifyAuth.reportError(response.error ?: response.type.toString())
                    if (!silent) toast("Spotify no conectó: ${response.error ?: response.type}")
                }
            }
        }
        finish()
    }

    override fun finish() {
        super.finish()
        if (silent) overridePendingTransition(0, 0) // sin animación para que la renovación no se vea
    }

    private fun toast(msg: String) {
        Toast.makeText(applicationContext, msg, Toast.LENGTH_LONG).show()
    }

    companion object {
        private const val TAG = "SoniSpotifyLogin"
        private const val REQUEST_CODE = 4829
        private const val EXTRA_SILENT = "silent"

        /** Autorización normal (primera vez), con pantalla de Spotify si hace falta. */
        fun start(context: Context) {
            context.startActivity(
                Intent(context, SpotifyLoginActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }

        /** Renovación silenciosa del token (sin molestar), cuando ya se autorizó antes. */
        fun refreshSilently(context: Context) {
            context.startActivity(
                Intent(context, SpotifyLoginActivity::class.java)
                    .putExtra(EXTRA_SILENT, true)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }
    }
}
