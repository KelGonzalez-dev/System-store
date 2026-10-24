package com.soni.assistant.ui.home

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.soni.assistant.ui.icons.SoniIcons
import com.soni.assistant.ui.theme.SoniColors
import com.soni.assistant.voice.WakeWordNotifications
import com.soni.assistant.voice.WakeWordState

@Composable
fun HomeScreen(viewModel: HomeViewModel) {
    val state by viewModel.uiState.collectAsState()
    val speaking by viewModel.isSpeaking.collectAsState()
    val wakeWordState by viewModel.wakeWordState.collectAsState()
    val actionLog by viewModel.actionLogEntries.collectAsState()
    val context = LocalContext.current
    val keyboard = LocalSoftwareKeyboardController.current

    var input by rememberSaveable { mutableStateOf("") }
    var showMicExplanation by rememberSaveable { mutableStateOf(false) }
    var showMicBlocked by rememberSaveable { mutableStateOf(false) }
    var showBackgroundExplanation by rememberSaveable { mutableStateOf(false) }
    var showActionLog by rememberSaveable { mutableStateOf(false) }
    var showContacts by rememberSaveable { mutableStateOf(false) }
    var showSettings by rememberSaveable { mutableStateOf(false) }
    var showProfile by rememberSaveable { mutableStateOf(false) }
    var showMemory by rememberSaveable { mutableStateOf(false) }
    val availability = remember { com.soni.assistant.data.settings.AvailabilitySettings.get(context) }
    val availState by availability.state.collectAsState()

    // Permisos que pide una herramienta justo cuando se usa (en contexto, nunca al arrancar).
    val toolPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { results -> viewModel.onPermissionsResult(allGranted = results.values.all { it }) }
    LaunchedEffect(state.permissionRequest) {
        state.permissionRequest?.let { toolPermissionLauncher.launch(it.permissions.toTypedArray()) }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            viewModel.startListening()
        } else {
            val activity = context.findActivity()
            // Justo después de una negativa, si Android ya no deja mostrar explicación,
            // el permiso quedó bloqueado («No volver a preguntar»).
            val blocked = activity != null &&
                !ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.RECORD_AUDIO)
            viewModel.onMicPermissionDenied(permanently = blocked)
            if (blocked) showMicBlocked = true
        }
    }

    // Activar la escucha en segundo plano: micrófono (obligatorio) y notificaciones (recomendado).
    val notificationLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { viewModel.enableBackgroundListening() }
    val backgroundMicLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            if (WakeWordNotifications.canPostNotifications(context)) {
                viewModel.enableBackgroundListening()
            } else {
                notificationLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        } else {
            val activity = context.findActivity()
            val blocked = activity != null &&
                !ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.RECORD_AUDIO)
            viewModel.onMicPermissionDenied(permanently = blocked)
            if (blocked) showMicBlocked = true
        }
    }

    val listening = state.status == AssistantStatus.LISTENING
    val onMicClick: () -> Unit = {
        when {
            listening -> viewModel.stopListening()
            speaking -> {
                viewModel.stopSpeaking()
                if (hasMicPermission(context)) viewModel.startListening() else showMicExplanation = true
            }
            hasMicPermission(context) -> viewModel.startListening()
            else -> showMicExplanation = true
        }
    }
    val submit: () -> Unit = {
        if (input.isNotBlank()) {
            viewModel.submitText(input)
            input = ""
            keyboard?.hide()
        }
    }

    val imeVisible = WindowInsets.ime.getBottom(LocalDensity.current) > 0
    val orbSize by animateDpAsState(if (imeVisible) 88.dp else 196.dp, label = "orbSize")
    val reduceMotion = rememberReduceMotion()
    val orbState = when {
        speaking -> OrbState.SPEAKING
        else -> when (state.status) {
            AssistantStatus.IDLE -> OrbState.IDLE
            AssistantStatus.LISTENING -> OrbState.LISTENING
            AssistantStatus.PROCESSING -> OrbState.PROCESSING
            AssistantStatus.SUCCESS -> OrbState.SUCCESS
            AssistantStatus.ERROR -> OrbState.ERROR
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SoniColors.Background)
            .drawBehind {
                // Halo violeta tenue detrás del núcleo.
                val glowCenter = Offset(size.width / 2f, size.height * 0.2f)
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(SoniColors.Violet.copy(alpha = 0.14f), Color.Transparent),
                        center = glowCenter,
                        radius = size.width,
                    ),
                    radius = size.width,
                    center = glowCenter,
                )
            }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(horizontal = 20.dp)
        ) {
            // Cabecera mínima: el nombre y el estado. El menú vive en los nodos que orbitan el núcleo.
            CoreHeader(label = statusLabel(state.status, speaking), color = statusColor(state.status, speaking))

            val nodes = listOf(
                OrbitNode("Sobre ti", "\uD83D\uDC64", SoniColors.Cyan) { showProfile = true },
                OrbitNode("Personas", "\uD83D\uDC65", SoniColors.Violet) { showContacts = true },
                OrbitNode("Voz", "\uD83C\uDF99", SoniColors.Lavender) { showSettings = true },
                OrbitNode("Memoria", "\uD83E\uDDE0", SoniColors.Cyan) { showMemory = true },
                OrbitNode("Permisos", "\uD83D\uDD12", SoniColors.Violet) { showSettings = true },
                OrbitNode("Actividad", "\u26A1", SoniColors.Lavender) { showActionLog = true },
                OrbitNode(
                    label = if (availState.bubble) "Burbuja: on" else "Burbuja: off",
                    icon = "\uD83D\uDFE3",
                    color = if (availState.bubble) SoniColors.Cyan else SoniColors.TextSecondary,
                ) {
                    val turnOn = !availState.bubble
                    if (turnOn && !android.provider.Settings.canDrawOverlays(context)) {
                        context.startActivity(
                            Intent(
                                android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                Uri.parse("package:${context.packageName}"),
                            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        )
                    } else {
                        availability.update { it.copy(bubble = turnOn) }
                        if (turnOn) com.soni.assistant.bubble.BubbleService.start(context)
                        else com.soni.assistant.bubble.BubbleService.stop(context)
                    }
                },
            )

            // El núcleo con sus nodos orbitando. Se encoge cuando se abre el teclado.
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(if (imeVisible) 110.dp else 320.dp),
                contentAlignment = Alignment.Center,
            ) {
                if (!imeVisible) {
                    OrbitNodes(
                        nodes = nodes,
                        radius = 140.dp,
                        paused = reduceMotion,
                        modifier = Modifier.fillMaxSize(),
                    )
                }
                SoniOrb(
                    state = orbState,
                    micLevel = state.micLevel,
                    reduceMotion = reduceMotion,
                    modifier = Modifier.size(orbSize),
                )
            }

            StatusBlock(state = state, speaking = speaking)
            PrivacyIndicator(listening = listening, wakeWordState = wakeWordState)
            BackgroundListeningRow(
                wakeWordState = wakeWordState,
                onToggle = { enable ->
                    if (enable) showBackgroundExplanation = true else viewModel.disableBackgroundListening()
                },
            )

            Conversation(
                messages = state.messages,
                modifier = Modifier
                    .weight(1f)
                    .padding(top = 12.dp),
            )

            InputBar(
                value = input,
                onValueChange = { input = it },
                onSubmit = submit,
                listening = listening,
                voiceAvailable = state.voiceInputAvailable,
                onMicClick = onMicClick,
            )
        }
    }

    if (showMicExplanation) {
        AlertDialog(
            onDismissRequest = { showMicExplanation = false },
            containerColor = SoniColors.Card,
            title = { Text("Permiso de micrófono") },
            text = {
                Text(
                    "SONI usa el micrófono solo mientras pulsas el botón, para escuchar tu orden. " +
                        "El audio lo transcribe el servicio de reconocimiento de voz de tu teléfono, " +
                        "que puede usar internet. SONI no guarda grabaciones."
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    showMicExplanation = false
                    permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                }) { Text("Continuar") }
            },
            dismissButton = {
                TextButton(onClick = { showMicExplanation = false }) { Text("Ahora no") }
            },
        )
    }

    state.pendingConfirmation?.let { request ->
        AlertDialog(
            onDismissRequest = viewModel::cancelPendingAction,
            containerColor = SoniColors.Card,
            icon = { Icon(SoniIcons.Warning, contentDescription = null, tint = SoniColors.Warning) },
            title = { Text("Confirmar acción") },
            text = { Text(request.message) },
            confirmButton = {
                TextButton(onClick = viewModel::confirmPendingAction) { Text("Confirmar") }
            },
            dismissButton = {
                TextButton(onClick = viewModel::cancelPendingAction) { Text("Cancelar") }
            },
        )
    }

    if (showProfile) {
        com.soni.assistant.ui.profile.ProfileSheet(onDismiss = { showProfile = false })
    }

    if (showMemory) {
        com.soni.assistant.ui.profile.MemorySheet(onDismiss = { showMemory = false })
    }

    if (showSettings) {
        com.soni.assistant.ui.settings.SettingsSheet(onDismiss = { showSettings = false })
    }

    if (showContacts) {
        com.soni.assistant.ui.contacts.ContactRolesSheet(onDismiss = { showContacts = false })
    }

    if (showActionLog) {
        ActionLogSheet(
            entries = actionLog,
            onClear = viewModel::clearActionLog,
            onDismiss = { showActionLog = false },
        )
    }

    if (showBackgroundExplanation) {
        AlertDialog(
            onDismissRequest = { showBackgroundExplanation = false },
            containerColor = SoniColors.Card,
            title = { Text("Escuchar «SONI» en segundo plano") },
            text = {
                Text(
                    "SONI mantendrá el micrófono abierto para reconocer la palabra «SONI». Esa detección " +
                        "la hace un modelo de voz dentro del teléfono, sin internet, y el audio no se guarda. " +
                        "Verás una notificación permanente y el indicador de micrófono de Android. " +
                        "Después del tono, tu orden la transcribe el servicio de voz del teléfono, como con el botón. " +
                        "Consume batería; puedes detenerla aquí, en la notificación o en los ajustes rápidos."
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    showBackgroundExplanation = false
                    when {
                        !hasMicPermission(context) -> backgroundMicLauncher.launch(Manifest.permission.RECORD_AUDIO)
                        !WakeWordNotifications.canPostNotifications(context) ->
                            notificationLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                        else -> viewModel.enableBackgroundListening()
                    }
                }) { Text("Activar") }
            },
            dismissButton = {
                TextButton(onClick = { showBackgroundExplanation = false }) { Text("Ahora no") }
            },
        )
    }

    if (showMicBlocked) {
        AlertDialog(
            onDismissRequest = { showMicBlocked = false },
            containerColor = SoniColors.Card,
            title = { Text("Micrófono bloqueado") },
            text = {
                Text(
                    "Android ya no mostrará la solicitud de permiso. Para hablar con SONI, " +
                        "activa el micrófono en Ajustes > Aplicaciones > SONI > Permisos. " +
                        "Mientras tanto, puedes escribir tus órdenes."
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    showMicBlocked = false
                    context.startActivity(
                        Intent(
                            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.fromParts("package", context.packageName, null),
                        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    )
                }) { Text("Abrir ajustes") }
            },
            dismissButton = {
                TextButton(onClick = { showMicBlocked = false }) { Text("Cerrar") }
            },
        )
    }
}

