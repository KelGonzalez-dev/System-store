package com.soni.assistant.actions

import android.app.SearchManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.AlarmClock
import android.provider.MediaStore
import java.text.Normalizer

/**
 * Acciones reales de SONI. Cada función devuelve un texto corto que SONI puede decir en voz alta.
 * Envuélvelas en tus clases SoniTool y decláralas como funciones para Gemini
 * (abrir_app, abrir_camara, reproducir_musica, buscar_web, poner_alarma).
 */
object SoniActions {

    /** Abre cualquier app instalada buscando por su nombre ("whatsapp", "tiktok", "calculadora"...). */
    fun openApp(context: Context, appName: String): String {
        val pm = context.packageManager
        val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val target = normalize(appName)

        val best = pm.queryIntentActivities(launcher, 0)
            .map { it to normalize(it.loadLabel(pm).toString()) }
            .minByOrNull { (_, label) -> score(target, label) }
            ?.takeIf { (_, label) -> score(target, label) <= maxOf(2, target.length / 3) }
            ?: return "No encontré ninguna app llamada $appName"

        val info = best.first
        val intent = pm.getLaunchIntentForPackage(info.activityInfo.packageName)
            ?: return "No puedo abrir $appName"
        return launch(context, intent, "Abriendo ${info.loadLabel(pm)}")
    }

    fun openCamera(context: Context): String =
        launch(context, Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA), "Abriendo la cámara")

    /** Reproduce una canción o artista. Intenta Spotify; si no está, busca en YouTube. */
    fun playMusic(context: Context, query: String): String {
        val spotify = Intent(MediaStore.INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH).apply {
            putExtra(MediaStore.EXTRA_MEDIA_FOCUS, "vnd.android.cursor.item/*")
            putExtra(SearchManager.QUERY, query)
            setPackage("com.spotify.music")
        }
        if (tryStart(context, spotify)) return "Reproduciendo $query en Spotify"

        val youtube = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("https://www.youtube.com/results?search_query=" + Uri.encode(query))
        )
        return launch(context, youtube, "Buscando $query en YouTube")
    }

    fun webSearch(context: Context, query: String): String {
        val search = Intent(Intent.ACTION_WEB_SEARCH).putExtra(SearchManager.QUERY, query)
        if (tryStart(context, search)) return "Buscando $query"
        val browser = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("https://www.google.com/search?q=" + Uri.encode(query))
        )
        return launch(context, browser, "Buscando $query")
    }

    fun setAlarm(context: Context, hour: Int, minutes: Int, label: String = "SONI"): String {
        val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
            putExtra(AlarmClock.EXTRA_HOUR, hour)
            putExtra(AlarmClock.EXTRA_MINUTES, minutes)
            putExtra(AlarmClock.EXTRA_MESSAGE, label)
            putExtra(AlarmClock.EXTRA_SKIP_UI, true)
        }
        return launch(context, intent, "Alarma puesta a las %d:%02d".format(hour, minutes))
    }

    // ---------- utilidades ----------

    private fun launch(context: Context, intent: Intent, ok: String): String =
        if (tryStart(context, intent)) ok else "No encontré una app para hacer eso"

    private fun tryStart(context: Context, intent: Intent): Boolean = try {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        true
    } catch (e: ActivityNotFoundException) {
        false
    } catch (e: SecurityException) {
        false
    }

    private fun normalize(s: String): String =
        Normalizer.normalize(s, Normalizer.Form.NFD)
            .replace(Regex("\\p{Mn}+"), "")
            .lowercase()
            .trim()

    /** 0 = coincide; más alto = más distinto. */
    private fun score(target: String, label: String): Int =
        if (label.contains(target) || target.contains(label)) 0 else levenshtein(target, label)

    private fun levenshtein(a: String, b: String): Int {
        val dp = IntArray(b.length + 1) { it }
        for (i in 1..a.length) {
            var prev = dp[0]
            dp[0] = i
            for (j in 1..b.length) {
                val tmp = dp[j]
                dp[j] = minOf(dp[j] + 1, dp[j - 1] + 1, prev + if (a[i - 1] == b[j - 1]) 0 else 1)
                prev = tmp
            }
        }
        return dp[b.length]
    }
}