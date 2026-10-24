package com.soni.assistant.ui.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.soni.assistant.data.settings.ProfileData
import com.soni.assistant.data.settings.UserProfile
import com.soni.assistant.ui.theme.SoniColors

/**
 * «Sobre ti»: lo que SONI sabe de ti para tratarte mejor. Se guarda al escribir y se le pasa
 * a la IA como contexto. Todo es opcional.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileSheet(onDismiss: () -> Unit) {
    val context = LocalContext.current
    val profile = remember { UserProfile.get(context) }
    val data by profile.state.collectAsState()

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = SoniColors.Card) {
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp),
        ) {
            Text(
                "Sobre ti",
                style = MaterialTheme.typography.titleLarge,
                color = SoniColors.TextPrimary,
                modifier = Modifier.semantics { heading() },
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "Cuéntale a SONI quién eres. Usará esto para tratarte mejor y recordar lo importante. " +
                    "Todo es opcional y se guarda solo en tu teléfono.",
                style = MaterialTheme.typography.bodyMedium,
                color = SoniColors.TextSecondary,
            )
            Spacer(Modifier.height(16.dp))

            Field("¿Cómo quieres que te llame?", data.nickname) { v -> profile.update { it.copy(nickname = v) } }
            Field("Edad", data.age, KeyboardType.Number) { v -> profile.update { it.copy(age = v) } }
            Field("¿A qué te dedicas?", data.occupation) { v -> profile.update { it.copy(occupation = v) } }
            Field("Ciudad", data.city) { v -> profile.update { it.copy(city = v) } }
            Field("¿Qué te gusta? (aficiones, música, comida…)", data.likes, lines = 2) { v -> profile.update { it.copy(likes = v) } }
            Field("¿Qué no te gusta?", data.dislikes, lines = 2) { v -> profile.update { it.copy(dislikes = v) } }
            Field("Salud a tener en cuenta (alergias, etc.)", data.health, lines = 2) { v -> profile.update { it.copy(health = v) } }
            Field("Algo que SONI deba recordar siempre", data.notes, lines = 3) { v -> profile.update { it.copy(notes = v) } }
        }
    }
}

@Composable
private fun Field(
    label: String,
    value: String,
    keyboardType: KeyboardType = KeyboardType.Text,
    lines: Int = 1,
    onChange: (String) -> Unit,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        singleLine = lines == 1,
        minLines = lines,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
    )
}
