package com.soni.assistant.spotify

import android.content.Context
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale

/**
 * Busca la canción en Spotify (Web API) para obtener su URI, que luego reproduce el App Remote.
 *
 * Estrategia tolerante a errores de transcripción (nombres propios, inglés):
 *  - Si el usuario dijo «canción de artista», prueba varias formas de búsqueda.
 *  - Entre los resultados, elige el que mejor case con lo pedido: primero por parecido del
 *    nombre del artista, y a igualdad, por popularidad. Así «love de jeydiar» cae en el
 *    artista correcto aunque Spotify lo escriba distinto, en vez de en cualquier «love».
 */
object SpotifySearch {

    private const val SEARCH_URL = "https://api.spotify.com/v1/search"
    private const val TAG = "SoniSpotifySearch"

    data class Track(val uri: String, val title: String, val artist: String)

    // Memoria de lo último que se puso, para resolver «otra del mismo artista».
    @Volatile private var lastArtist: String? = null
    @Volatile private var lastTitle: String? = null

    /** Lo llama MediaControlTool cuando una pista se reproduce de verdad. */
    fun rememberPlayed(track: Track) {
        lastArtist = track.artist
        lastTitle = track.title
    }

    /** El URI de la mejor pista que coincide con [query], o null. */
    suspend fun firstTrackUri(context: Context, query: String): String? =
        bestTrack(context, query)?.uri

    /** La mejor pista para [query], con su título y artista (para poder confirmarla por voz). */
    suspend fun bestTrack(context: Context, query: String): Track? = withContext(Dispatchers.IO) {
        val token = SpotifyAuth.validAccessToken(context) ?: run {
            Log.w(TAG, "sin token válido")
            return@withContext null
        }

        // «otra canción del mismo artista» / «otra tuya»: usamos el artista recordado.
        if (wantsSameArtist(query)) {
            val artist = lastArtist ?: run {
                Log.i(TAG, "pidió «mismo artista» pero no hay memoria")
                return@withContext null
            }
            return@withContext anotherFromArtist(token, artist, excludeTitle = lastTitle)
        }

        val parts = splitSongAndArtist(query)

        if (parts != null) {
            val (song, artist) = parts

            // 1) Búsqueda libre «canción artista»: si entre los primeros hay uno cuyo artista
            //    se parece de verdad a lo pedido, ese.
            val libre = search(token, "$song $artist")
            pickByArtist(libre, artist)?.let { return@withContext it }

            // 2) Estructurada estricta por título y artista.
            val estructurada = search(token, "track:$song artist:$artist")
            pickByArtist(estructurada, artist)?.let { return@withContext it }

            // 3) Traemos las canciones REALES del artista (artist:"..."). Si existe, elegimos
            //    SOLO entre las suyas: la de título más parecido a lo pedido, o su más popular.
            //    Así nunca ponemos a otro artista equivocado cuando el artista sí existe.
            val delArtista = tracksOfArtist(token, artist)
            if (delArtista.isNotEmpty()) {
                // Si piden «otra» del artista, no repetir la que suena ahora.
                val pide0tra = normalize(song).let { it.startsWith("otra") || it.startsWith("otro") }
                val candidatas = if (pide0tra)
                    delArtista.filter { normalize(it.title) != normalize(lastTitle ?: "") }.ifEmpty { delArtista }
                else delArtista
                val porTitulo = candidatas.maxByOrNull { similarity(normalize(song), normalize(it.title)) }
                val best = porTitulo?.takeIf { similarity(normalize(song), normalize(it.title)) >= 0.45 }
                    ?: candidatas.first()
                Log.i(TAG, "elegida del artista «$artist»: ${best.title}/${best.artist}")
                return@withContext best
            }

            // 4) El artista no existe tal cual (seguramente mal transcrito, p. ej. «jd»→jeydiar):
            //    confiamos en el orden libre de Spotify, que suele acertar pese al error.
            libre.firstOrNull()?.let {
                Log.i(TAG, "artista no hallado; confío en libre: ${it.title}/${it.artist}")
                return@withContext it
            }

            // 5) Último recurso: la canción sola, la más popular.
            return@withContext pickByPopularity(search(token, song))
        }

        // Sin «de artista»: búsqueda libre y la más popular.
        pickByPopularity(search(token, query))
    }

    /** ¿El usuario pidió otra canción del mismo artista que suena ahora? */
    private fun wantsSameArtist(query: String): Boolean {
        val q = normalize(query)
        return q.contains("mismo artista") || q.contains("mismo cantante") ||
            q.contains("mismo grupo") || q.contains("otra tuya") ||
            q.contains("otra cancion tuya") || q.contains("del mismo") ||
            q.contains("otra de el") || q.contains("otra de ella") ||
            q.contains("otra del mismo")
    }