@Composable
private fun CoreHeader(label: String, color: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = "SONI",
            style = MaterialTheme.typography.titleLarge.merge(
                TextStyle(
                    brush = Brush.linearGradient(listOf(SoniColors.Lavender, SoniColors.Cyan)),
                    letterSpacing = 10.sp,
                    fontWeight = FontWeight.Light,
                )
            ),
            modifier = Modifier.semantics { heading() },
        )
        Spacer(Modifier.weight(1f))
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(50))
                .background(color.copy(alpha = 0.14f))
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(color)
            )
            Spacer(Modifier.width(8.dp))
            Text(text = label, style = MaterialTheme.typography.labelMedium, color = color)
        }
    }
}

@Composable
private fun StatusBlock(state: HomeUiState, speaking: Boolean) {
    val detail = when {
        state.partialTranscript.isNotBlank() -> "«${state.partialTranscript}»"
        state.statusDetail != null -> state.statusDetail
        state.status == AssistantStatus.LISTENING -> "Di tu orden; pulsa el botón otra vez para terminar."
        state.status == AssistantStatus.IDLE && !speaking -> "Pulsa el micrófono o escribe una orden."
        else -> null
    }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = statusLabel(state.status, speaking),
            style = MaterialTheme.typography.titleMedium,
            color = SoniColors.TextPrimary,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
        )
        if (detail != null) {
            Text(
                text = detail,
                style = MaterialTheme.typography.bodyMedium,
                color = SoniColors.TextSecondary,
                textAlign = TextAlign.Center,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

/** Muestra el estado real del micrófono y dónde se procesan los datos. */
@Composable
private fun PrivacyIndicator(listening: Boolean, wakeWordState: WakeWordState) {
    val color = when {
        listening -> SoniColors.Error
        wakeWordState == WakeWordState.ListeningCommand -> SoniColors.Error
        wakeWordState == WakeWordState.Waiting -> SoniColors.Warning
        else -> SoniColors.TextSecondary
    }
    val text = when {
        listening || wakeWordState == WakeWordState.ListeningCommand ->
            "Micrófono activo. La voz la transcribe el servicio del teléfono."
        wakeWordState == WakeWordState.Waiting ->
            "Micrófono activo esperando «SONI». Se procesa en el teléfono, sin internet."
        else -> "Micrófono apagado. Las órdenes se resuelven en el teléfono."
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 10.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
        Spacer(Modifier.width(8.dp))
        Text(text = text, style = MaterialTheme.typography.labelSmall, color = color)
    }
}

@Composable
private fun BackgroundListeningRow(wakeWordState: WakeWordState, onToggle: (Boolean) -> Unit) {
    val context = LocalContext.current
    val running = wakeWordState !is WakeWordState.Off && wakeWordState !is WakeWordState.Failed
    val detail = when (wakeWordState) {
        WakeWordState.Off -> "Apagada. Actívala para llamarme diciendo «SONI»."
        WakeWordState.Loading -> "Preparando el modelo de voz local…"
        WakeWordState.Waiting -> "Di «SONI», espera el tono y di tu orden."
        WakeWordState.Paused -> "En pausa mientras usas el micrófono aquí."
        WakeWordState.ListeningCommand -> "Te escucho."
        WakeWordState.Processing -> "Procesando…"
        is WakeWordState.Responded -> wakeWordState.message
        is WakeWordState.Failed -> wakeWordState.message
    }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 12.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(SoniColors.Card)
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    text = "Escuchar «SONI» en segundo plano",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SoniColors.TextPrimary,
                )
                Text(
                    text = detail,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (wakeWordState is WakeWordState.Failed) SoniColors.Error else SoniColors.TextSecondary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Spacer(Modifier.width(12.dp))
            Switch(checked = running, onCheckedChange = onToggle)
        }
        if (running && !isIgnoringBatteryOptimizations(context)) {
            TextButton(
                onClick = {
                    context.startActivity(
                        Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    )
                },
                contentPadding = PaddingValues(0.dp),
            ) {
                Text(
                    "Tu teléfono puede cerrarme para ahorrar batería. Permitir sin restricciones",
                    style = MaterialTheme.typography.labelSmall,
                    color = SoniColors.Cyan,
                )
            }
        }
    }
}

