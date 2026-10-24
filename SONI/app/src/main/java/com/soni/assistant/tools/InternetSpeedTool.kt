package com.soni.assistant.tools

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.roundToInt

/** «¿Cómo está el wifi?», «mide la velocidad de internet», «qué tan rápido está el internet». */
class InternetSpeedTool(private val context: Context) : SoniTool {

    override val name: String = "velocidad_internet"
    override val description: String = "Mide la velocidad de descarga de internet."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            if (SPEED.containsMatchIn(text)) Action.InternetSpeed else null
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.InternetSpeed

    override suspend fun execute(action: Action): ActionResult {
        val connection = connectionType()
            ?: return ActionResult.Success(
                message = "No tienes conexión a internet ahora mismo.",
                spokenMessage = "No tienes internet ahora mismo.",
                actionLabel = "Sin conexión",
            )

        val mbps = withContext(Dispatchers.IO) { measureDownloadMbps() }
            ?: return ActionResult.Failed(
                "No pude medir la velocidad; la descarga de prueba falló. Revisa tu conexión.",
                FailureReason.UNEXPECTED,
                actionLabel = "Velocidad",
            )

        val quality = when {
            mbps < 2 -> "Está lento; sirve para mensajes, pero el video se va a trabar."
            mbps < 10 -> "Está bien para navegar y ver video en calidad normal."
            mbps < 40 -> "Está rápido; aguanta video en alta definición sin problema."
            else -> "Está muy rápido."
        }
        val speed = if (mbps >= 10) mbps.roundToInt().toString() else "%.1f".format(mbps)
        return ActionResult.Success(
            message = "Tu $connection va a unos $speed megas por segundo de bajada. $quality",
            spokenMessage = "Vas a unos $speed megas por segundo. $quality",
            actionLabel = "Velocidad de internet",
        )
    }

    private fun connectionType(): String? {
        val cm = context.getSystemService(ConnectivityManager::class.java) ?: return null
        val caps = cm.getNetworkCapabilities(cm.activeNetwork) ?: return null
        if (!caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)) return null
        return when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "wifi"
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "red móvil"
            else -> "conexión"
        }
    }

    /** Descarga un archivo de prueba y calcula los Mbps. Null si falla. */
    private fun measureDownloadMbps(): Double? {
        for (url in TEST_FILES) {
            val result = runCatching {
                val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 5_000
                    readTimeout = 10_000
                    useCaches = false
                }
                conn.inputStream.use { input ->
                    val buffer = ByteArray(16 * 1024)
                    var total = 0L
                    val start = System.nanoTime()
                    var deadlinePassed = false
                    while (true) {
                        val read = input.read(buffer)
                        if (read < 0) break
                        total += read
                        val elapsed = System.nanoTime() - start
                        if (elapsed > MAX_NANOS) { deadlinePassed = true; break }
                    }
                    val seconds = (System.nanoTime() - start) / 1_000_000_000.0
                    conn.disconnect()
                    // Solo vale si bajó lo suficiente para una medición real.
                    if (total < 200_000 && !deadlinePassed) return@runCatching null
                    if (seconds <= 0) null else total * 8 / seconds / 1_000_000.0
                }
            }.getOrNull()
            if (result != null) return result
        }
        return null
    }

    private companion object {
        const val MAX_NANOS = 6_000_000_000L // mide durante 6 segundos como máximo

        // Archivos públicos de prueba; se usa el primero que responda.
        val TEST_FILES = listOf(
            "https://speed.cloudflare.com/__down?bytes=10000000",
            "https://proof.ovh.net/files/10Mb.dat",
        )

        val SPEED = Regex(
            "\\b(?:como esta (?:el|mi) (?:wifi|internet|wi fi))\\b|\\b(?:mide|medir|prueba|test)\\s+(?:la\\s+)?velocidad\\b" +
                "|\\bque tan rapido (?:esta|va) (?:el|mi) internet\\b|\\bvelocidad (?:de|del) internet\\b|\\btest de velocidad\\b"
        )
    }
}
