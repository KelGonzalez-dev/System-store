package com.soni.assistant.camera

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.provider.MediaStore
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.MediaStoreOutputOptions
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import kotlinx.coroutines.suspendCancellableCoroutine
import java.text.SimpleDateFormat
import java.util.Locale
import kotlin.coroutines.resume

/**
 * Toma fotos y graba video sin interfaz, usando CameraX. Guarda en la carpeta «SONI» de la galería.
 *
 * CameraX necesita un dueño de ciclo de vida; como esto corre en un servicio, se crea uno propio
 * ([ownLifecycle]) que se marca activo mientras se usa la cámara y se apaga al terminar.
 */
class CameraEngine(private val context: Context) : LifecycleOwner {

    private val lifecycleRegistry = LifecycleRegistry(this)
    override val lifecycle: Lifecycle get() = lifecycleRegistry

    private var provider: ProcessCameraProvider? = null
    private var imageCapture: ImageCapture? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var recording: Recording? = null

    sealed interface PhotoResult {
        data class Ready(val previewJpeg: ByteArray) : PhotoResult
        data class Error(val message: String) : PhotoResult
    }

    /** Arranca la cámara y devuelve una foto de muestra para que la IA la revise. */
    suspend fun prepare(selfie: Boolean): PhotoResult {
        return try {
            val cameraProvider = awaitProvider()
            val capture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()
            imageCapture = capture

            val selector = if (selfie) CameraSelector.DEFAULT_FRONT_CAMERA else CameraSelector.DEFAULT_BACK_CAMERA
            ContextCompat.getMainExecutor(context).execute {
                runCatching {
                    cameraProvider.unbindAll()
                    lifecycleRegistry.currentState = Lifecycle.State.RESUMED
                    boundCamera = cameraProvider.bindToLifecycle(this, selector, capture)
                }
            }
            // Pequeña espera para que el enfoque y la exposición automáticos se estabilicen.
            kotlinx.coroutines.delay(1_200)
            val sample = captureJpeg()
            if (sample != null) PhotoResult.Ready(sample) else PhotoResult.Error("No pude usar la cámara.")
        } catch (e: Exception) {
            PhotoResult.Error("No pude abrir la cámara: ${e.message ?: "error"}.")
        }
    }

    /** Toma [count] fotos con distinto zoom y las guarda. Devuelve cuántas guardó. */
    suspend fun takePhotos(count: Int): Int {
        val capture = imageCapture ?: return 0
        val zooms = zoomLevels(count)
        var saved = 0
        for (zoom in zooms) {
            setZoom(zoom)
            kotlinx.coroutines.delay(400) // deja que el zoom y el enfoque se asienten
            if (saveJpeg(capture)) saved++
        }
        return saved
    }

    suspend fun recordVideo(selfie: Boolean, seconds: Int): Boolean {
        return try {
            val cameraProvider = awaitProvider()
            val recorder = Recorder.Builder().build()
            val capture = VideoCapture.withOutput(recorder)
            videoCapture = capture
            val selector = if (selfie) CameraSelector.DEFAULT_FRONT_CAMERA else CameraSelector.DEFAULT_BACK_CAMERA

            suspendCancellableCoroutine { cont ->
                ContextCompat.getMainExecutor(context).execute {
                    runCatching {
                        cameraProvider.unbindAll()
                        lifecycleRegistry.currentState = Lifecycle.State.RESUMED
                        cameraProvider.bindToLifecycle(this, selector, capture)
                        startRecording(capture, seconds) { ok -> if (cont.isActive) cont.resume(ok) }
                    }.onFailure { if (cont.isActive) cont.resume(false) }
                }
            }
        } catch (e: Exception) {
            false
        }
    }

    fun release() {
        ContextCompat.getMainExecutor(context).execute {
            runCatching {
                recording?.stop()
                provider?.unbindAll()
                lifecycleRegistry.currentState = Lifecycle.State.DESTROYED
            }
        }
    }

    // ---------------------------------------------------------------- interno

