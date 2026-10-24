package com.soni.assistant.ui.home

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.soni.assistant.ui.theme.SoniColors
import kotlin.math.cos
import kotlin.math.sin

/** Una sección de la app, representada como un nodo que orbita el núcleo. */
data class OrbitNode(val label: String, val icon: String, val color: Color, val onClick: () -> Unit)

/**
 * Los nodos giran lentamente alrededor del núcleo, en una órbita inclinada. Cada uno es tocable
 * y lleva a una sección. Es el menú principal de SONI: en vez de una barra, secciones orbitando.
 */
@Composable
fun OrbitNodes(
    nodes: List<OrbitNode>,
    radius: Dp,
    modifier: Modifier = Modifier,
    paused: Boolean = false,
) {
    val transition = rememberInfiniteTransition(label = "orbit")
    val angle by transition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(48_000, easing = LinearEasing), RepeatMode.Restart),
        label = "angle",
    )
    val baseAngle = if (paused) 0f else angle

    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        // Anillo de órbita tenue.
        Box(
            Modifier
                .fillMaxSize()
                .drawBehind {
                    val r = size.minDimension / 2f * 0.82f
                    drawCircle(
                        brush = Brush.sweepGradient(
                            listOf(
                                SoniColors.Violet.copy(alpha = 0.0f),
                                SoniColors.Cyan.copy(alpha = 0.25f),
                                SoniColors.Violet.copy(alpha = 0.0f),
                            )
                        ),
                        radius = r,
                        center = Offset(size.width / 2f, size.height / 2f),
                        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2f),
                    )
                }
        )

        nodes.forEachIndexed { i, node ->
            val a = Math.toRadians((baseAngle + i * 360.0 / nodes.size)).toFloat()
            // Órbita inclinada: el eje Y se achata para dar sensación 3D.
            val rx = radius.value
            val ry = radius.value * 0.42f
            val x = (cos(a) * rx).dp
            val y = (sin(a) * ry).dp
            // Los de atrás (parte superior de la elipse) se ven más pequeños y tenues.
            val front = (sin(a) + 1f) / 2f
            val nodeSize = (46 + 14 * front).dp
            NodeChip(node = node, size = nodeSize, alpha = 0.55f + 0.45f * front, modifier = Modifier.offset(x = x, y = y))
        }
    }
}

@Composable
private fun NodeChip(node: OrbitNode, size: Dp, alpha: Float, modifier: Modifier) {
    Column(
        modifier = modifier
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = node.onClick,
            ),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box(
            Modifier
                .size(size)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        listOf(node.color.copy(alpha = 0.38f * alpha), node.color.copy(alpha = 0.10f * alpha))
                    )
                )
                .drawBehind {
                    drawCircle(
                        brush = Brush.radialGradient(
                            listOf(node.color.copy(alpha = 0.5f * alpha), Color.Transparent),
                            radius = this.size.minDimension,
                        ),
                        radius = this.size.minDimension / 1.3f,
                    )
                },
            contentAlignment = Alignment.Center,
        ) {
            Text(node.icon, textAlign = TextAlign.Center)
        }
        Spacer(Modifier.height(3.dp))
        Text(
            node.label,
            style = MaterialTheme.typography.labelSmall,
            color = SoniColors.TextSecondary.copy(alpha = alpha),
        )
    }
}