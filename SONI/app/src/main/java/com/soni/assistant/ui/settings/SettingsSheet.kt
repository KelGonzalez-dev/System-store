package com.soni.assistant.ui.settings

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.soni.assistant.accessibility.SoniAccessibilityService
import com.soni.assistant.data.settings.AvailabilitySettings
import com.soni.assistant.data.settings.SoniSettings
import com.soni.assistant.documents.DocumentFinder
import com.soni.assistant.notifications.SoniNotificationListener
import com.soni.assistant.ui.theme.SoniColors
import com.soni.assistant.voice.SpeechOutput
import kotlinx.coroutines.delay
import java.util.Locale

/** Ajustes de SONI: tu nombre, su voz y los permisos especiales que se activan en Ajustes de Android. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsSheet(onDismiss: () -> Unit) {
    val context = LocalContext.current
    val settings = remember { SoniSettings.get(context) }
    val current by settings.state.collectAsState()
    val availability = remember { AvailabilitySettings.get(context) }
    val avail by availability.state.collectAsState()

    // Motor de voz propio de esta pantalla, solo para listar voces y escuchar la vista previa.
    var voices by remember { mutableStateOf<List<Voice>>(emptyList()) }
    var preview by remember { mutableStateOf<TextToSpeech?>(null) }
    DisposableEffect(Unit) {
        var engine: TextToSpeech? = null
        engine = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                engine?.language = Locale.forLanguageTag("es")
                voices = engine?.let { SpeechOutput.spanishVoices(it) }.orEmpty()
                preview = engine
            }
        }
        onDispose { engine?.shutdown() }
    }

    fun speakPreview(voiceName: String) {
        val engine = preview ?: return
        SpeechOutput.pickVoice(engine, voiceName)?.let { engine.voice = it }
        engine.setPitch(current.pitch)
        engine.setSpeechRate(current.speechRate)
        val name = current.userName.ifBlank { "jefe" }
        engine.speak("Hola $name, soy SONI. ¿En qué te ayudo?", TextToSpeech.QUEUE_FLUSH, null, "preview")
    }

    // Estado de los permisos especiales, revisado cada segundo para reflejar lo que el usuario cambie en Ajustes.
    var autoSend by remember { mutableStateOf(false) }
    var notifications by remember { mutableStateOf(false) }
    var overlay by remember { mutableStateOf(false) }
    var files by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        while (true) {
            autoSend = SoniAccessibilityService.isEnabled(context)
            notifications = SoniNotificationListener.isEnabled(context)
            overlay = Settings.canDrawOverlays(context)
            files = DocumentFinder.hasAllFilesAccess()
            delay(1_000)
        }
    }

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = SoniColors.Card) {
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
        ) {
            Title("Ajustes de SONI")

            Section("Tu nombre")
            var nameText by remember { mutableStateOf(current.userName) }
            OutlinedTextField(
                value = nameText,
                onValueChange = {
                    nameText = it
                    settings.update { s -> s.copy(userName = it.trim()) }
                },
                label = { Text("Cómo quieres que te llame") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )

            Section("Voz")
            Text(
                "Toca una voz para escucharla. Google no indica cuáles son masculinas, así que prueba hasta " +
                    "encontrar la que te guste. Si no ves muchas, descarga más en Ajustes de Android → " +
                    "Salida de texto a voz → Motor de Google → Instalar datos de voz.",
                style = MaterialTheme.typography.bodySmall,
                color = SoniColors.TextSecondary,
            )
            Spacer(Modifier.height(8.dp))
            VoiceRow(
                label = "Automática (la más masculina que encuentre)",
                selected = current.voiceName.isBlank(),
                onClick = {
                    settings.update { it.copy(voiceName = "") }
                    speakPreview("")
                },
            )
            if (voices.isEmpty()) {
                Text("Cargando voces…", color = SoniColors.TextSecondary, modifier = Modifier.padding(8.dp))
            }
            voices.forEach { voice ->
                VoiceRow(
                    label = SpeechOutput.label(voice),
                    selected = voice.name == current.voiceName,
                    onClick = {
                        settings.update { it.copy(voiceName = voice.name) }
                        speakPreview(voice.name)
                    },
                )
            }

            Spacer(Modifier.height(12.dp))
            Text("Tono (más a la izquierda = más grave)", color = SoniColors.TextPrimary, style = MaterialTheme.typography.labelLarge)
            Slider(
                value = current.pitch,
                onValueChange = { v -> settings.update { it.copy(pitch = v) } },
                onValueChangeFinished = { speakPreview(current.voiceName) },
                valueRange = 0.6f..1.3f,
                colors = SliderDefaults.colors(thumbColor = SoniColors.Violet, activeTrackColor = SoniColors.Violet),
            )
            Text("Velocidad", color = SoniColors.TextPrimary, style = MaterialTheme.typography.labelLarge)
            Slider(
                value = current.speechRate,
                onValueChange = { v -> settings.update { it.copy(speechRate = v) } },
                onValueChangeFinished = { speakPreview(current.voiceName) },
                valueRange = 0.7f..1.5f,
                colors = SliderDefaults.colors(thumbColor = SoniColors.Violet, activeTrackColor = SoniColors.Violet),
            )

            Section("Notificaciones y mensajes")
            SwitchRow(
                title = "Leerme las notificaciones",
                detail = "SONI dice en voz alta las notificaciones que llegan.",
                checked = avail.readAloud,
                onCheckedChange = { on ->
                    if (on && !SoniNotificationListener.isEnabled(context)) SoniNotificationListener.openSettings(context)
                    else availability.update { it.copy(readAloud = on) }
                },
            )
            SwitchRow(
                title = "Burbuja flotante",
                detail = "Una bolita de partículas sobre las demás apps, con accesos rápidos.",
                checked = avail.bubble,
                onCheckedChange = { on ->
                    if (on && !android.provider.Settings.canDrawOverlays(context)) {
                        context.startActivity(
                            android.content.Intent(
                                android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                android.net.Uri.parse("package:${context.packageName}"),
                            ).addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                        )
                    } else {
                        availability.update { it.copy(bubble = on) }
                        if (on) com.soni.assistant.bubble.BubbleService.start(context)
                        else com.soni.assistant.bubble.BubbleService.stop(context)
                    }
                },
            )
            SwitchRow(
                title = "Modo no disponible",
                detail = "Si alguien te escribe más de ${avail.awayThreshold} veces por WhatsApp, SONI le responde por ti.",
                checked = avail.awayMode,
                onCheckedChange = { on ->
                    if (on && !SoniNotificationListener.isEnabled(context)) SoniNotificationListener.openSettings(context)
                    else availability.update { it.copy(awayMode = on) }
                },
            )
            if (avail.awayMode) {
                Spacer(Modifier.height(8.dp))
                var message by remember { mutableStateOf(avail.awayMessage) }
                OutlinedTextField(
                    value = message,
                    onValueChange = {
                        message = it
                        availability.update { s -> s.copy(awayMessage = it) }
                    },
                    label = { Text("Mensaje automático ({nombre} = tu nombre)") },
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Section("Música")
            SpotifyRow(context)

            Section("Permisos especiales")
            AccessRow(
                title = "Enviar mensajes solo",
                detail = "Para pulsar «Enviar» en WhatsApp por ti.",
                enabled = autoSend,
                onActivate = { SoniAccessibilityService.openSettings(context) },
            )
            AccessRow(
                title = "Acceso a notificaciones",
                detail = "Para música, leer notificaciones y modo no disponible.",
                enabled = notifications,
                onActivate = { SoniNotificationListener.openSettings(context) },
            )
            AccessRow(
                title = "Acceso a todos los archivos",
                detail = "Para buscar y leerte libros y documentos.",
                enabled = files,
                onActivate = { DocumentFinder.openAllFilesSettings(context) },
            )
            AccessRow(
                title = "Mostrar sobre otras apps",
                detail = "Para abrir apps cuando lo llamas desde otra pantalla.",
                enabled = overlay,
                onActivate = {
                    runCatching {
                        context.startActivity(
                            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
                                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        )
                    }
                },
            )
        }
    }
}

@Composable
private fun Title(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.titleLarge,
        color = SoniColors.TextPrimary,
        modifier = Modifier.semantics { heading() },
    )
}

@Composable
private fun Section(text: String) {
    Spacer(Modifier.height(20.dp))
    Text(
        text,
        style = MaterialTheme.typography.titleMedium,
        color = SoniColors.Lavender,
        modifier = Modifier.semantics { heading() },
    )
    Spacer(Modifier.height(8.dp))
}

@Composable
private fun VoiceRow(label: String, selected: Boolean, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(if (selected) SoniColors.Violet.copy(alpha = 0.18f) else SoniColors.Card)
            .clickable(onClick = onClick)
            .padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        RadioButton(
            selected = selected,
            onClick = onClick,
            colors = RadioButtonDefaults.colors(selectedColor = SoniColors.Violet),
        )
        Text(label, color = SoniColors.TextPrimary, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
private fun AccessRow(title: String, detail: String, enabled: Boolean, onActivate: () -> Unit) {
    val color = if (enabled) SoniColors.Success else SoniColors.Warning
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.10f))
            .padding(start = 14.dp, top = 8.dp, bottom = 8.dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title + if (enabled) " · activado" else "", style = MaterialTheme.typography.titleSmall, color = color)
            Text(detail, style = MaterialTheme.typography.bodySmall, color = SoniColors.TextSecondary)
        }
        if (!enabled) TextButton(onClick = onActivate) { Text("Activar") }
    }
}

@Composable
private fun SwitchRow(title: String, detail: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleSmall, color = SoniColors.TextPrimary)
            Text(detail, style = MaterialTheme.typography.bodySmall, color = SoniColors.TextSecondary)
        }
        Spacer(Modifier.width(12.dp))
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedTrackColor = SoniColors.Violet),
        )
    }
}

@Composable
private fun SpotifyRow(context: android.content.Context) {
    var loggedIn by remember { mutableStateOf(com.soni.assistant.spotify.SpotifyAuth.isLoggedIn(context)) }
    androidx.compose.runtime.LaunchedEffect(Unit) {
        while (true) {
            loggedIn = com.soni.assistant.spotify.SpotifyAuth.isLoggedIn(context)
            kotlinx.coroutines.delay(1_000)
        }
    }
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(Modifier.weight(1f)) {
            Text(
                if (loggedIn) "Spotify conectado" else "Conectar Spotify",
                style = MaterialTheme.typography.titleSmall,
                color = if (loggedIn) SoniColors.Success else SoniColors.TextPrimary,
            )
            Text(
                if (loggedIn) "SONI reproduce la canción exacta por debajo."
                else "Autoriza una vez para poner música sin abrir la app.",
                style = MaterialTheme.typography.bodySmall,
                color = SoniColors.TextSecondary,
            )
        }
        TextButton(onClick = {
            if (loggedIn) com.soni.assistant.spotify.SpotifyAuth.logout(context)
            else com.soni.assistant.spotify.SpotifyLoginActivity.start(context)
        }) { Text(if (loggedIn) "Desconectar" else "Conectar") }
    }
}