    /** Otra canción del artista [artist], distinta de [excludeTitle], con algo de variedad. */
    private fun anotherFromArtist(token: String, artist: String, excludeTitle: String?): Track? {
        val pool = tracksOfArtist(token, artist)
        if (pool.isEmpty()) {
            Log.i(TAG, "no hallé canciones de «$artist» para «otra del mismo»")
            return null
        }
        val fresh = pool.filter { normalize(it.title) != normalize(excludeTitle ?: "") }
        // Entre las primeras (más populares) elegimos una al azar para que «otra» varíe.
        return (fresh.ifEmpty { pool }).take(8).randomOrNull() ?: pool.first()
    }

    /** Canciones reales del artista, confirmando que el artista casa de verdad (>= 0.6). */
    private fun tracksOfArtist(token: String, artist: String): List<Track> {
        val pool = search(token, "artist:\"$artist\"").ifEmpty { search(token, artist) }
        return pool.filter { similarity(normalize(artist), normalize(it.artist)) >= 0.6 }
    }

    /** Separa «love de jeydiar» en ("love","jeydiar"). Null si no hay un « de » claro. */
    private fun splitSongAndArtist(query: String): Pair<String, String>? {
        val regex = Regex("^(.+?)\\s+de\\s+(.+)$", RegexOption.IGNORE_CASE)
        val m = regex.find(query.trim()) ?: return null
        val song = m.groupValues[1].trim()
        val artist = m.groupValues[2].trim()
        if (song.isBlank() || artist.isBlank()) return null
        return song to artist
    }

    /** De una lista de candidatos, el de artista más parecido a [wantedArtist] (si el parecido
     *  es razonable); a igualdad de parecido, el más popular ya viene primero por orden de Spotify. */
    private fun pickByArtist(tracks: List<Track>, wantedArtist: String): Track? {
        val wanted = normalize(wantedArtist)
        if (wanted.isEmpty() || tracks.isEmpty()) return null
        var best: Track? = null
        var bestScore = 0.0
        for (t in tracks) {
            val score = similarity(wanted, normalize(t.artist))
            if (score > bestScore) {
                bestScore = score
                best = t
            }
        }
        // Umbral: aceptamos solo si el artista se parece de verdad (>= 0.5).
        return if (bestScore >= 0.5) best else null
    }

    private fun pickByPopularity(tracks: List<Track>): Track? = tracks.firstOrNull()

    /** Llama a la Web API y devuelve las pistas (ya ordenadas por relevancia de Spotify). */
    private fun search(token: String, rawQuery: String): List<Track> {
        return runCatching {
            val url = URL("$SEARCH_URL?q=${Uri.encode(rawQuery)}&type=track&limit=10&market=from_token")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                setRequestProperty("Authorization", "Bearer $token")
                connectTimeout = 8_000
                readTimeout = 8_000
            }
            val code = conn.responseCode
            val body = (if (code in 200..299) conn.inputStream else conn.errorStream)
                ?.bufferedReader()?.use { it.readText() } ?: return@runCatching emptyList()
            conn.disconnect()
            if (code !in 200..299) {
                Log.w(TAG, "búsqueda falló code=$code body=${body.take(200)}")
                return@runCatching emptyList()
            }
            val items = JSONObject(body).optJSONObject("tracks")?.optJSONArray("items")
                ?: return@runCatching emptyList()
            val out = ArrayList<Track>(items.length())
            for (i in 0 until items.length()) {
                val track = items.optJSONObject(i) ?: continue
                val uri = track.optString("uri")
                if (uri.isNullOrBlank()) continue
                val title = track.optString("name", "")
                val artist = track.optJSONArray("artists")?.optJSONObject(0)?.optString("name", "") ?: ""
                out += Track(uri, title, artist)
            }
            Log.i(TAG, "«$rawQuery» -> ${out.size} resultados; top=${out.firstOrNull()?.let { "${it.title}/${it.artist}" }}")
            out
        }.getOrElse {
            Log.e(TAG, "error buscando: ${it.message}")
            emptyList()
        }
    }

    private fun normalize(s: String): String =
        s.lowercase(Locale.ROOT).replace(Regex("[^a-z0-9ñ ]"), "").trim()

    /** Parecido 0..1 entre dos textos, por distancia de edición sobre el más largo. */
    private fun similarity(a: String, b: String): Double {
        if (a.isEmpty() || b.isEmpty()) return 0.0
        if (a == b) return 1.0
        // Si uno contiene al otro, muy parecido (p. ej. "jeydiar" en "jeydiar oficial").
        if (a.contains(b) || b.contains(a)) return 0.9
        val dist = levenshtein(a, b)
        val maxLen = maxOf(a.length, b.length)
        return 1.0 - dist.toDouble() / maxLen
    }

    private fun levenshtein(a: String, b: String): Int {
        val dp = IntArray(b.length + 1) { it }
        for (i in 1..a.length) {
            var prev = dp[0]
            dp[0] = i
            for (j in 1..b.length) {
                val tmp = dp[j]
                dp[j] = if (a[i - 1] == b[j - 1]) prev
                else 1 + minOf(prev, dp[j], dp[j - 1])
                prev = tmp
            }
        }
        return dp[b.length]
    }
}
