package com.soni.assistant.documents

import android.content.Context
import android.util.Xml
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper
import org.xmlpull.v1.XmlPullParser
import java.io.File
import java.nio.charset.Charset
import java.util.zip.ZipFile

/** Saca el texto de un documento para leerlo. Guarda una copia en caché para no repetir el trabajo. */
object TextExtractor {

    class ExtractionException(message: String) : Exception(message)

    /** Hace E/S pesada: llamar fuera del hilo principal. */
    fun extract(context: Context, file: File): String {
        val cache = File(context.cacheDir, "docs/${file.absolutePath.hashCode()}_${file.lastModified()}.txt")
        if (cache.exists()) return cache.readText()

        val text = when (file.extension.lowercase()) {
            "pdf" -> pdf(context, file)
            "docx" -> docx(file)
            "txt", "md" -> plain(file)
            else -> throw ExtractionException("No sé leer archivos .${file.extension}.")
        }.replace(Regex("[ \\t]+"), " ")
            .replace(Regex("-\\n(?=\\p{Ll})"), "") // palabras cortadas al final de línea
            .replace(Regex("(?<![.!?:;])\\n(?!\\n)"), " ") // líneas partidas dentro de un párrafo
            .replace(Regex("\\n{2,}"), "\n")
            .trim()

        if (text.length < 20) {
            throw ExtractionException(
                if (file.extension.equals("pdf", true)) "Ese PDF parece escaneado (son imágenes), así que no tiene texto que pueda leer."
                else "El documento está vacío."
            )
        }
        cache.parentFile?.mkdirs()
        runCatching { cache.writeText(text) }
        return text
    }

    /** Solo el comienzo (para resúmenes): mucho más rápido que extraer un libro entero. */
    fun preview(context: Context, file: File, maxChars: Int = 15_000): String {
        val text = if (file.extension.equals("pdf", true)) {
            pdf(context, file, lastPage = 25)
        } else {
            extract(context, file)
        }
        return text.replace(Regex("\\s+"), " ").take(maxChars)
    }

    private fun pdf(context: Context, file: File, lastPage: Int = Int.MAX_VALUE): String {
        PDFBoxResourceLoader.init(context.applicationContext)
        return PDDocument.load(file).use { doc ->
            if (doc.isEncrypted) throw ExtractionException("Ese PDF tiene contraseña, no puedo abrirlo.")
            PDFTextStripper().apply {
                sortByPosition = true
                if (lastPage != Int.MAX_VALUE) endPage = lastPage
            }.getText(doc)
        }
    }

    /** Un .docx es un zip; el texto está en word/document.xml dentro de etiquetas <w:t>. */
    private fun docx(file: File): String = ZipFile(file).use { zip ->
        val entry = zip.getEntry("word/document.xml") ?: throw ExtractionException("Ese Word no tiene texto.")
        zip.getInputStream(entry).use { input ->
            val parser = Xml.newPullParser()
            parser.setInput(input, "UTF-8")
            val out = StringBuilder()
            var inText = false
            while (parser.next() != XmlPullParser.END_DOCUMENT) {
                when (parser.eventType) {
                    XmlPullParser.START_TAG -> when (parser.name) {
                        "w:t", "t" -> inText = true
                        "w:tab", "tab" -> out.append(' ')
                        "w:br", "br" -> out.append('\n')
                    }
                    XmlPullParser.END_TAG -> when (parser.name) {
                        "w:t", "t" -> inText = false
                        "w:p", "p" -> out.append("\n\n")
                    }
                    XmlPullParser.TEXT -> if (inText) out.append(parser.text)
                }
            }
            out.toString()
        }
    }

    private fun plain(file: File): String {
        val bytes = file.readBytes()
        val utf8 = String(bytes, Charsets.UTF_8)
        // Si hay caracteres inválidos, probablemente está en Latin-1 (común en archivos antiguos en español).
        return if ('\uFFFD' in utf8) String(bytes, Charset.forName("ISO-8859-1")) else utf8
    }

    /** Parte el texto en trozos de ~[maxChars] que terminan en fin de frase (TTS no acepta textos enormes). */
    fun chunks(text: String, maxChars: Int = 350): List<String> {
        val sentences = Regex("(?<=[.!?…])\\s+|\\n+").split(text).map { it.trim() }.filter { it.isNotEmpty() }
        val result = mutableListOf<String>()
        val current = StringBuilder()
        for (sentence in sentences) {
            if (sentence.length > maxChars) {
                if (current.isNotEmpty()) { result += current.toString(); current.clear() }
                sentence.chunked(maxChars).forEach { result += it }
                continue
            }
            if (current.length + sentence.length + 1 > maxChars && current.isNotEmpty()) {
                result += current.toString()
                current.clear()
            }
            if (current.isNotEmpty()) current.append(' ')
            current.append(sentence)
        }
        if (current.isNotEmpty()) result += current.toString()
        return result
    }
}
