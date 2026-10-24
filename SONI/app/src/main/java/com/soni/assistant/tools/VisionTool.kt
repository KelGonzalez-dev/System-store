package com.soni.assistant.tools

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import android.provider.MediaStore
import android.util.Base64
import androidx.exifinterface.media.ExifInterface
import com.soni.assistant.ai.GeminiBrain
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

/** «Describe esta foto», «qué hay en la última foto», «qué ves». */
class VisionTool(private val context: Context) : SoniTool {

    override val name: String = "vision"
    override val description: String = "Describe fotos e imágenes del teléfono."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            if (DESCRIBE.containsMatchIn(text)) Action.DescribeImage(null) else null
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.DescribeImage

    override suspend fun execute(action: Action): ActionResult {
        if (action !is Action.DescribeImage) return ActionResult.Failed("No puedo hacer eso.", FailureReason.NO_TOOL)
        val brain = GeminiBrain.createOrNull(context)
            ?: return ActionResult.Failed("Para describir fotos necesito la clave de Gemini.", FailureReason.NO_TOOL)

        val uri = action.uri?.let(Uri::parse) ?: latestPhoto()
            ?: return ActionResult.Failed(
                "No encontré ninguna foto reciente. También puedes compartir una imagen conmigo desde la galería.",
                FailureReason.INVALID_INPUT,
                actionLabel = "Sin foto",
            )

        val encoded = withContext(Dispatchers.IO) { loadScaled(uri) }
            ?: return ActionResult.Failed("No pude abrir esa imagen.", FailureReason.UNEXPECTED)

        val description = brain.describeImage(encoded, "image/jpeg", "Describe esta foto.")
            ?: return ActionResult.Failed("No pude analizar la foto ahora mismo.", FailureReason.UNEXPECTED)
        return ActionResult.Success(message = description, actionLabel = "Descripción de la foto")
    }

    /** La foto más reciente de la galería. */
    private fun latestPhoto(): Uri? {
        val collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        val projection = arrayOf(MediaStore.Images.Media._ID)
        val sort = "${MediaStore.Images.Media.DATE_ADDED} DESC"
        return runCatching {
            context.contentResolver.query(collection, projection, null, null, sort)?.use { c ->
                if (c.moveToFirst()) {
                    val id = c.getLong(c.getColumnIndexOrThrow(MediaStore.Images.Media._ID))
                    Uri.withAppendedPath(collection, id.toString())
                } else null
            }
        }.getOrNull()
    }

    /** Carga la imagen reducida (máx. 1024 px) y con la rotación correcta, en JPEG base64. */
    private fun loadScaled(uri: Uri): String? = runCatching {
        val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: return null

        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, bounds)
        var sample = 1
        while (bounds.outWidth / sample > 2048 || bounds.outHeight / sample > 2048) sample *= 2

        val options = BitmapFactory.Options().apply { inSampleSize = sample }
        var bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options) ?: return null
        bitmap = rotateIfNeeded(bitmap, bytes)

        val max = 1024
        if (bitmap.width > max || bitmap.height > max) {
            val scale = max.toFloat() / maxOf(bitmap.width, bitmap.height)
            bitmap = Bitmap.createScaledBitmap(bitmap, (bitmap.width * scale).toInt(), (bitmap.height * scale).toInt(), true)
        }
        val out = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out)
        Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
    }.getOrNull()

    private fun rotateIfNeeded(bitmap: Bitmap, bytes: ByteArray): Bitmap {
        val orientation = runCatching {
            ExifInterface(bytes.inputStream()).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
        }.getOrDefault(ExifInterface.ORIENTATION_NORMAL)
        val degrees = when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> 90f
            ExifInterface.ORIENTATION_ROTATE_180 -> 180f
            ExifInterface.ORIENTATION_ROTATE_270 -> 270f
            else -> return bitmap
        }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, Matrix().apply { postRotate(degrees) }, true)
    }

    private companion object {
        val DESCRIBE = Regex(
            "\\b(?:describe|describeme|que hay en|que se ve en|que aparece en|analiza|que es esto en)\\s+(?:esta|la|mi|esa)?\\s*(?:foto|imagen|ultima foto|pantalla)\\b" +
                "|\\bque ves\\b|\\bque hay en la foto\\b|\\bdescribe la ultima foto\\b|\\bque es esta foto\\b"
        )
    }
}
