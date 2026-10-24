package com.soni.assistant.tools

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.MediaStore
import android.util.Base64
import androidx.core.content.ContextCompat
import com.soni.assistant.ai.GeminiBrain
import com.soni.assistant.camera.CameraEngine
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.voice.SoniSpeaker
import kotlinx.coroutines.delay

/**
 * «Toma una foto», «tómate una selfie», «toma una foto en 10 segundos», «toma 3 fotos»,
 * «graba un video de 15 segundos», «abre la cámara».
 */
class CameraTool(private val context: Context) : SoniTool {

    override val name: String = "camara"
    override val description: String = "Toma fotos (con enfoque y zoom automáticos) y graba video, o abre la cámara."
    override val requiredPermissions: List<String> = listOf(Manifest.permission.CAMERA)
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text -> parse(text) }
    )

    override fun canHandle(action: Action): Boolean =
        action is Action.TakePhoto || action is Action.RecordVideo || action is Action.OpenCamera

    override fun permissionsFor(action: Action): List<String> = when (action) {
        is Action.OpenCamera -> emptyList() // abrir la app de cámara no necesita el permiso
        is Action.RecordVideo -> listOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO)
        else -> listOf(Manifest.permission.CAMERA)
    }

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.OpenCamera -> openCameraApp()
        is Action.TakePhoto -> takePhotos(action)
        is Action.RecordVideo -> recordVideo(action)
        else -> ActionResult.Failed("No puedo hacer eso con la cámara.", FailureReason.NO_TOOL)
    }

    private fun openCameraApp(): ActionResult {
        val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        return try {
            context.startActivity(intent)
            ActionResult.Success(message = "Abriendo la cámara.", spokenMessage = "Abro la cámara", actionLabel = "Cámara")
        } catch (e: Exception) {
            ActionResult.Failed("No encontré una app de cámara.", FailureReason.NO_TOOL)
        }
    }

    private suspend fun takePhotos(action: Action.TakePhoto): ActionResult {
        if (!hasCameraPermission()) return needsPermission()
        val camera = CameraEngine(context)
        try {
            when (val ready = camera.prepare(action.selfie)) {
                is CameraEngine.PhotoResult.Error ->
                    return ActionResult.Failed(ready.message, FailureReason.UNEXPECTED, actionLabel = "Cámara")
                is CameraEngine.PhotoResult.Ready -> if (action.review) reviewAloud(ready.previewJpeg)
            }

            if (action.delaySeconds > 0) countdown(action.delaySeconds)
            else { SoniSpeaker.say(context, "Di whiskey"); delay(600) }

            val saved = camera.takePhotos(action.count)
            return if (saved == 0) {
                ActionResult.Failed("No pude guardar las fotos.", FailureReason.UNEXPECTED, actionLabel = "Cámara")
            } else {
                val msg = when {
                    saved == 1 -> "Listo, tomé la foto. Está en tu galería, en la carpeta SONI."
                    saved == action.count -> "Listo, tomé $saved fotos con diferente zoom. Están en tu galería."
                    else -> "Tomé $saved fotos (algunas no salieron). Están en tu galería."
                }
                val spoken = if (saved == 1) "Listo, tomé la foto." else "Listo, tomé $saved fotos."
                ActionResult.Success(message = msg, spokenMessage = spoken, actionLabel = "Fotos tomadas")
            }
        } finally {
            camera.release()
        }
    }

    private suspend fun recordVideo(action: Action.RecordVideo): ActionResult {
        if (!hasCameraPermission()) return needsPermission()
        val camera = CameraEngine(context)
        try {
            SoniSpeaker.say(context, "Grabando ${action.seconds} segundos. Ya.")
            delay(900)
            val ok = camera.recordVideo(action.selfie, action.seconds)
            return if (ok) {
                ActionResult.Success(
                    message = "Listo, grabé el video de ${action.seconds} segundos. Está en tu galería, en la carpeta SONI.",
                    spokenMessage = "Listo, grabé el video.",
                    actionLabel = "Video grabado",
                )
            } else {
                ActionResult.Failed("No pude grabar el video. Revisa que tenga permiso de cámara y micrófono.", FailureReason.UNEXPECTED)
            }
        } finally {
            camera.release()
        }
    }

    /** La IA mira la foto de muestra y avisa si conviene mejorar algo antes de disparar. */
    private suspend fun reviewAloud(previewJpeg: ByteArray) {
        val brain = GeminiBrain.createOrNull(context) ?: return
        val base64 = Base64.encodeToString(previewJpeg, Base64.NO_WRAP)
        val verdict = brain.describeImage(
            base64, "image/jpeg",
            "Eres un fotógrafo ayudando a encuadrar. Mira esta vista previa y responde en UNA frase corta, " +
                "en español, para leer en voz alta. Si está bien para la foto, di algo como «Se ve bien, no te muevas». " +
                "Si está muy oscuro, muy movido o la persona está cortada, dilo breve y amable. Nada más.",
        ) ?: return
        SoniSpeaker.say(context, verdict)
        delay(1_800)
    }

    private suspend fun countdown(seconds: Int) {
        SoniSpeaker.say(context, "Prepárate.")
        delay(900)
        for (n in seconds.coerceAtMost(5) downTo 1) {
            SoniSpeaker.say(context, n.toString())
            delay(850)
        }
    }

    private fun hasCameraPermission() =
        ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED

    private fun needsPermission() = ActionResult.Failed(
        "Necesito permiso de cámara. Actívalo y vuelve a pedírmelo.",
        FailureReason.NO_TOOL, actionLabel = "Permiso de cámara",
    )

    companion object {
        private val SELFIE = Regex("\\b(?:selfie|autofoto|foto mia|foto de mi|con la frontal|camara frontal)\\b")
        private val SECONDS = Regex("(?:en|de|dentro de)\\s+(\\d{1,3})\\s*(?:segundos?|seg)")
        private val COUNT = Regex("(\\d{1,2})\\s*fotos|\\b(varias|unas)\\s+fotos")
        private val VIDEO = Regex("\\b(?:graba|grabar|graba un video|grabame|empieza a grabar)\\b")
        private val PHOTO = Regex("\\b(?:toma|tomame|tomate|sacame|saca|hazme|tirame)\\s+(?:una\\s+|unas\\s+|la\\s+|\\d+\\s+)?(?:foto|fotos|selfie|autofoto)\\b|\\btomate una (?:foto|selfie)\\b|\\bsacame una foto\\b")
        private val OPEN = Regex("^(?:abre|abreme|inicia|lanza)\\s+(?:la\\s+)?camara$")

        fun parse(text: String): Action? {
            if (OPEN.matches(text)) return Action.OpenCamera
            val selfie = SELFIE.containsMatchIn(text)
            val seconds = SECONDS.find(text)?.groupValues?.get(1)?.toIntOrNull()

            if (VIDEO.containsMatchIn(text)) {
                return Action.RecordVideo(seconds = (seconds ?: 10).coerceIn(1, 120), selfie = selfie)
            }
            if (PHOTO.containsMatchIn(text)) {
                val count = COUNT.find(text)?.let { m -> m.groupValues[1].toIntOrNull() ?: 3 }
                    ?: if (Regex("\\bcon\\s+(?:diferente|distinto|varios)\\s+zoom\\b").containsMatchIn(text)) 3 else 1
                return Action.TakePhoto(selfie = selfie, count = count.coerceIn(1, 5), delaySeconds = (seconds ?: 0).coerceIn(0, 30))
            }
            return null
        }
    }
}
