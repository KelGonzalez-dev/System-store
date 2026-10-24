package com.soni.assistant.tools

import android.content.Context
import android.content.Intent
import android.provider.AlarmClock
import android.provider.ContactsContract
import android.provider.MediaStore
import android.provider.Settings
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import java.text.Normalizer
import java.util.Locale

class AppLauncherTool(private val context: Context) : SoniTool {

    override val name: String = "aplicaciones"
    override val description: String = "Abre cualquier aplicación instalada en el teléfono por su nombre (Cámara, WhatsApp, Spotify, Ajustes, Galería, etc.)."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            parseOpenAppQuery(text)
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.OpenApp

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.OpenApp) {
            return ActionResult.Failed("No puedo abrir esta aplicación.", FailureReason.NO_TOOL)
        }

        val rawQuery = action.appName
        val queryName = stripArticles(normalize(rawQuery))

        // 1. Probar accesos directos de sistema comunes (Cámara, Ajustes, Galería, etc.)
        val systemIntent = getSystemFallbackIntent(queryName)
        if (systemIntent != null) {
            return try {
                systemIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(systemIntent)
                val label = getSystemLabel(queryName)
                ActionResult.Success(
                    message = "Abriendo $label...",
                    spokenMessage = "Abriendo $label",
                    actionLabel = "App abierta",
                )
            } catch (_: Exception) {
                searchAndLaunchApp(rawQuery, queryName)
            }
        }

        return searchAndLaunchApp(rawQuery, queryName)
    }

    private fun searchAndLaunchApp(rawQuery: String, queryName: String): ActionResult {
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfos = pm.queryIntentActivities(mainIntent, 0)

        var bestMatchPackage: String? = null
        var bestMatchLabel: String? = null

        for (info in resolveInfos) {
            val label = info.loadLabel(pm).toString()
            val normLabel = stripArticles(normalize(label))
            val pkg = info.activityInfo.packageName

            if (normLabel == queryName) {
                bestMatchPackage = pkg
                bestMatchLabel = label
                break
            }

            if (normLabel.contains(queryName) || queryName.contains(normLabel)) {
                if (bestMatchPackage == null) {
                    bestMatchPackage = pkg
                    bestMatchLabel = label
                }
            }
        }

        if (bestMatchPackage == null || bestMatchLabel == null) {
            return ActionResult.Failed(
                message = "No encontré la aplicación «$rawQuery» instalada en el teléfono.",
                reason = FailureReason.INVALID_INPUT,
                actionLabel = "App no encontrada",
            )
        }

        val launchIntent = pm.getLaunchIntentForPackage(bestMatchPackage)
            ?: return ActionResult.Failed("No se pudo iniciar «$bestMatchLabel».", FailureReason.UNEXPECTED)

        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        // Con el teléfono bloqueado, pasa por el desbloqueo del sistema (huella/rostro/PIN) y luego abre.
        val pkg = launchIntent.`package` ?: launchIntent.component?.packageName
        if (pkg != null && com.soni.assistant.app.UnlockAndLaunchActivity.isDeviceLocked(context)) {
            com.soni.assistant.app.UnlockAndLaunchActivity.launch(context, pkg)
        } else {
            context.startActivity(launchIntent)
        }

        return ActionResult.Success(
            message = "Abriendo $bestMatchLabel...",
            spokenMessage = "Abriendo $bestMatchLabel",
            actionLabel = "App abierta",
        )
    }

    private fun getSystemFallbackIntent(queryName: String): Intent? = when (queryName) {
        "camara", "foto", "fotos" -> Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)
        "ajustes", "configuracion", "opciones" -> Intent(Settings.ACTION_SETTINGS)
        "galeria", "galeria de fotos" -> Intent(Intent.ACTION_VIEW, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        "reloj", "alarma", "alarmas" -> Intent(AlarmClock.ACTION_SHOW_ALARMS)
        "calculadora" -> Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_CALCULATOR)
        "contactos" -> Intent(Intent.ACTION_VIEW, ContactsContract.Contacts.CONTENT_URI)
        "telefono", "marcador" -> Intent(Intent.ACTION_DIAL)
        else -> null
    }

    private fun getSystemLabel(queryName: String): String = when (queryName) {
        "camara", "foto", "fotos" -> "Cámara"
        "ajustes", "configuracion", "opciones" -> "Ajustes"
        "galeria", "galeria de fotos" -> "Galería"
        "reloj", "alarma", "alarmas" -> "Reloj"
        "calculadora" -> "Calculadora"
        "contactos" -> "Contactos"
        "telefono", "marcador" -> "Teléfono"
        else -> queryName.replaceFirstChar { it.uppercase() }
    }

    private companion object {
        val OPEN_PATTERNS = listOf(
            // «pon…» no está aquí: es de la música («pon Bad Bunny»).
            Regex("^(?:abre|abrir|abreme|inicia|iniciar|lanza|lanzar|ejecuta|ejecutar|entra a|entra en|ve a)\\s+(.+)$"),
        )

        val DIRECT_APP_NAMES = setOf(
            "camara", "fotos", "galeria", "ajustes", "configuracion",
            "whatsapp", "spotify", "youtube", "tiktok", "instagram", "facebook", "messenger",
            "calculadora", "reloj", "alarmas", "contactos", "telefono", "chrome", "navegador", "google"
        )

        fun parseOpenAppQuery(text: String): Action? {
            val trimmed = text.trim()

            for (pattern in OPEN_PATTERNS) {
                val match = pattern.matchEntire(trimmed)
                if (match != null) {
                    val appName = match.groupValues[1].trim()
                    if (appName.isNotBlank() && appName != "la linterna" && appName != "linterna") {
                        return Action.OpenApp(appName)
                    }
                }
            }

            val norm = stripArticles(normalize(trimmed))
            if (norm in DIRECT_APP_NAMES) {
                return Action.OpenApp(norm)
            }

            return null
        }

        fun normalize(str: String): String {
            val lower = str.lowercase(Locale.ROOT)
            val withoutAccents = Normalizer.normalize(lower, Normalizer.Form.NFD).replace(Regex("\\p{Mn}+"), "")
            return withoutAccents.replace(Regex("[^a-z0-9]"), " ").replace(Regex("\\s+"), " ").trim()
        }

        fun stripArticles(str: String): String {
            return str
                .replace(Regex("^\\s*(?:el|la|los|las|un|una|unos|unas)\\s+"), "")
                .trim()
        }
    }
}
