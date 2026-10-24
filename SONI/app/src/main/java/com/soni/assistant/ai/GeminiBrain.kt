package com.soni.assistant.ai

import com.soni.assistant.BuildConfig
import com.soni.assistant.core.Action
import com.soni.assistant.core.BrainDecision
import com.soni.assistant.core.SoniBrain
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Cerebro de SONI con la API de Gemini.
 *
 * 1. Manda la orden con la lista de funciones que SONI sabe ejecutar (function calling) y
 *    obliga al modelo a elegir una. Las funciones se traducen a [Action] tipadas.
 * 2. Si elige «buscar_informacion» (clima, noticias, datos actuales…), hace una segunda
 *    consulta con la búsqueda de Google activada y devuelve un texto corto para leer en voz alta.
 *
 * Sin dependencias nuevas: HttpURLConnection + org.json, que ya vienen en Android.
 */
class GeminiBrain(
    private val apiKey: String,
    private val model: String,
    /** Datos del usuario para el contexto: su nombre y las personas que SONI conoce. */
    private val profile: () -> String = { "" },
) : SoniBrain {

    private fun remember(user: String, reply: String) = synchronized(history) {
        history.addLast(user to reply)
        while (history.size > MAX_HISTORY) history.removeFirst()
    }

    override suspend fun decide(text: String): BrainDecision = withContext(Dispatchers.IO) {
        try {
            val response = post(buildActionRequest(text))
            val call = firstFunctionCall(response)
                ?: return@withContext firstText(response)
                    ?.let { answer -> remember(text, answer); BrainDecision.Answer(answer) }
                    ?: BrainDecision.Error("No entendí la orden. ¿Puedes decirla de otra forma?")
            val name = call.getString("name")
            val decision = toDecision(name, call.optJSONObject("args") ?: JSONObject())
            remember(text, if (decision is BrainDecision.Answer) decision.text else "(hice la acción $name)")
            decision
        } catch (e: GeminiHttpException) {
            BrainDecision.Error(e.userMessage)
        } catch (e: IOException) {
            BrainDecision.Error("No tengo conexión a internet para pensar esa respuesta.")
        } catch (e: Exception) {
            BrainDecision.Error("La IA devolvió una respuesta que no pude interpretar.")
        }
    }

    // ---------------------------------------------------------------- traducción a acciones

    private fun toDecision(name: String, args: JSONObject): BrainDecision {
        fun s(key: String) = args.optString(key, "").trim()
        return when (name) {
            "abrir_app" -> BrainDecision.Run(Action.OpenApp(s("nombre")))
            "abrir_camara" -> BrainDecision.Run(Action.OpenApp("camara"))
            "reproducir_musica" -> BrainDecision.Run(Action.SearchMusic(s("consulta")))
            "controlar_musica" -> when (s("accion")) {
                "pausar" -> BrainDecision.Run(Action.MediaPause)
                "siguiente" -> BrainDecision.Run(Action.MediaNext)
                "anterior" -> BrainDecision.Run(Action.MediaPrevious)
                "que_suena" -> BrainDecision.Run(Action.MediaNowPlaying)
                else -> BrainDecision.Run(Action.MediaPlay)
            }
            "llamar" -> BrainDecision.Run(Action.CallContact(s("contacto")))
            "enviar_whatsapp" -> BrainDecision.Run(Action.SendWhatsApp(s("contacto"), s("mensaje")))
            "enviar_sms" -> BrainDecision.Run(Action.SendSms(s("contacto"), s("mensaje")))
            "buscar_contacto" -> BrainDecision.Run(Action.SearchContact(s("nombre")))
            "buscar_en_google" -> BrainDecision.Run(Action.WebSearch(s("consulta")))
            "linterna" -> BrainDecision.Run(Action.ToggleFlashlight(args.optBoolean("encender", true)))
            "volumen" -> BrainDecision.Run(Action.SetVolume(args.optInt("porcentaje", 50).coerceIn(0, 100)))
            "estado_telefono" -> when (s("tipo")) {
                "almacenamiento" -> BrainDecision.Run(Action.GetStorageInfo)
                "dispositivo" -> BrainDecision.Run(Action.GetDeviceInfo)
                else -> BrainDecision.Run(Action.GetBatteryInfo)
            }
            "decir_hora_o_fecha" ->
                if (s("que") == "fecha") BrainDecision.Run(Action.TellDate()) else BrainDecision.Run(Action.TellTime)
            "buscar_informacion" -> BrainDecision.Run(Action.Research(s("consulta")))
            "apagar_soni" -> BrainDecision.Run(Action.ShutdownSoni)
            "responder" -> BrainDecision.Answer(s("texto").ifBlank { "No sé qué responder a eso." })
            "crear_recordatorio" -> {
                val at = runCatching { java.time.LocalDateTime.parse(s("fecha_hora")) }.getOrNull()
                    ?: return BrainDecision.Answer("¿Para qué hora te lo recuerdo?")
                val millis = at.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
                BrainDecision.Run(Action.SetReminder(s("texto").ifBlank { "lo que me pediste" }, millis))
            }
            "ver_recordatorios" -> BrainDecision.Run(Action.ListReminders)
            "crear_nota" -> BrainDecision.Run(Action.AddNote(s("texto")))
            "leer_notas" -> BrainDecision.Run(Action.ReadNotes)
            "borrar_notas" -> BrainDecision.Run(Action.DeleteNotes(s("contiene").ifBlank { null }))
            "conocer_persona" -> BrainDecision.Run(Action.MeetPerson(s("nombre").ifBlank { null }))
            "info_persona" -> BrainDecision.Run(Action.AboutPerson(s("nombre")))
            "describir_foto" -> BrainDecision.Run(Action.DescribeImage(null))
            "velocidad_internet" -> BrainDecision.Run(Action.InternetSpeed)
            "tomar_foto" -> BrainDecision.Run(
                Action.TakePhoto(
                    selfie = args.optBoolean("selfie", false),
                    count = args.optInt("cantidad", 1).coerceIn(1, 5),
                    delaySeconds = args.optInt("segundos", 0).coerceIn(0, 30),
                )
            )
            "grabar_video" -> BrainDecision.Run(Action.RecordVideo(args.optInt("segundos", 10).coerceIn(1, 120), args.optBoolean("selfie", false)))
            "abrir_camara_app" -> BrainDecision.Run(Action.OpenCamera)
            "leer_documento" -> BrainDecision.Run(Action.ReadDocument(s("nombre")))
            "resumir_documento" -> BrainDecision.Run(Action.SummarizeDocument(s("nombre")))
            "leer_notificaciones" -> BrainDecision.Run(Action.SetReadNotifications(args.optBoolean("activar", true)))
            "modo_no_disponible" -> BrainDecision.Run(Action.SetAwayMode(args.optBoolean("activar", true)))
            "contestar_llamada" -> BrainDecision.Run(Action.CallControl(answer = true))
            "colgar_llamada" -> BrainDecision.Run(Action.CallControl(answer = false))
            "saltar_en_lectura" -> {
                val t = s("texto"); val pct = args.optInt("porcentaje", -1)
                when {
                    t.isNotBlank() -> BrainDecision.Run(Action.ReaderSeek(text = t))
                    pct in 0..100 -> BrainDecision.Run(Action.ReaderSeek(fraction = pct / 100f))
                    else -> BrainDecision.Answer("¿A dónde quieres que salte?")
                }
            }
            "control_lectura" -> BrainDecision.Run(
                Action.ReaderControl(
                    when (s("accion")) {
                        "pausar" -> Action.ReaderCommand.PAUSE
                        "detener" -> Action.ReaderCommand.STOP
                        "adelantar" -> Action.ReaderCommand.FORWARD
                        "repetir" -> Action.ReaderCommand.BACK
                        "progreso" -> Action.ReaderCommand.PROGRESS
                        else -> Action.ReaderCommand.RESUME
                    }
                )
            )
            else -> BrainDecision.Error("Todavía no sé hacer eso.")
        }
    }

    /**
     * Investiga en internet con la búsqueda de Google (grounding) y devuelve una respuesta para leer
     * en voz alta. [place] es la ciudad del usuario, para el clima y preguntas «cerca de mí».
     */
    suspend fun research(query: String, place: String?): BrainDecision = withContext(Dispatchers.IO) {
        try {
            searchAndAnswer(query, place)
        } catch (e: GeminiHttpException) {
            BrainDecision.Error(e.userMessage)
        } catch (e: IOException) {
            BrainDecision.Error("No tengo conexión a internet para investigar eso.")
        } catch (e: Exception) {
            BrainDecision.Error("No pude completar la investigación.")
        }
    }

    private fun searchAndAnswer(query: String, place: String?): BrainDecision {
        val context = buildString {
            append(SEARCH_INSTRUCTION)
            append("\nFecha y hora actuales: ${now()}.")
            if (place != null) append("\nEl usuario está en $place. Úsalo si la pregunta depende del lugar y no menciona otro.")
        }
        val contents = JSONArray()
        synchronized(history) {
            history.forEach { (user, reply) ->
                contents.put(userContent(user))
                contents.put(JSONObject().put("role", "model").put("parts", JSONArray().put(JSONObject().put("text", reply))))
            }
        }
        contents.put(userContent(query))
        val body = JSONObject()
            .put("systemInstruction", textContent(context))
            .put("contents", contents)
            .put("tools", JSONArray().put(JSONObject().put("google_search", JSONObject())))
        val text = firstText(post(body))
            ?: return BrainDecision.Error("No encontré información sobre eso.")
        val wantsMore = Regex("(?i)cu[eé]ntame m[aá]s|m[aá]s detalle|expl[ií]ca(me)? (mejor|m[aá]s)|a fondo").containsMatchIn(query)
        val answer = if (wantsMore) shortenForSpeech(text, 900) else shortenForSpeech(text)
        remember(query, answer)
        return BrainDecision.Answer(answer, label = "Búsqueda en Google")
    }

    // ---------------------------------------------------------------- peticiones

    /** Texto libre sin herramientas (análisis, descripciones). Null si falla. */
    suspend fun chat(prompt: String): String? = withContext(Dispatchers.IO) {
        runCatching {
            val body = JSONObject()
                .put("systemInstruction", textContent(SEARCH_INSTRUCTION))
                .put("contents", JSONArray().put(userContent(prompt)))
            firstText(post(body))
        }.getOrNull()
    }

    /**
     * Describe una imagen. [imageBase64] son los bytes en base64 y [mime] su tipo (image/jpeg…).
     * Gemini es multimodal, así que ve la foto y la describe. Null si falla.
     */
    suspend fun describeImage(imageBase64: String, mime: String, prompt: String): String? = withContext(Dispatchers.IO) {
        runCatching {
            val parts = JSONArray()
                .put(JSONObject().put("text", prompt))
                .put(JSONObject().put("inlineData", JSONObject().put("mimeType", mime).put("data", imageBase64)))
            val body = JSONObject()
                .put("systemInstruction", textContent(VISION_INSTRUCTION))
                .put("contents", JSONArray().put(JSONObject().put("role", "user").put("parts", parts)))
            firstText(post(body))
        }.getOrNull()
    }

    private fun buildActionRequest(text: String): JSONObject {
        val contents = JSONArray()
        synchronized(history) {
            history.forEach { (user, reply) ->
                contents.put(userContent(user))
                contents.put(JSONObject().put("role", "model").put("parts", JSONArray().put(JSONObject().put("text", reply))))
            }
        }
        contents.put(userContent(text))
        val instruction = buildString {
            append(ACTION_INSTRUCTION)
            append("\nFecha y hora actuales: ${now()}.")
            profile().takeIf { it.isNotBlank() }?.let { append("\n").append(it) }
        }
        return JSONObject()
            .put("systemInstruction", textContent(instruction))
            .put("contents", contents)
        .put("tools", JSONArray().put(JSONObject().put("functionDeclarations", FUNCTIONS)))
        .put(
            "toolConfig",
            JSONObject().put("functionCallingConfig", JSONObject().put("mode", "ANY")),
        )
    }

    private fun post(body: JSONObject): JSONObject {
        val url = URL("https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 10_000
            readTimeout = 25_000
            doOutput = true
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            setRequestProperty("x-goog-api-key", apiKey)
        }
        try {
            conn.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val code = conn.responseCode
            val stream = if (code in 200..299) conn.inputStream else conn.errorStream
            val raw = stream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }.orEmpty()
            if (code !in 200..299) throw GeminiHttpException(code, raw, model)
            return JSONObject(raw)
        } finally {
            conn.disconnect()
        }
    }

    private fun parts(response: JSONObject): JSONArray? = response
        .optJSONArray("candidates")?.optJSONObject(0)
        ?.optJSONObject("content")?.optJSONArray("parts")

    private fun firstFunctionCall(response: JSONObject): JSONObject? {
        val parts = parts(response) ?: return null
        for (i in 0 until parts.length()) {
            parts.optJSONObject(i)?.optJSONObject("functionCall")?.let { return it }
        }
        return null
    }

    private fun firstText(response: JSONObject): String? {
        val parts = parts(response) ?: return null
        val text = buildString {
            for (i in 0 until parts.length()) {
                val part = parts.optJSONObject(i) ?: continue
                if (part.optBoolean("thought", false)) continue
                append(part.optString("text", ""))
            }
        }
        return cleanForSpeech(text).ifBlank { null }
    }

    private class GeminiHttpException(code: Int, raw: String, model: String) : Exception("HTTP $code") {
        val userMessage: String = when (code) {
            400 -> if (raw.contains("API key", ignoreCase = true)) "La clave de Gemini no es válida. Revísala en local.properties."
            else "Gemini rechazó la petición (error 400)."
            401, 403 -> "La clave de Gemini no es válida o no tiene permiso. Revísala en local.properties."
            404 -> "El modelo «$model» no existe. Cambia GEMINI_MODEL en local.properties."
            429 -> "Superé el límite gratuito de Gemini por ahora. Espera un momento."
            in 500..599 -> "El servicio de Gemini está fallando ahora mismo. Intenta en un rato."
            else -> "Error de Gemini ($code)."
        }
    }

    companion object {
        private const val MAX_HISTORY = 6

        /**
         * Últimos intercambios, compartidos por todas las instancias (la investigación usa otra), para
         * poder conversar: «¿y mañana?», «cuéntame más», «explícamelo mejor».
         */
        private val history = ArrayDeque<Pair<String, String>>()

        /** Corta en la última frase completa si la IA se extendió de más (máx. [max] caracteres). */
        fun shortenForSpeech(text: String, max: Int = 420): String {
            if (text.length <= max) return text
            val cut = text.substring(0, max)
            val end = maxOf(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "))
            return if (end > max / 3) cut.substring(0, end + 1) else cut.substringBeforeLast(' ') + "…"
        }

        /**
         * Crea el cerebro con la clave de local.properties, o null si no hay clave.
         * Con [context], la IA sabe el nombre del usuario y a quién conoce SONI.
         */
        fun createOrNull(context: android.content.Context? = null): GeminiBrain? {
            val key = BuildConfig.GEMINI_API_KEY
            if (key.isBlank()) return null
            val app = context?.applicationContext
            val profile: () -> String = {
                if (app == null) "" else buildString {
                    val name = com.soni.assistant.data.settings.SoniSettings.get(app).current.userName
                    if (name.isNotBlank()) append("El usuario se llama $name; también le dices «jefe». ")
                    val profile = com.soni.assistant.data.settings.UserProfile.get(app).promptSummary()
                    if (profile.isNotBlank()) append(profile)
                    val people = com.soni.assistant.data.memory.PeopleStore.get(app).all()
                    if (people.isNotEmpty()) {
                        append(" Personas que conoces: ")
                        append(people.joinToString("; ") { p ->
                            listOfNotNull(p.name, p.relation?.let { "es $it del usuario" }, p.sign).joinToString(", ")
                        })
                        append(".")
                    }
                }
            }
            return GeminiBrain(key, BuildConfig.GEMINI_MODEL.ifBlank { "gemini-2.5-flash" }, profile)
        }

        private fun now(): String =
            SimpleDateFormat("EEEE d 'de' MMMM 'de' yyyy, HH:mm", Locale.forLanguageTag("es")).format(Date())

        /** Quita markdown y enlaces para que el TTS no lea asteriscos ni URLs. */
        private fun cleanForSpeech(text: String): String = text
            .replace(Regex("\\[(.*?)]\\(.*?\\)"), "$1")
            .replace(Regex("https?://\\S+"), "")
            .replace(Regex("[*#_`>]"), "")
            .replace(Regex("[ \\t]+"), " ")
            .trim()

        private fun textContent(text: String) =
            JSONObject().put("parts", JSONArray().put(JSONObject().put("text", text)))

        private fun userContent(text: String) =
            JSONObject().put("role", "user").put("parts", JSONArray().put(JSONObject().put("text", text)))

        private const val ACTION_INSTRUCTION = """
Eres SONI, un asistente de voz que controla un teléfono Android. El usuario te habla en español
y su frase viene de un reconocedor de voz, así que puede tener errores (por ejemplo «Sony» es «SONI»).
Elige SIEMPRE exactamente una función:
- Si pide hacer algo en el teléfono, usa la función de esa acción.
- Si pregunta algo que depende de datos actuales o de internet (clima, temperatura exterior,
  noticias, resultados, precios, horarios, datos de personas o lugares), usa buscar_informacion.
- Si es conversación o una pregunta que sabes responder sin internet, usa responder con un texto
  corto (1 a 3 frases), natural para ser leído en voz alta, sin markdown.
- Si pide algo que ninguna función puede hacer, usa responder explicando con honestidad que aún no
  puedes hacerlo. Nunca digas que hiciste algo que no hiciste.
"""

        private const val VISION_INSTRUCTION = """
Eres SONI, un asistente de voz. Describe la imagen en español de forma clara y natural para leer
en voz alta: 2 a 4 frases, lo más importante primero (qué o quién aparece, qué está pasando,
detalles llamativos). Si hay texto legible importante, léelo. Sin markdown. Si te preguntan algo
concreto sobre la imagen, responde eso directamente.
"""

        private const val SEARCH_INSTRUCTION = """
Eres SONI, un asistente de voz que investiga en internet por el usuario. Tu respuesta se va a
LEER EN VOZ ALTA, así que debe ser CORTA: máximo 3 frases y unas 60 palabras en total.
Di solo lo más importante, como lo diría una persona en una conversación: el dato principal
primero, sin introducciones ni relleno. Para un dato puntual (clima, un resultado, un precio)
basta 1 frase. Sin markdown, sin listas, sin enlaces, sin mencionar fuentes. Si el tema da para
más, termina con «¿Quieres que te cuente más?». Si el usuario pide más detalle o «cuéntame más»,
entonces sí puedes extenderte hasta 6 frases. Si no encuentras el dato, dilo con honestidad.
"""

        private fun fn(name: String, description: String, vararg params: Pair<String, JSONObject>): JSONObject {
            val obj = JSONObject().put("name", name).put("description", description)
            if (params.isNotEmpty()) {
                val props = JSONObject()
                val required = JSONArray()
                params.forEach { (key, schema) -> props.put(key, schema); required.put(key) }
                obj.put("parameters", JSONObject().put("type", "object").put("properties", props).put("required", required))
            }
            return obj
        }

        private const val CONTACT_HINT = "Nombre, número o rol tal como lo dijo el usuario: «mi mamá», «mi jefa», «Juan»."

        private fun str(description: String) = JSONObject().put("type", "string").put("description", description)
        private fun int(description: String) = JSONObject().put("type", "integer").put("description", description)
        private fun bool(description: String) = JSONObject().put("type", "boolean").put("description", description)
        private fun choice(description: String, vararg values: String) = JSONObject()
            .put("type", "string").put("description", description).put("enum", JSONArray(values.toList()))

        private val FUNCTIONS: JSONArray = JSONArray()
            .put(fn("abrir_app", "Abre una aplicación instalada por su nombre (WhatsApp, TikTok, Instagram, Ajustes…).",
                "nombre" to str("Nombre de la app tal como se ve en el teléfono")))
            .put(fn("abrir_camara", "Abre la cámara para tomar fotos."))
            .put(fn("reproducir_musica", "Busca y reproduce una canción, artista, álbum o género en Spotify o el reproductor.",
                "consulta" to str("Canción, artista o género, p. ej. «Shakira» o «rock de los 80»")))
            .put(fn("controlar_musica", "Controla la música que ya está sonando.",
                "accion" to choice("Qué hacer", "reproducir", "pausar", "siguiente", "anterior", "que_suena")))
            .put(fn("llamar", "Llama por teléfono a un contacto o número.",
                "contacto" to str(CONTACT_HINT)))
            .put(fn("enviar_whatsapp", "Escribe y envía un mensaje de WhatsApp. Úsala para cualquier «envíale un mensaje» que no diga SMS.",
                "contacto" to str(CONTACT_HINT), "mensaje" to str("Solo el texto a enviar, sin «que diga». Si el usuario no dijo qué enviar, NO uses esta función: usa responder para preguntarle qué mensaje quiere enviar.")))
            .put(fn("enviar_sms", "Envía un SMS (mensaje de texto) a un contacto, solo si el usuario dice SMS o mensaje de texto.",
                "contacto" to str(CONTACT_HINT), "mensaje" to str("Texto del mensaje")))
            .put(fn("buscar_contacto", "Busca un contacto y muestra su número.",
                "nombre" to str("Nombre del contacto")))
            .put(fn("buscar_en_google", "Abre Google en el navegador con una búsqueda, cuando el usuario quiere VER los resultados.",
                "consulta" to str("Qué buscar")))
            .put(fn("buscar_informacion", "Investiga en internet y responde en voz alta: clima, temperatura, noticias, datos actuales, preguntas sobre el mundo.",
                "consulta" to str("Pregunta completa, incluyendo lugar si aplica")))
            .put(fn("apagar_soni", "Apaga a SONI: deja de escuchar en segundo plano. Para «apágate», «desactívate», «descansa»."))
            .put(fn("linterna", "Enciende o apaga la linterna.",
                "encender" to bool("true para encender, false para apagar")))
            .put(fn("volumen", "Cambia el volumen multimedia.",
                "porcentaje" to int("De 0 a 100")))
            .put(fn("estado_telefono", "Informa del estado del teléfono.",
                "tipo" to choice("Qué consultar", "bateria", "almacenamiento", "dispositivo")))
            .put(fn("decir_hora_o_fecha", "Dice la hora o la fecha actual.",
                "que" to choice("Qué decir", "hora", "fecha")))
            .put(fn("crear_recordatorio", "Crea un recordatorio que sonará y se dirá en voz alta.",
                "texto" to str("Qué recordar, en pocas palabras"),
                "fecha_hora" to str("Cuándo, en formato AAAA-MM-DDTHH:MM, calculado desde la fecha y hora actuales")))
            .put(fn("ver_recordatorios", "Dice los recordatorios pendientes."))
            .put(fn("crear_nota", "Guarda una nota en el bloc de notas de SONI.",
                "texto" to str("El contenido de la nota")))
            .put(fn("leer_notas", "Lee en voz alta las notas guardadas."))
            .put(fn("borrar_notas", "Borra notas.",
                "contiene" to str("Texto de la nota a borrar, o vacío para borrarlas todas")))
            .put(fn("conocer_persona", "Para «conoce a…», «te presento a…»: SONI saluda a la persona y le pregunta sus datos.",
                "nombre" to str("Nombre si el usuario lo dijo, o vacío")))
            .put(fn("info_persona", "Dice lo que SONI sabe de una persona que ya conoció.",
                "nombre" to str("Nombre de la persona")))
            .put(fn("tomar_foto", "Toma una o varias fotos con la cámara (enfoque y zoom automáticos) y las guarda.",
                "cantidad" to int("Cuántas fotos (1 por defecto; varias con distinto zoom)"),
                "segundos" to int("Cuenta regresiva antes de disparar, 0 si es inmediata"),
                "selfie" to bool("true para la cámara frontal")))
            .put(fn("grabar_video", "Graba un video de cierta duración y lo guarda.",
                "segundos" to int("Duración en segundos"),
                "selfie" to bool("true para la cámara frontal")))
            .put(fn("abrir_camara_app", "Solo abre la app de cámara, sin disparar."))
            .put(fn("describir_foto", "Describe en voz alta una foto: la última que tomó el usuario o la que comparte con SONI."))
            .put(fn("velocidad_internet", "Mide la velocidad de la conexión a internet y la dice."))
            .put(fn("leer_notificaciones", "Activa o desactiva que SONI lea en voz alta las notificaciones.",
                "activar" to bool("true para activar, false para desactivar")))
            .put(fn("modo_no_disponible", "Activa o desactiva el modo en que SONI responde por el usuario en WhatsApp si insisten.",
                "activar" to bool("true para activar, false para desactivar")))
            .put(fn("contestar_llamada", "Contesta la llamada que está entrando."))
            .put(fn("colgar_llamada", "Cuelga la llamada actual o rechaza la entrante."))
            .put(fn("leer_documento", "Busca en el teléfono un libro o documento (PDF, Word, TXT) y lo lee en voz alta.",
                "nombre" to str("Título o parte del nombre del libro/documento")))
            .put(fn("resumir_documento", "Busca un documento del teléfono y dice de qué trata.",
                "nombre" to str("Título o parte del nombre")))
            .put(fn("saltar_en_lectura", "Salta a una parte del libro que se está leyendo.",
                "texto" to str("Tema o frase a buscar, o vacío"),
                "porcentaje" to int("Posición 0-100, o -1 si no aplica")))
            .put(fn("control_lectura", "Controla la lectura de un libro en curso.",
                "accion" to choice("Qué hacer", "pausar", "continuar", "detener", "adelantar", "repetir", "progreso")))
            .put(fn("responder", "Responde hablando: conversación, explicaciones o cuando no hay otra función adecuada.",
                "texto" to str("Respuesta corta en español para leer en voz alta")))
    }
}
