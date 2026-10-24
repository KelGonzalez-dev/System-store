package com.soni.assistant.spotify

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.soni.assistant.BuildConfig
import com.spotify.sdk.android.auth.AuthorizationClient
import com.spotify.sdk.android.auth.AuthorizationRequest
import com.spotify.sdk.android.auth.AuthorizationResponse

/**
 * Login de Spotify con la pantalla oficial del SDK (spotify-auth). No usa el navegador:
 * abre la propia app de Spotify y devuelve el resultado directo a la app. Guarda el token.
 */
class SpotifyLoginActivity : Activity() {

    private var launched = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        startLogin()
    }

    private fun startLogin() {
        launched = true
        val request = AuthorizationRequest.Builder(
            BuildConfig.SPOTIFY_CLIENT_ID,
            AuthorizationResponse.Type.TOKEN,
            SpotifyAuth.REDIRECT_URI,
        )
            .setScopes(SpotifyAuth.SCOPES.split(" ").toTypedArray())
            .setShowDialog(false)
            .build()
        AuthorizationClient.openLoginActivity(this, REQUEST_CODE, request)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        Log.i(TAG, "onActivityResult req=$requestCode result=$resultCode")
        if (requestCode == REQUEST_CODE) {
            val response = AuthorizationClient.getResponse(resultCode, data)
            Log.i(TAG, "respuesta tipo=${response.type} tokenVacio=${response.accessToken.isNullOrBlank()} expira=${response.expiresIn} error=${response.error}")
            when (response.type) {
                AuthorizationResponse.Type.TOKEN -> {
                    SpotifyAuth.saveToken(applicationContext, response.accessToken, response.expiresIn)
                    Log.i(TAG, "token guardado, needsLogin ahora=${SpotifyAuth.needsLogin(applicationContext)}")
                }
                else -> Log.w(TAG, "login no dio token: ${response.type} / ${response.error}")
            }
        }
        finish()
    }

    companion object {
        private const val TAG = "SoniSpotifyLogin"
        private const val REQUEST_CODE = 4829
        fun start(context: Context) {
            context.startActivity(
                Intent(context, SpotifyLoginActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }
    }
}