    private suspend fun awaitProvider(): ProcessCameraProvider {
        provider?.let { return it }
        return suspendCancellableCoroutine { cont ->
            val future = ProcessCameraProvider.getInstance(context)
            future.addListener({
                runCatching { future.get() }
                    .onSuccess { provider = it; cont.resume(it) }
                    .onFailure { cont.resumeWith(Result.failure(it)) }
            }, ContextCompat.getMainExecutor(context))
        }
    }

    private var boundCamera: androidx.camera.core.Camera? = null

    /** El zoom real se limita a lo que la cámara soporta (una cámara sin teleobjetivo no llega a 2x óptico). */
    private suspend fun setZoom(ratio: Float) = suspendCancellableCoroutine<Unit> { cont ->
        val control = boundCamera?.cameraControl
        val maxZoom = boundCamera?.cameraInfo?.zoomState?.value?.maxZoomRatio ?: 1f
        if (control == null) { if (cont.isActive) cont.resume(Unit); return@suspendCancellableCoroutine }
        val future = control.setZoomRatio(ratio.coerceAtMost(maxZoom))
        future.addListener({ if (cont.isActive) cont.resume(Unit) }, ContextCompat.getMainExecutor(context))
    }

    /** Niveles de zoom según cuántas fotos: una normal; varias, de gran angular a acercamiento. */
    private fun zoomLevels(count: Int): List<Float> = when {
        count <= 1 -> listOf(1f)
        count == 2 -> listOf(1f, 2f)
        else -> listOf(1f, 1.5f, 2f)
    }.take(count)

    private suspend fun captureJpeg(): ByteArray? {
        val capture = imageCapture ?: return null
        return suspendCancellableCoroutine { cont ->
            capture.takePicture(
                ContextCompat.getMainExecutor(context),
                object : ImageCapture.OnImageCapturedCallback() {
                    override fun onCaptureSuccess(image: ImageProxy) {
                        val bytes = image.toJpegBytes()
                        image.close()
                        if (cont.isActive) cont.resume(bytes)
                    }

                    override fun onError(exception: ImageCaptureException) {
                        if (cont.isActive) cont.resume(null)
                    }
                },
            )
        }
    }

    private suspend fun saveJpeg(capture: ImageCapture): Boolean {
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, "SONI_${timestamp()}.jpg")
            put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
            put(MediaStore.Images.Media.RELATIVE_PATH, "DCIM/SONI")
        }
        val output = ImageCapture.OutputFileOptions.Builder(
            context.contentResolver, MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values,
        ).build()
        return suspendCancellableCoroutine { cont ->
            capture.takePicture(
                output,
                ContextCompat.getMainExecutor(context),
                object : ImageCapture.OnImageSavedCallback {
                    override fun onImageSaved(results: ImageCapture.OutputFileResults) {
                        if (cont.isActive) cont.resume(true)
                    }

                    override fun onError(exception: ImageCaptureException) {
                        if (cont.isActive) cont.resume(false)
                    }
                },
            )
        }
    }

    @SuppressLint("MissingPermission")
    private fun startRecording(capture: VideoCapture<Recorder>, seconds: Int, done: (Boolean) -> Unit) {
        val values = ContentValues().apply {
            put(MediaStore.Video.Media.DISPLAY_NAME, "SONI_${timestamp()}.mp4")
            put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
            put(MediaStore.Video.Media.RELATIVE_PATH, "DCIM/SONI")
        }
        val output = MediaStoreOutputOptions.Builder(context.contentResolver, MediaStore.Video.Media.EXTERNAL_CONTENT_URI)
            .setContentValues(values).build()

        recording = capture.output
            .prepareRecording(context, output)
            .start(ContextCompat.getMainExecutor(context)) { event ->
                if (event is VideoRecordEvent.Finalize) {
                    done(!event.hasError())
                    recording = null
                }
            }
        // Detener tras los segundos pedidos.
        ContextCompat.getMainExecutor(context).execute {
            android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                recording?.stop()
            }, seconds * 1_000L)
        }
    }

    private fun timestamp() = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(System.currentTimeMillis())

    private companion object {
        fun ImageProxy.toJpegBytes(): ByteArray {
            val buffer = planes[0].buffer
            return ByteArray(buffer.remaining()).also { buffer.get(it) }
        }
    }
}
