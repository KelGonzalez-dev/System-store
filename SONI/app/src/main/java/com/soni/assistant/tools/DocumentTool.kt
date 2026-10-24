package com.soni.assistant.tools

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import com.soni.assistant.ai.GeminiBrain
import com.soni.assistant.core.Action
import com.soni.assistant.core.Action.ReaderCommand
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniTool
import com.soni.assistant.documents.DocumentFinder
import com.soni.assistant.documents.FoundDocument
import com.soni.assistant.documents.ReaderPlayer
import com.soni.assistant.documents.ReaderState
import com.soni.assistant.documents.TextExtractor
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.util.Locale

/**
 * Libros y documentos: «léeme el libro Nosotros en la luna», «sigue leyendo», «pausa la lectura»,
 * «resúmeme el documento del contrato», «¿qué libros tengo?».
 */
class DocumentTool(private val context: Context) : SoniTool {

    override val name: String = "documentos"
    override val description: String = "Busca documentos en el teléfono, los lee en voz alta y los resume."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text -> parse(text, ReaderPlayer.isActive) }
    )

    override fun canHandle(action: Action): Boolean = action is Action.ReadDocument ||
        action is Action.SummarizeDocument || action is Action.ListDocuments || action is Action.ReaderControl || action is Action.ReaderSeek

    override suspend fun execute(action: Action): ActionResult = when (action) {
        is Action.ReaderControl -> control(action.command)
        is Action.ReaderSeek -> seek(action)
        is Action.ReadDocument -> withFiles { read(action.query, action.fromStart) }
        is Action.SummarizeDocument -> withFiles { summarize(action.query) }
        Action.ListDocuments -> withFiles { list() }
        else -> ActionResult.Failed("No puedo hacer eso con documentos.", FailureReason.NO_TOOL)
    }

    /** Sin «Acceso a todos los archivos» no puede buscar en las carpetas: se abre el ajuste. */
    private suspend fun withFiles(block: suspend () -> ActionResult): ActionResult {
        if (!DocumentFinder.hasAllFilesAccess()) {
            DocumentFinder.openAllFilesSettings(context)
            return ActionResult.Failed(
                message = "Para buscar tus libros y documentos necesito «Acceso a todos los archivos». Te abrí el ajuste: " +
                    "activa SONI y vuelve a pedírmelo.",
                spokenMessage = "Necesito acceso a tus archivos. Te abrí el ajuste, actívalo y vuelve a pedírmelo.",
                reason = FailureReason.NO_TOOL,
                actionLabel = "Permiso de archivos",
            )
        }
        return block()
    }

    private suspend fun read(query: String, fromStart: Boolean): ActionResult {
        val doc = withContext(Dispatchers.IO) { locate(query) }
            ?: return ActionResult.Failed(
                "No encontré ningún libro o documento parecido a «$query». Puedo leer PDF, Word (.docx) y TXT.",
                FailureReason.INVALID_INPUT,
                actionLabel = "Documento no encontrado",
            )

        // Extraer un libro entero puede tardar: se hace aparte y la lectura empieza sola al terminar.
        scope.launch {
            try {
                val text = TextExtractor.extract(context, doc.file)
                withContext(Dispatchers.Main) { ReaderPlayer.play(context, doc, text, fromStart) }
            } catch (e: TextExtractor.ExtractionException) {
                announce(e.message ?: "No pude leer ese documento.")
            } catch (e: Exception) {
                announce("No pude abrir ${doc.title}.")
            }
        }
        return ActionResult.Success(
            message = "Encontré «${doc.title}». Empiezo a leerlo en unos segundos. Puedes decir «pausa la lectura», " +
                "«sigue leyendo», «adelanta» o «detén la lectura».",
            spokenMessage = "Encontré ${doc.title}. Empiezo a leer.",
            actionLabel = "Lectura de documento",
        )
    }

    private suspend fun summarize(query: String): ActionResult {
        val doc = withContext(Dispatchers.IO) { locate(query) }
            ?: return ActionResult.Failed("No encontré un documento parecido a «$query».", FailureReason.INVALID_INPUT)
        val brain = GeminiBrain.createOrNull(context)
            ?: return ActionResult.Failed("Para resumir necesito la clave de Gemini.", FailureReason.NO_TOOL)
        val text = try {
            withContext(Dispatchers.IO) { TextExtractor.preview(context, doc.file) }
        } catch (e: TextExtractor.ExtractionException) {
            return ActionResult.Failed(e.message ?: "No pude leer ese documento.", FailureReason.UNEXPECTED)
        }
        val summary = brain.chat(
            "Este es el comienzo del documento «${doc.title}». Di de qué trata en 3 o 4 frases, para leer en voz alta, " +
                "sin markdown:\n\n$text"
        ) ?: return ActionResult.Failed("No pude resumirlo ahora mismo.", FailureReason.UNEXPECTED)
        return ActionResult.Success(message = GeminiBrain.shortenForSpeech(summary, 600), actionLabel = "Resumen de ${doc.title}")
    }

    private suspend fun list(): ActionResult {
        val docs = withContext(Dispatchers.IO) { DocumentFinder.all(context) }
        if (docs.isEmpty()) return ActionResult.Success(message = "No encontré libros ni documentos en el teléfono.", actionLabel = "Documentos")
        val names = docs.take(8).joinToString(", ") { it.title }
        val more = if (docs.size > 8) " y ${docs.size - 8} más" else ""
        return ActionResult.Success(message = "Tienes ${docs.size} documentos. Los más recientes: $names$more.", actionLabel = "Documentos")
    }

    private fun seek(action: Action.ReaderSeek): ActionResult {
        if (ReaderPlayer.state.value is ReaderState.Idle) {
            return ActionResult.Failed("No estoy leyendo nada ahora mismo.", FailureReason.NO_TOOL, actionLabel = "Lectura")
        }
        action.text?.let { query ->
            return if (ReaderPlayer.seekToText(query)) {
                ok("Voy a donde habla de «$query».", "Listo, salté a esa parte.")
            } else {
                ActionResult.Failed("No encontré «$query» en el documento.", FailureReason.INVALID_INPUT, actionLabel = "Lectura")
            }
        }
        action.page?.let { page ->
            ReaderPlayer.seekToPage(page)
            return ok("Salté a la página $page aproximada.", "Listo.")
        }
        action.fraction?.let { f ->
            ReaderPlayer.seekToFraction(f)
            val pct = (f * 100).toInt()
            return ok("Salté al $pct por ciento del documento.", "Listo.")
        }
        return ActionResult.Failed("No entendí a dónde saltar.", FailureReason.INVALID_INPUT, actionLabel = "Lectura")
    }

    private fun control(command: ReaderCommand): ActionResult {
        val state = ReaderPlayer.state.value
        if (state is ReaderState.Idle && command != ReaderCommand.RESUME) {
            return ActionResult.Failed("No estoy leyendo nada ahora mismo.", FailureReason.NO_TOOL, actionLabel = "Lectura")
        }
        return when (command) {
            ReaderCommand.PAUSE -> { ReaderPlayer.pause(); ok("Lectura en pausa.", "En pausa.") }
            ReaderCommand.STOP -> { ReaderPlayer.stop(); ok("Dejé de leer. Recuerdo por dónde iba para cuando quieras seguir.", "Listo, dejo de leer.") }
            ReaderCommand.FORWARD -> { ReaderPlayer.skip(+5); ok("Adelanté un poco.", "Adelanto.") }
            ReaderCommand.BACK -> { ReaderPlayer.skip(-2); ok("Regresé un poco.", "Repito.") }
            ReaderCommand.PROGRESS -> {
                val (chunk, total) = when (state) {
                    is ReaderState.Reading -> state.chunk to state.total
                    is ReaderState.Paused -> state.chunk to state.total
                    ReaderState.Idle -> 0 to 1
                }
                val pct = if (total == 0) 0 else chunk * 100 / total
                ok("Voy por el $pct por ciento del documento.", "Voy por el $pct por ciento.")
            }
            ReaderCommand.RESUME -> resume(state)
        }
    }

    private fun resume(state: ReaderState): ActionResult {
        if (state is ReaderState.Paused) {
            ReaderPlayer.resume()
            return ok("Sigo leyendo.", "Sigo.")
        }
        if (state is ReaderState.Reading) return ok("Ya estoy leyendo.", "Ya estoy leyendo.")
        // Nada en curso: se retoma el último documento donde se quedó.
        val path = ReaderPlayer.lastDocumentPath(context)
            ?: return ActionResult.Failed("No hay ninguna lectura pendiente. Dime qué libro quieres que lea.", FailureReason.NO_TOOL)
        val file = File(path)
        if (!file.exists()) return ActionResult.Failed("Ya no encuentro el último documento que leímos.", FailureReason.NO_TOOL)
        val doc = FoundDocument(file, DocumentFinder.prettyTitle(file))
        scope.launch {
            runCatching { TextExtractor.extract(context, file) }
                .onSuccess { text -> withContext(Dispatchers.Main) { ReaderPlayer.play(context, doc, text) } }
                .onFailure { announce("No pude abrir ${doc.title}.") }
        }
        return ok("Retomo «${doc.title}» donde lo dejamos.", "Retomo ${doc.title} donde lo dejamos.")
    }

    private fun locate(query: String): FoundDocument? = DocumentFinder.find(context, query)

    private fun ok(message: String, spoken: String) =
        ActionResult.Success(message = message, spokenMessage = spoken, actionLabel = "Lectura")

    /** Avisa en voz alta de un error que ocurrió después de responder (al preparar el libro). */
    private fun announce(message: String) {
        val app = context.applicationContext
        Handler(Looper.getMainLooper()).post {
            var tts: TextToSpeech? = null
            tts = TextToSpeech(app) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    tts?.language = Locale.forLanguageTag("es")
                    tts?.speak(message, TextToSpeech.QUEUE_FLUSH, null, "doc-error")
                    Handler(Looper.getMainLooper()).postDelayed({ tts?.shutdown() }, 8_000)
                }
            }
        }
    }

    companion object {
        private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

        private const val DOC_WORD = "(?:el\\s+|la\\s+|mi\\s+|un\\s+|una\\s+)?(?:libro|documento|archivo|pdf|word|texto|novela|cuento|trabajo|informe)?"

        private val READ = Regex(
            "^(?:lee|leeme|leer|leete|ponme a leer|empieza a leer|busca y lee|buscame y leeme|abre y lee)\\s+" +
                "$DOC_WORD\\s*(?:llamado\\s+|que se llama\\s+|de nombre\\s+)?(.+?)(\\s+desde el (?:principio|inicio|comienzo))?$"
        )
        private val SUMMARY = Regex(
            "^(?:resume|resumeme|haz un resumen de|hazme un resumen de|dame un resumen de|de que trata)\\s+$DOC_WORD\\s*(.+)$"
        )
        private val LIST = Regex("\\b(?:que|cuales)\\s+(?:libros|documentos|pdf)\\s+tengo\\b|^mis (?:libros|documentos)$")

        /** Lo que NO es un documento aunque empiece por «léeme». */
        private val NOT_DOCUMENT = Regex("^(?:mis |las |los |el |la )?(?:notas?|recordatorios?|mensajes?|notificaciones|whatsapp|correo|correos)\\b")

        private val PAUSE = Regex("\\b(?:pausa|pausar|deten|para)\\s+(?:la\\s+)?(?:lectura|el libro)\\b|\\b(?:deja|para) de leer\\b")
        private val STOP = Regex("\\b(?:termina|cierra|finaliza|apaga)\\s+(?:la\\s+)?(?:lectura|el libro)\\b|\\bya no (?:leas|sigas leyendo)\\b")
        private val RESUME = Regex("\\b(?:sigue|continua|reanuda|retoma)\\s+(?:leyendo|la lectura|con el libro|el libro|con la lectura)\\b")
        private val PROGRESS = Regex("\\b(?:en que parte vas|por donde vas|cuanto falta|cuanto te falta)\\b")

        // Saltos precisos durante la lectura.
        private val SEEK_TEXT = Regex("\\b(?:ve a|ve al|salta a|salta al|adelanta a|adelanta al|busca)\\s+(?:donde|la parte (?:donde|que)|el (?:capitulo|punto) (?:donde|que))\\s+(?:habla(?:n)? (?:de|sobre)|dice|dicen|menciona)\\s+(.+)$")
        private val SEEK_CHAPTER = Regex("\\b(?:ve a|ve al|salta a|salta al|adelanta a|adelanta al|lee)\\s+(?:el\\s+)?capitulo\\s+(\\d{1,3})\\b")
        private val SEEK_PAGE = Regex("\\b(?:ve a|ve al|salta a|salta al|adelanta a|adelanta al)\\s+(?:la\\s+)?pagina\\s+(\\d{1,4})\\b")
        private val SEEK_FRACTION = Regex("\\b(?:ve a|ve al|salta a|salta al|adelanta a|adelanta al)\\s+(?:el\\s+)?(?:(la mitad|mitad)|(el final|final|lo ultimo)|(el principio|principio|el inicio|inicio|el comienzo|comienzo)|(\\d{1,3})\\s*por ciento)\\b")

        /** Con una lectura en curso, órdenes cortas como «pausa» o «sigue» son para el lector. */
        private val SHORT_PAUSE = Regex("^(?:pausa|para|espera|detente|silencio|callate)$")
        private val SHORT_RESUME = Regex("^(?:sigue|continua|dale|reanuda)$")
        private val SHORT_STOP = Regex("^(?:basta|ya|suficiente|detenlo)$")
        private val FORWARD = Regex("^(?:adelanta|salta|saltate esto|siguiente parte)$")
        private val BACK = Regex("^(?:repite|repitelo|vuelve atras|regresa|otra vez)$")

        fun parse(text: String, readerActive: Boolean): Action? {
            if (STOP.containsMatchIn(text)) return Action.ReaderControl(ReaderCommand.STOP)
            if (PAUSE.containsMatchIn(text)) return Action.ReaderControl(ReaderCommand.PAUSE)
            if (RESUME.containsMatchIn(text)) return Action.ReaderControl(ReaderCommand.RESUME)
            if (readerActive) {
                when {
                    SHORT_PAUSE.matches(text) -> return Action.ReaderControl(ReaderCommand.PAUSE)
                    SHORT_RESUME.matches(text) -> return Action.ReaderControl(ReaderCommand.RESUME)
                    SHORT_STOP.matches(text) -> return Action.ReaderControl(ReaderCommand.STOP)
                    FORWARD.matches(text) -> return Action.ReaderControl(ReaderCommand.FORWARD)
                    BACK.matches(text) -> return Action.ReaderControl(ReaderCommand.BACK)
                    PROGRESS.containsMatchIn(text) -> return Action.ReaderControl(ReaderCommand.PROGRESS)
                }
            }
            SEEK_TEXT.find(text)?.let { return Action.ReaderSeek(text = it.groupValues[1].trim()) }
            SEEK_CHAPTER.find(text)?.let { m ->
                // Un capítulo se busca como texto «capitulo N» para posicionarse en él.
                return Action.ReaderSeek(text = "capitulo " + m.groupValues[1])
            }
            SEEK_PAGE.find(text)?.let { return Action.ReaderSeek(page = it.groupValues[1].toInt()) }
            SEEK_FRACTION.find(text)?.let { m ->
                val f = when {
                    m.groupValues[1].isNotBlank() -> 0.5f
                    m.groupValues[2].isNotBlank() -> 0.98f
                    m.groupValues[3].isNotBlank() -> 0f
                    m.groupValues[4].isNotBlank() -> m.groupValues[4].toInt() / 100f
                    else -> return@let
                }
                return Action.ReaderSeek(fraction = f)
            }
            if (LIST.containsMatchIn(text)) return Action.ListDocuments
            SUMMARY.matchEntire(text)?.let { m ->
                val q = m.groupValues[1].trim()
                if (q.isNotBlank()) return Action.SummarizeDocument(q)
            }
            READ.matchEntire(text)?.let { m ->
                val q = m.groupValues[1].trim()
                if (q.isNotBlank() && !NOT_DOCUMENT.containsMatchIn(q)) {
                    return Action.ReadDocument(q, fromStart = m.groupValues[2].isNotBlank())
                }
            }
            return null
        }
    }
}
