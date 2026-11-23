package com.soni.assistant.ui.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.soni.assistant.ui.icons.SoniIcons
import com.soni.assistant.ui.theme.SoniColors

/** Una opción del menú (una sección de la app). */
data class OrbitNode(
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val color: Color,
    val onClick: () -> Unit,
)

/** Un grupo de opciones del menú, que se despliega para mostrar sus elementos. */
data class OptionGroup(
    val title: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val color: Color,
    val items: List<OrbitNode>,
)

/**
 * Menú principal de SONI en forma de desplegable de dos niveles, en vez de nodos orbitando:
 *  - Un botón «Opciones» que abre o cierra el panel.
 *  - Dentro, grupos (Tú, Ajustes, Sistema). Al tocar un grupo, se despliegan sus opciones.
 *
 * Cerrado por defecto, para que la pantalla se vea limpia.
 */
@Composable
fun OptionsMenu(groups: List<OptionGroup>, modifier: Modifier = Modifier) {
    var open by remember { mutableStateOf(false) }
    var expandedGroup by remember { mutableStateOf<String?>(null) }

    Column(modifier = modifier.fillMaxWidth()) {
        MenuButton(open = open) {
            open = !open
            if (!open) expandedGroup = null
        }

        AnimatedVisibility(
            visible = open,
            enter = fadeIn() + expandVertically(),
            exit = fadeOut() + shrinkVertically(),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(SoniColors.Card)
                    .padding(6.dp),
                verticalArrangement = Arrangement.spacedBy(2.dp),
            ) {
                groups.forEach { group ->
                    GroupRow(
                        group = group,
                        expanded = expandedGroup == group.title,
                        onClick = {
                            expandedGroup = if (expandedGroup == group.title) null else group.title
                        },
                    )
                    AnimatedVisibility(
                        visible = expandedGroup == group.title,
                        enter = fadeIn() + expandVertically(),
                        exit = fadeOut() + shrinkVertically(),
                    ) {
                        Column(
                            modifier = Modifier.padding(start = 10.dp, bottom = 4.dp),
                            verticalArrangement = Arrangement.spacedBy(2.dp),
                        ) {
                            group.items.forEach { item ->
                                ItemRow(item = item) {
                                    item.onClick()
                                    open = false
                                    expandedGroup = null
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MenuButton(open: Boolean, onClick: () -> Unit) {
    val rotation by animateFloatAsState(if (open) 180f else 0f, label = "chevron")
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Brush.linearGradient(listOf(SoniColors.Violet.copy(alpha = 0.28f), SoniColors.Cyan.copy(alpha = 0.22f))))
            .clickable(onClickLabel = if (open) "Cerrar opciones" else "Abrir opciones", role = Role.Button, onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(SoniIcons.Tune, contentDescription = null, tint = SoniColors.Lavender, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(12.dp))
        Text(
            text = "Opciones",
            style = MaterialTheme.typography.titleSmall.merge(
                TextStyle(fontWeight = FontWeight.Medium, letterSpacing = 1.sp)
            ),
            color = SoniColors.TextPrimary,
        )
        Spacer(Modifier.width(1.dp).weight(1f))
        Icon(
            SoniIcons.ChevronDown,
            contentDescription = null,
            tint = SoniColors.Lavender,
            modifier = Modifier.size(22.dp).rotate(rotation),
        )
    }
}

@Composable
private fun GroupRow(group: OptionGroup, expanded: Boolean, onClick: () -> Unit) {
    val rotation by animateFloatAsState(if (expanded) 180f else 0f, label = "groupChevron")
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClickLabel = group.title, role = Role.Button, onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconBadge(icon = group.icon, tint = group.color)
        Spacer(Modifier.width(12.dp))
        Text(
            text = group.title,
            style = MaterialTheme.typography.bodyLarge,
            color = SoniColors.TextPrimary,
        )
        Spacer(Modifier.weight(1f))
        Icon(
            SoniIcons.ChevronDown,
            contentDescription = null,
            tint = SoniColors.TextSecondary,
            modifier = Modifier.size(20.dp).rotate(rotation),
        )
    }
}

@Composable
private fun ItemRow(item: OrbitNode, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SoniColors.Background.copy(alpha = 0.4f))
            .clickable(onClickLabel = item.label, role = Role.Button, onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 11.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconBadge(icon = item.icon, tint = item.color)
        Spacer(Modifier.width(12.dp))
        Text(
            text = item.label,
            style = MaterialTheme.typography.bodyMedium,
            color = SoniColors.TextSecondary,
        )
    }
}

@Composable
private fun IconBadge(icon: androidx.compose.ui.graphics.vector.ImageVector, tint: Color) {
    Box(
        modifier = Modifier
            .size(32.dp)
            .clip(CircleShape)
            .background(tint.copy(alpha = 0.18f)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
    }
}
