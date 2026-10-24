package com.soni.assistant.tools

import android.app.SearchManager
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.media.session.MediaSessionManager
import android.net.Uri
import android.provider.MediaStore
import android.view.KeyEvent
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.spotify.SpotifyAuth
import com.soni.assistant.spotify.SpotifyController
import com.soni.assistant.spotify.SpotifyLoginActivity
import com.soni.assistant.spotify.SpotifySearch
import com.soni.assistant.notifications.SoniNotificationListener

class MediaControlTool(private val context: Context) : SoniTool {

    override val name: String = "musica_y_multimedia"
    override val description: String = "Controla la reproducción de música (reproducir, pausar, siguiente, anterior) y busca canciones en Spotify o reproductores."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            // Primero «reproduce/pon/escucha + algo concreto»; si no, los controles simples.
            parseSearchMusicQuery(text) ?: when {
                PLAY_PATTERNS.any { it.containsMatchIn(text) } -> Action.MediaPlay
                PAUSE_PATTERNS.any { it.containsMatchIn(text) } -> Action.MediaPause
                NEXT_PATTERNS.any { it.containsMatchIn(text) } -> Action.MediaNext
                PREV_PATTERNS.any { it.containsMatchIn(text) } -> Action.MediaPrevious
                NOW_PLAYING_PATTERNS.any { it.containsMatchIn(text) } -> Action.MediaNowPlaying
                else -> null
            }
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.MediaPlay ||
        action is Action.MediaPause ||
        action is Action.MediaNext ||
        action is Action.MediaPrevious ||
        action is Action.MediaNowPlaying ||
        action is Action.SearchMusic

    override suspend fun execute(action: Action): ActionResult = when (action) {
        Action.MediaPlay -> sendMediaKey(KeyEvent.KEYCODE_MEDIA_PLAY, "Reproduciendo música", "Reproducción iniciada")
        Action.MediaPause -> sendMediaKey(KeyEvent.KEYCODE_MEDIA_PAUSE, "Música pausada", "Reproducción pausada")
        Action.MediaNext -> sendMediaKey(KeyEvent.KEYCODE_MEDIA_NEXT, "Siguiente canción", "Siguiente pista")
        Action.MediaPrevious -> sendMediaKey(KeyEvent.KEYCODE_MEDIA_PREVIOUS, "Canción anterior", "Pista anterior")
        Action.MediaNowPlaying -> getNowPlayingInfo()
        is Action.SearchMusic -> searchAndPlayMusic(action.query)
        else -> ActionResult.Failed("No puedo realizar esta acción multimedia.", FailureReason.NO_TOOL)
    }