private fun isIgnoringBatteryOptimizations(context: Context): Boolean =
    context.getSystemService(PowerManager::class.java)?.isIgnoringBatteryOptimizations(context.packageName) == true

@Composable
private fun Conversation(messages: List<ChatMessage>, modifier: Modifier = Modifier) {
    val listState = rememberLazyListState()
    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) listState.animateScrollToItem(messages.lastIndex)
    }
    LazyColumn(
        state = listState,
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        contentPadding = PaddingValues(vertical = 8.dp),
    ) {
        items(messages, key = { it.id }) { message -> MessageBubble(message) }
    }
}

@Composable
private fun MessageBubble(message: ChatMessage) {
    val isUser = message.kind == MessageKind.USER
    val shape = RoundedCornerShape(
        topStart = 20.dp,
        topEnd = 20.dp,
        bottomStart = if (isUser) 20.dp else 6.dp,
        bottomEnd = if (isUser) 6.dp else 20.dp,
    )
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start,
    ) {
        Column(
            modifier = Modifier
                .widthIn(max = 320.dp)
                .clip(shape)
                .background(if (isUser) SoniColors.Violet.copy(alpha = 0.22f) else SoniColors.Card)
                .border(1.dp, if (isUser) SoniColors.Violet.copy(alpha = 0.35f) else SoniColors.Outline, shape)
                .padding(horizontal = 14.dp, vertical = 10.dp)
                .semantics(mergeDescendants = true) { },
        ) {
            if (!isUser) {
                Text("SONI", style = MaterialTheme.typography.labelSmall, color = SoniColors.Lavender)
                Spacer(Modifier.size(2.dp))
            }
            Text(message.text, style = MaterialTheme.typography.bodyLarge, color = SoniColors.TextPrimary)
            message.actionLabel?.let { label -> ActionTag(label = label, kind = message.kind) }
        }
    }
}

