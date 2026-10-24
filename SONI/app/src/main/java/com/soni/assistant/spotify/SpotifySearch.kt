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

    /** El URI de la mejor pista que coincide con [query], o null. */
    suspend fun firstTrackUri(context: Context, query: String): String? =
        bestTrack(context, query)?.uri

    /** La mejor pista para [query], con su título y artista (para poder confirmarla por voz). */
    suspend fun bestTrack(context: Context, query: String): Track? = withContext(Dispatchers.IO) {
        val token = SpotifyAuth.validAccessToken(context) ?: run {
            Log.w(TAG, "sin token válido")
            return@withContext null
        }

        val parts = splitSongAndArtist(query)

        if (parts != null) {
            val (song, artist) = parts

            // 1) Búsqueda libre «canción artista»: Spotify ya ordena por relevancia y suele
            //    poner el resultado correcto de primero, aunque el artista se oyera mal
            //    (p. ej. «jd» en vez de «jeydiar»). Si entre los primeros hay uno cuyo artista
            //    se parece a lo pedido, ese; si no, el primero de la lista (el más relevante).
            val libre = search(token, "$song $artist")
            pickByArtist(libre, artist)?.let { return@withContext it }
            libre.firstOrNull()?.let { return@withContext it }

            // 2) Estructurada estricta, por si la libre no dio nada.
            val estructurada = search(token, "track:$song artist:$artist")
            pickByArtist(estructurada, artist)?.let { return@withContext it }
            estructurada.firstOrNull()?.let { return@withContext it }

            // 3) Último recurso: la canción sola, la más popular.
            return@withContext pickByPopularity(search(token, song))
        }

        // Sin «de artista»: búsqueda libre y la más popular.
        pickByPopularity(search(token, query))
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