    private suspend fun sendMediaKey(keyCode: Int, messageText: String, actionLabelText: String): ActionResult {
        // 0. Si Spotify está sonando y conectado por el SDK, controlarlo por el SDK (lo más fiable
        //    cuando SONI reprodujo por debajo; los otros métodos a veces no le llegan).
        val spotifyPlaying = SoniNotificationListener.activePlayer(context)
            ?.let { it.packageName == SPOTIFY } == true
        if (spotifyPlaying && SpotifyController.isConfigured && !SpotifyAuth.needsLogin(context)) {
            val done = when (keyCode) {
                KeyEvent.KEYCODE_MEDIA_PAUSE -> SpotifyController.pause(context)
                KeyEvent.KEYCODE_MEDIA_PLAY -> SpotifyController.resume(context)
                KeyEvent.KEYCODE_MEDIA_NEXT -> SpotifyController.next(context)
                KeyEvent.KEYCODE_MEDIA_PREVIOUS -> SpotifyController.previous(context)
                else -> false
            }
            if (done) return ActionResult.Success(message = messageText, actionLabel = actionLabelText)
            // Si el SDK no pudo, sigue a los métodos de abajo.
        }

        // 1. Con acceso a notificaciones: orden directa al reproductor que suena (lo más fiable).
        val player = SoniNotificationListener.activePlayer(context)
        if (player != null) {
            val controls = player.transportControls
            when (keyCode) {
                KeyEvent.KEYCODE_MEDIA_NEXT -> controls.skipToNext()
                KeyEvent.KEYCODE_MEDIA_PREVIOUS -> controls.skipToPrevious()
                KeyEvent.KEYCODE_MEDIA_PAUSE -> controls.pause()
                KeyEvent.KEYCODE_MEDIA_PLAY -> controls.play()
                else -> controls.play()
            }
            return ActionResult.Success(message = messageText, actionLabel = actionLabelText)
        }

        // 2. Sin acceso: tecla multimedia del sistema (como los botones de unos audífonos).
        val am = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
            ?: return ActionResult.Failed("No se puede acceder al servicio de audio.", FailureReason.UNEXPECTED)
        am.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, keyCode))
        am.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_UP, keyCode))

        val hint = if (SoniNotificationListener.isEnabled(context)) "" else
            " Si no cambió, activa el «Acceso a notificaciones» de SONI en Ajustes de SONI (icono de engranaje)."
        return ActionResult.Success(
            message = messageText + "." + hint,
            spokenMessage = messageText,
            actionLabel = actionLabelText,
        )
    }

    private fun getNowPlayingInfo(): ActionResult {
        val metadata = SoniNotificationListener.activePlayer(context)?.metadata
        val title = metadata?.getString(android.media.MediaMetadata.METADATA_KEY_TITLE)
        val artist = metadata?.getString(android.media.MediaMetadata.METADATA_KEY_ARTIST)
        if (!title.isNullOrBlank()) {
            val msg = "Está sonando «$title»" + if (!artist.isNullOrBlank()) " de $artist." else "."
            return ActionResult.Success(message = msg, actionLabel = "Canción actual")
        }
        return ActionResult.Failed(
            message = if (SoniNotificationListener.isEnabled(context)) "No está sonando nada ahora mismo."
            else "Para saber qué suena, activa el «Acceso a notificaciones» de SONI en Ajustes de SONI.",
            reason = FailureReason.UNEXPECTED,
            actionLabel = "Canción actual",
        )
    }

    private suspend fun searchAndPlayMusic(query: String): ActionResult {
        fun playFromSearch(pkg: String?) = Intent(MediaStore.INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH).apply {
            putExtra(MediaStore.EXTRA_MEDIA_FOCUS, "vnd.android.cursor.item/*")
            putExtra(SearchManager.QUERY, query)
            if (pkg != null) setPackage(pkg)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        // 1. Spotify con el SDK oficial: reproduce la canción exacta por debajo.
        if (isInstalled(SPOTIFY) && SpotifyController.isConfigured) {
            if (SpotifyAuth.needsLogin(context)) {
                SpotifyLoginActivity.start(context)
                return ActionResult.Success(
                    message = "Para poner música con Spotify, autoriza a SONI una vez (se abrió la pantalla de Spotify). " +
                        "Luego vuelve a pedírmelo.",
                    spokenMessage = "Autorízame en Spotify una vez y vuelve a pedírmelo",
                    actionLabel = "Conectar Spotify",
                )
            }
            val uri = SpotifySearch.firstTrackUri(context, query)
            if (uri != null) {
                when (val result = SpotifyController.playUri(context, uri)) {
                    SpotifyController.PlayResult.Ok -> return ActionResult.Success(
                        message = "Reproduciendo «$query» en Spotify.",
                        spokenMessage = "Poniendo $query",
                        actionLabel = "Música en Spotify",
                    )
                    SpotifyController.PlayResult.NotConnected -> {
                        // La sesión pudo expirar: se pide iniciar de nuevo.
                        SpotifyLoginActivity.start(context)
                        return ActionResult.Success(
                            message = "Necesito reconectar con Spotify. Autoriza de nuevo y repite la orden.",
                            spokenMessage = "Reconéctame con Spotify, por favor",
                            actionLabel = "Conectar Spotify",
                        )
                    }
                    else -> { /* cae al método de respaldo de abajo */ }
                }
            }
        }

        // 2. Respaldo si el SDK no está disponible: abrir la búsqueda en Spotify.
        if (isInstalled(SPOTIFY)) {
            val launched = tryStart(playFromSearch(SPOTIFY)) ||
                tryStart(
                    Intent(Intent.ACTION_VIEW, Uri.parse("spotify:search:" + Uri.encode(query)))
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                )
            if (launched) {
                return ActionResult.Success(
                    message = "Busqué «$query» en Spotify. Toca el primer resultado para reproducir.",
                    spokenMessage = "Te lo busqué en Spotify",
                    actionLabel = "Búsqueda en Spotify",
                )
            }
        }

        // 2. Cualquier otro reproductor que acepte búsquedas.
        if (tryStart(playFromSearch(null))) {
            return ActionResult.Success(
                message = "Pedí al reproductor de música que ponga «$query».",
                spokenMessage = "Poniendo $query",
                actionLabel = "Búsqueda musical",
            )
        }

        // 3. Último recurso: YouTube.
        val youtube = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("https://www.youtube.com/results?search_query=" + Uri.encode(query)),
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        return if (tryStart(youtube)) {
            ActionResult.Success(
                message = "No encontré un reproductor compatible; busqué «$query» en YouTube.",
                spokenMessage = "Lo busqué en YouTube",
                actionLabel = "Búsqueda en YouTube",
            )
        } else {
            ActionResult.Failed("No se encontró una aplicación de música para realizar la búsqueda.", FailureReason.NO_TOOL)
        }
    }

    private fun tryStart(intent: Intent): Boolean = try {
        context.startActivity(intent)
        true
    } catch (e: Exception) {
        false
    }

    private fun isInstalled(pkg: String): Boolean =
        context.packageManager.getLaunchIntentForPackage(pkg) != null

    private fun String?.isNull_or_blank(): Boolean = this == null || this.trim().isEmpty()

    private companion object {
        const val SPOTIFY = "com.spotify.music"

        val PLAY_PATTERNS = listOf(
            Regex("\\b(?:reproduce|reproducir|continua|pon la musica|play)\\b"),
        )
        val PAUSE_PATTERNS = listOf(
            Regex("\\b(?:pausa|pausar|para|deten la musica|stop)\\b"),
        )
        val NEXT_PATTERNS = listOf(
            Regex("\\b(?:siguiente|pista siguiente|next|la que sigue|otra cancion)\\b"),
            Regex("\\b(?:cambia|cambiale|pasa|pasale|salta|saltate|adelanta)\\s+(?:de\\s+|la\\s+|esa\\s+|esta\\s+)?(?:cancion|tema|pista|rola)\\b"),
        )
        val PREV_PATTERNS = listOf(
            Regex("\\b(?:anterior|pista anterior|la de antes)\\b"),
            Regex("\\b(?:regresa|devuelve|vuelve|atras)\\s+(?:a\\s+)?(?:la\\s+)?(?:cancion|tema|pista)\\b"),
        )
        val NOW_PLAYING_PATTERNS = listOf(
            Regex("\\b(?:que suena|que cancion es esta|que estoy escuchando|nombre de la cancion)\\b"),
        )
        val SEARCH_PATTERNS = listOf(
            Regex("^(?:reproduce|reproducir|reproduceme|pon|ponme|poner|escuchar|escucha|quiero escuchar|busca en spotify|busca musica de|toca)\\s+(.+?)(?:\\s+en\\s+(?:spotify|youtube music|youtube))?$"),
        )

        /** Lo que va tras «pon/reproduce» pero no es una búsqueda, sino «reanudar». */
        val GENERIC_MUSIC = setOf("la musica", "musica", "algo", "algo de musica", "la cancion", "otra vez", "de nuevo")

        /** «Pon una alarma», «pon la linterna»…: no son música, que lo resuelva otra herramienta o la IA. */
        val NOT_MUSIC = Regex("^(?:(?:la|el|una|un|me)\\s+)?(?:linterna|alarma|temporizador|volumen|recordatorio|brillo|wifi|bluetooth|modo)\\b")

        fun parseSearchMusicQuery(text: String): Action? {
            for (pattern in SEARCH_PATTERNS) {
                val match = pattern.matchEntire(text.trim())
                if (match != null) {
                    val q = match.groupValues[1].trim()
                    if (q.isNotBlank() && q !in GENERIC_MUSIC && !NOT_MUSIC.containsMatchIn(q)) return Action.SearchMusic(q)
                }
            }
            return null
        }
    }
}