@Composable
private fun ActionTag(label: String, kind: MessageKind) {
    val (icon: ImageVector, color: Color) = when (kind) {
        MessageKind.SUCCESS -> SoniIcons.CheckCircle to SoniColors.Success
        MessageKind.ERROR -> SoniIcons.Warning to SoniColors.Warning
        else -> SoniIcons.Info to SoniColors.Cyan
    }
    Row(
        modifier = Modifier.padding(top = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(14.dp))
        Spacer(Modifier.width(6.dp))
        Text(label, style = MaterialTheme.typography.labelSmall, color = color)
    }
}

@Composable
private fun InputBar(
    value: String,
    onValueChange: (String) -> Unit,
    onSubmit: () -> Unit,
    listening: Boolean,
    voiceAvailable: Boolean,
    onMicClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.weight(1f),
            placeholder = { Text("Escribe una orden") },
            singleLine = true,
            shape = RoundedCornerShape(24.dp),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
            keyboardActions = KeyboardActions(onSend = { onSubmit() }),
            trailingIcon = {
                IconButton(onClick = onSubmit, enabled = value.isNotBlank()) {
                    Icon(SoniIcons.Send, contentDescription = "Enviar orden")
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = SoniColors.TextPrimary,
                unfocusedTextColor = SoniColors.TextPrimary,
                focusedContainerColor = SoniColors.Card,
                unfocusedContainerColor = SoniColors.Card,
                focusedBorderColor = SoniColors.Violet,
                unfocusedBorderColor = SoniColors.Outline,
                cursorColor = SoniColors.Cyan,
                focusedPlaceholderColor = SoniColors.TextSecondary,
                unfocusedPlaceholderColor = SoniColors.TextSecondary,
                focusedTrailingIconColor = SoniColors.Cyan,
                unfocusedTrailingIconColor = SoniColors.Lavender,
                disabledTrailingIconColor = SoniColors.TextSecondary.copy(alpha = 0.4f),
            ),
        )
        Spacer(Modifier.width(12.dp))
        MicButton(listening = listening, voiceAvailable = voiceAvailable, onClick = onMicClick)
    }
}

