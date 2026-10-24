package com.soni.assistant.documents

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.provider.Settings
import com.soni.assistant.data.memory.MemoryText
import java.io.File

/** Un documento encontrado en el teléfono. */
data class FoundDocument(val file: File, val title: String)

/**
 * Busca libros y documentos (PDF, Word, TXT) en todo el almacenamiento por un nombre parecido:
 * «nosotros en la luna» encuentra «Nosotros_en_la_Luna-Alice Kellen.pdf».
 */
object DocumentFinder {

    val EXTENSIONS = setOf("pdf", "docx", "txt", "md")

    /** Con «Acceso a todos los archivos» SONI puede ver los documentos de cualquier carpeta. */
    fun hasAllFilesAccess(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.R || Environment.isExternalStorageManager()

    fun openAllFilesSettings(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
        val specific = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        val general = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        runCatching { context.startActivity(specific) }.onFailure { runCatching { context.startActivity(general) } }
    }

    /** El documento que mejor coincide con [query], o null. Hace E/S: llamar fuera del hilo principal. */
    fun find(context: Context, query: String): FoundDocument? {
        val wanted = words(query)
        if (wanted.isEmpty()) return null
        val candidates = (fromMediaStore(context) + fromDisk()).distinctBy { it.absolutePath }

        return candidates
            .map { it to score(wanted, words(it.nameWithoutExtension)) }
            .filter { it.second >= MIN_SCORE }
            .maxWithOrNull(compareBy<Pair<File, Double>>({ it.second }, { it.first.lastModified() }))
            ?.first
            ?.let { FoundDocument(it, prettyTitle(it)) }
    }

    /** Todos los documentos legibles (para «qué libros tengo»). */
    fun all(context: Context): List<FoundDocument> =
        (fromMediaStore(context) + fromDisk()).distinctBy { it.absolutePath }
            .sortedByDescending { it.lastModified() }
            .map { FoundDocument(it, prettyTitle(it)) }

    fun prettyTitle(file: File): String =
        file.nameWithoutExtension.replace(Regex("[_\\-.]+"), " ").replace(Regex("\\s+"), " ").trim()

    /** Qué parte de lo pedido aparece en el nombre (0–1), con un extra si el nombre no tiene mucho más. */
    private fun score(wanted: List<String>, name: List<String>): Double {
        if (name.isEmpty()) return 0.0
        val hits = wanted.count { w -> name.any { n -> n == w || (w.length >= 4 && (n.startsWith(w) || w.startsWith(n))) } }
        val coverage = hits.toDouble() / wanted.size
        val precision = hits.toDouble() / name.size
        return coverage * 0.85 + precision * 0.15
    }

    private val STOP = setOf("el", "la", "los", "las", "un", "una", "de", "del", "y", "en", "libro", "documento", "archivo", "pdf", "word")

    private fun words(text: String): List<String> =
        MemoryText.plain(text.replace(Regex("[_\\-.]"), " ")).split(" ").filter { it.length > 1 && it !in STOP }

    private fun fromMediaStore(context: Context): List<File> = runCatching {
        val uri = MediaStore.Files.getContentUri("external")
        @Suppress("DEPRECATION")
        val dataColumn = MediaStore.Files.FileColumns.DATA
        val selection = EXTENSIONS.joinToString(" OR ") { "${MediaStore.Files.FileColumns.DISPLAY_NAME} LIKE ?" }
        val args = EXTENSIONS.map { "%.$it" }.toTypedArray()
        val files = mutableListOf<File>()
        context.contentResolver.query(uri, arrayOf(dataColumn), selection, args, null)?.use { c ->
            val idx = c.getColumnIndex(dataColumn)
            while (c.moveToNext() && idx >= 0) {
                c.getString(idx)?.let { path -> File(path).takeIf { it.isFile && it.canRead() }?.let(files::add) }
            }
        }
        files
    }.getOrDefault(emptyList())

    /** Respaldo: recorre las carpetas habituales (por si MediaStore no indexó algún archivo). */
    private fun fromDisk(): List<File> {
        val root = Environment.getExternalStorageDirectory() ?: return emptyList()
        val folders = listOf("Download", "Documents", "Books", "WhatsApp", "Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Documents", "Telegram")
            .map { File(root, it) } + root
        val found = mutableListOf<File>()
        folders.filter { it.isDirectory }.forEach { folder ->
            folder.walkTopDown()
                .maxDepth(if (folder == root) 1 else 6)
                .onEnter { !it.name.startsWith(".") && it.name != "data" && it.name != "obb" }
                .filter { it.isFile && it.extension.lowercase() in EXTENSIONS }
                .take(5_000)
                .forEach { found += it }
        }
        return found
    }

    private const val MIN_SCORE = 0.6
}
