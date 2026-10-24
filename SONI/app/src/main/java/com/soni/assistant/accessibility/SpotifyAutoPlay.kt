package com.soni.assistant.accessibility

import android.os.SystemClock

/** Coordina con el servicio de accesibilidad para tocar el primer resultado de una búsqueda en Spotify. */
object SpotifyAutoPlay {

    const val SPOTIFY = "com.spotify.music"

    @Volatile
    var playUntil: Long = 0L
        private set

    /** Pide tocar el primer resultado durante los próximos [windowMs] ms (mientras Spotify abre y carga). */
    fun playFirstResult(windowMs: Long = 9_000) {
        playUntil = SystemClock.elapsedRealtime() + windowMs
    }

    fun consume() { playUntil = 0L }

    val isPending: Boolean get() = SystemClock.elapsedRealtime() < playUntil
}