@Composable
private fun MicButton(listening: Boolean, voiceAvailable: Boolean, onClick: () -> Unit) {
    val description = if (listening) "Terminar de hablar" else "Hablar con SONI"
    val brush = when {
        listening -> SolidColor(SoniColors.Error)
        voiceAvailable -> Brush.linearGradient(listOf(SoniColors.Violet, SoniColors.Cyan))
        else -> SolidColor(SoniColors.SurfaceAlt)
    }
    Box(
        modifier = Modifier
            .size(60.dp)
            .clip(CircleShape)
            .background(brush)
            .clickable(onClickLabel = description, role = Role.Button, onClick = onClick)
            .semantics { this.contentDescription = description },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            imageVector = if (listening) SoniIcons.Close else SoniIcons.Mic,
            contentDescription = null,
            tint = Color.White,
            modifier = Modifier.size(28.dp),
        )
    }
}

private fun statusLabel(status: AssistantStatus, speaking: Boolean): String =
    if (speaking) {
        "Hablando"
    } else {
        when (status) {
            AssistantStatus.IDLE -> "En espera"
            AssistantStatus.LISTENING -> "Te escucho"
            AssistantStatus.PROCESSING -> "Procesando"
            AssistantStatus.SUCCESS -> "Acción completada"
            AssistantStatus.ERROR -> "No se completó"
        }
    }

private fun statusColor(status: AssistantStatus, speaking: Boolean): Color =
    if (speaking) {
        SoniColors.Lavender
    } else {
        when (status) {
            AssistantStatus.IDLE -> SoniColors.TextSecondary
            AssistantStatus.LISTENING -> SoniColors.Cyan
            AssistantStatus.PROCESSING -> SoniColors.Lavender
            AssistantStatus.SUCCESS -> SoniColors.Success
            AssistantStatus.ERROR -> SoniColors.Warning
        }
    }

private fun hasMicPermission(context: Context): Boolean =
    ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

private fun Context.findActivity(): Activity? {
    var current: Context? = this
    while (current is ContextWrapper) {
        if (current is Activity) return current
        current = current.baseContext
    }
    return null
}
