package com.soni.assistant.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.soni.assistant.core.ActionLogEntry
import com.soni.assistant.core.ExecutionState
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.ui.theme.SoniColors
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/** Registro de acciones: qué hizo SONI, cuándo y con qué resultado. Se puede borrar. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActionLogSheet(entries: List<ActionLogEntry>, onClear: () -> Unit, onDismiss: () -> Unit) {
    var confirmClear by rememberSaveable { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = SoniColors.Card) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "Registro de acciones",
                    style = MaterialTheme.typography.titleMedium,
                    color = SoniColors.TextPrimary,
                    modifier = Modifier.weight(1f).semantics { heading() },
                )
                if (entries.isNotEmpty()) {
                    TextButton(onClick = { confirmClear = true }) { Text("Borrar registro") }
                }
            }
            Text(
                "Solo guarda qué herramienta se usó, cuándo y el resultado. Nunca el texto de tus órdenes " +
                    "ni las respuestas. Se queda en el teléfono.",
                style = MaterialTheme.typography.labelSmall,
                color = SoniColors.TextSecondary,
                modifier = Modifier.padding(bottom = 12.dp),
            )
            if (entries.isEmpty()) {
                Text(
                    "Todavía no hay acciones registradas.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SoniColors.TextSecondary,
                    modifier = Modifier.padding(vertical = 24.dp),
                )
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.heightIn(max = 480.dp),
                ) {
                    items(entries) { LogRow(it) }
                }
            }
        }
    }

    if (confirmClear) {
        AlertDialog(
            onDismissRequest = { confirmClear = false },
            containerColor = SoniColors.Card,
            title = { Text("Borrar el registro") },
            text = { Text("Se eliminarán todas las entradas del registro de acciones. No se puede deshacer.") },
            confirmButton = {
                TextButton(onClick = {
                    confirmClear = false
                    onClear()
                }) { Text("Borrar") }
            },
            dismissButton = {
                TextButton(onClick = { confirmClear = false }) { Text("Cancelar") }
            },
        )
    }
}

@Composable
private fun LogRow(entry: ActionLogEntry) {
    val color = stateColor(entry.state)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SoniColors.SurfaceAlt)
            .padding(horizontal = 14.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(color))
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(entry.actionLabel, style = MaterialTheme.typography.bodyMedium, color = SoniColors.TextPrimary)
            Text(
                "${entry.toolName} · riesgo ${riskLabel(entry.riskLevel)} · ${stateLabel(entry.state)}",
                style = MaterialTheme.typography.labelSmall,
                color = SoniColors.TextSecondary,
            )
        }
        Text(
            TIME_FORMAT.format(Instant.ofEpochMilli(entry.timestampMillis).atZone(ZoneId.systemDefault())),
            style = MaterialTheme.typography.labelSmall,
            color = SoniColors.TextSecondary,
        )
    }
}

private val TIME_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("d MMM, HH:mm", SoniLocale.locale)

private fun riskLabel(risk: RiskLevel): String = when (risk) {
    RiskLevel.LOW -> "bajo"
    RiskLevel.MEDIUM -> "medio"
    RiskLevel.HIGH -> "alto"
}

private fun stateLabel(state: ExecutionState): String = when (state) {
    ExecutionState.SUCCESS -> "completada"
    ExecutionState.FAILED -> "no realizada"
    ExecutionState.NEEDS_PERMISSION -> "faltaba un permiso"
    ExecutionState.NEEDS_CONFIRMATION -> "pidió confirmación"
    ExecutionState.PENDING, ExecutionState.RUNNING -> "en curso"
}

private fun stateColor(state: ExecutionState) = when (state) {
    ExecutionState.SUCCESS -> SoniColors.Success
    ExecutionState.FAILED -> SoniColors.Error
    ExecutionState.NEEDS_PERMISSION, ExecutionState.NEEDS_CONFIRMATION -> SoniColors.Warning
    ExecutionState.PENDING, ExecutionState.RUNNING -> SoniColors.Cyan
}
