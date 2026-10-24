package com.soni.assistant.ui.contacts

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.ContactsContract
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.LaunchedEffect
import kotlinx.coroutines.delay
import com.soni.assistant.accessibility.SoniAccessibilityService
import com.soni.assistant.data.contacts.ContactRole
import com.soni.assistant.data.contacts.ContactRoleStore
import com.soni.assistant.ui.icons.SoniIcons
import com.soni.assistant.ui.theme.SoniColors

private data class PickedContact(val name: String, val phone: String)

/**
 * «Mis contactos»: el usuario elige un contacto de su agenda y le pone un rol (Mamá, Jefa…).
 * Después «llama a mi mamá» o «dile a mi jefa que…» van directo a ese número.
 */
@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ContactRolesSheet(onDismiss: () -> Unit) {
    val context = LocalContext.current
    val store = remember { ContactRoleStore.get(context) }
    val roles by store.roles.collectAsState()

    var picked by remember { mutableStateOf<PickedContact?>(null) }
    var roleText by remember { mutableStateOf("") }
    var pickError by remember { mutableStateOf(false) }

    // Se comprueba cada segundo mientras la hoja está abierta, para reflejar el cambio al volver de Ajustes.
    var autoSendOn by remember { mutableStateOf(SoniAccessibilityService.isEnabled(context)) }
    LaunchedEffect(Unit) {
        while (true) {
            autoSendOn = SoniAccessibilityService.isEnabled(context)
            delay(1_000)
        }
    }

    // El selector de contactos del sistema da permiso temporal para leer el contacto elegido,
    // así que no hace falta el permiso de contactos para esto.
    val pickLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val uri: Uri = result.data?.data ?: return@rememberLauncherForActivityResult
        if (result.resultCode != Activity.RESULT_OK) return@rememberLauncherForActivityResult
        val contact = runCatching {
            context.contentResolver.query(
                uri,
                arrayOf(
                    ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    ContactsContract.CommonDataKinds.Phone.NUMBER,
                ),
                null, null, null,
            )?.use { c ->
                if (c.moveToFirst()) PickedContact(c.getString(0) ?: "", c.getString(1) ?: "") else null
            }
        }.getOrNull()
        if (contact == null || contact.phone.isBlank()) {
            pickError = true
        } else {
            picked = contact
            roleText = ""
        }
    }

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = SoniColors.Card) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 24.dp)) {
            Text(
                "Mis contactos",
                style = MaterialTheme.typography.titleLarge,
                color = SoniColors.TextPrimary,
                modifier = Modifier.semantics { heading() },
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "Asigna un rol y luego di «llama a mi mamá» o «dile a mi jefa que…».",
                style = MaterialTheme.typography.bodyMedium,
                color = SoniColors.TextSecondary,
            )
            Spacer(Modifier.height(16.dp))

            AutoSendRow(enabled = autoSendOn, onActivate = { SoniAccessibilityService.openSettings(context) })
            Spacer(Modifier.height(16.dp))

            if (roles.isEmpty()) {
                Text(
                    "Todavía no hay roles asignados.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SoniColors.TextSecondary,
                    modifier = Modifier.padding(vertical = 12.dp),
                )
            } else {
                LazyColumn(
                    modifier = Modifier.heightIn(max = 360.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    items(roles, key = { it.role }) { role ->
                        RoleRow(role = role, onRemove = { store.remove(role.role) })
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = {
                    pickLauncher.launch(
                        Intent(Intent.ACTION_PICK, ContactsContract.CommonDataKinds.Phone.CONTENT_URI)
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = SoniColors.Violet),
            ) {
                Text("Elegir contacto y asignar rol")
            }
        }
    }

    picked?.let { contact ->
        AlertDialog(
            onDismissRequest = { picked = null },
            title = { Text("¿Quién es ${contact.name} para ti?") },
            text = {
                Column {
                    Text(contact.phone, color = SoniColors.TextSecondary)
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = roleText,
                        onValueChange = { roleText = it },
                        label = { Text("Rol (por ejemplo: Mamá)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                    )
                    Spacer(Modifier.height(12.dp))
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        ContactRoleStore.SUGGESTED_ROLES.forEach { suggestion ->
                            Box(
                                Modifier
                                    .clip(RoundedCornerShape(50))
                                    .background(
                                        if (roleText == suggestion) SoniColors.Violet.copy(alpha = 0.35f)
                                        else SoniColors.Violet.copy(alpha = 0.12f)
                                    )
                                    .clickable { roleText = suggestion }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(suggestion, style = MaterialTheme.typography.labelLarge, color = SoniColors.TextPrimary)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(
                    enabled = roleText.isNotBlank(),
                    onClick = {
                        store.assign(roleText, contact.name, contact.phone)
                        picked = null
                    },
                ) { Text("Guardar") }
            },
            dismissButton = { TextButton(onClick = { picked = null }) { Text("Cancelar") } },
        )
    }

    if (pickError) {
        AlertDialog(
            onDismissRequest = { pickError = false },
            title = { Text("No pude leer ese contacto") },
            text = { Text("Asegúrate de elegir un contacto que tenga número de teléfono.") },
            confirmButton = { TextButton(onClick = { pickError = false }) { Text("Entendido") } },
        )
    }
}

@Composable
private fun RoleRow(role: ContactRole, onRemove: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SoniColors.Violet.copy(alpha = 0.08f))
            .padding(start = 14.dp, top = 10.dp, bottom = 10.dp, end = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(SoniColors.Violet.copy(alpha = 0.3f)),
            contentAlignment = Alignment.Center,
        ) {
            Text(role.role.take(1).uppercase(), color = SoniColors.TextPrimary)
        }
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(role.role, style = MaterialTheme.typography.titleSmall, color = SoniColors.TextPrimary)
            Text(
                "${role.contactName} · ${role.phone}",
                style = MaterialTheme.typography.bodySmall,
                color = SoniColors.TextSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        IconButton(onClick = onRemove) {
            Icon(SoniIcons.Close, contentDescription = "Quitar rol ${role.role}", tint = SoniColors.TextSecondary)
        }
    }
}

@Composable
private fun AutoSendRow(enabled: Boolean, onActivate: () -> Unit) {
    val color = if (enabled) SoniColors.Success else SoniColors.Warning
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.10f))
            .padding(start = 14.dp, top = 8.dp, bottom = 8.dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(
                if (enabled) "Envío automático activado" else "Envío automático desactivado",
                style = MaterialTheme.typography.titleSmall,
                color = color,
            )
            Text(
                if (enabled) "SONI pulsa «Enviar» en WhatsApp por ti."
                else "Activa «SONI: enviar mensajes» en Accesibilidad.",
                style = MaterialTheme.typography.bodySmall,
                color = SoniColors.TextSecondary,
            )
        }
        if (!enabled) {
            TextButton(onClick = onActivate) { Text("Activar") }
        }
    }
}
