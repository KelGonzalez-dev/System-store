package com.soni.assistant.ui.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.soni.assistant.data.memory.NoteStore
import com.soni.assistant.data.memory.PeopleStore
import com.soni.assistant.data.memory.ReminderStore
import com.soni.assistant.ui.theme.SoniColors
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

/** «Memoria»: lo que SONI recuerda — notas, personas conocidas y recordatorios pendientes. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemorySheet(onDismiss: () -> Unit) {
    val context = LocalContext.current

    val content by produceState<MemoryContent?>(initialValue = null) {
        value = withContext(Dispatchers.IO) {
            MemoryContent(
                notes = NoteStore.get(context).all().map { it.text },
                people = PeopleStore.get(context).all().map { p ->
                    buildString {
                        append(p.name)
                        p.relation?.let { append(" · $it") }
                        p.sign?.let { append(" · $it") }
                    }
                },
                reminders = ReminderStore.get(context).pending().map { r ->
                    val time = Instant.ofEpochMilli(r.atMillis).atZone(ZoneId.systemDefault())
                        .format(DateTimeFormatter.ofPattern("d MMM, h:mm a", Locale.forLanguageTag("es")))
                    "$time · ${r.text}"
                },
            )
        }
    }

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = SoniColors.Card) {
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .heightIn(max = 560.dp)
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp),
        ) {
            Text(
                "Memoria de SONI",
                style = MaterialTheme.typography.titleLarge,
                color = SoniColors.TextPrimary,
                modifier = Modifier.semantics { heading() },
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "Todo lo que SONI recuerda. Puedes pedirle por voz que lo cambie o lo borre.",
                style = MaterialTheme.typography.bodyMedium,
                color = SoniColors.TextSecondary,
            )
            Spacer(Modifier.height(16.dp))

            val c = content
            if (c == null) {
                Text("Cargando…", color = SoniColors.TextSecondary)
            } else {
                MemorySection("Personas que conoce", c.people, "Dile «conoce a…» para presentarle a alguien.")
                MemorySection("Notas", c.notes, "Dile «anota…» para guardar una nota.")
                MemorySection("Recordatorios", c.reminders, "Dile «recuérdame…» para crear uno.")
            }
        }
    }
}

@Composable
private fun MemorySection(title: String, items: List<String>, emptyHint: String) {
    Spacer(Modifier.height(16.dp))
    Text(title, style = MaterialTheme.typography.titleMedium, color = SoniColors.Lavender)
    Spacer(Modifier.height(6.dp))
    if (items.isEmpty()) {
        Text(emptyHint, style = MaterialTheme.typography.bodySmall, color = SoniColors.TextSecondary)
    } else {
        items.forEach { item ->
            Text(
                "• $item",
                style = MaterialTheme.typography.bodyMedium,
                color = SoniColors.TextPrimary,
                modifier = Modifier.padding(vertical = 3.dp).fillMaxWidth(),
            )
        }
    }
}

private data class MemoryContent(
    val notes: List<String>,
    val people: List<String>,
    val reminders: List<String>,
)
