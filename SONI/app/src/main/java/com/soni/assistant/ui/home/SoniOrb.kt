package com.soni.assistant.ui.home

import android.provider.Settings
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.clearAndSetSemantics
import com.soni.assistant.ui.theme.SoniColors
import kotlin.math.cos
import kotlin.math.sin

enum class OrbState { IDLE, LISTENING, PROCESSING, SPEAKING, SUCCESS, ERROR }

/** true si el usuario desactivó las animaciones del sistema (Opciones de accesibilidad/desarrollador). */
@Composable
fun rememberReduceMotion(): Boolean {
    val context = LocalContext.current
    return remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

/**
 * Núcleo visual de SONI: una esfera abstracta azul-violeta dibujada con Canvas.
 * Es decorativa para lectores de pantalla; el estado se anuncia en el texto de estado.
 */
@Composable
fun SoniOrb(
    state: OrbState,
    micLevel: Float,
    reduceMotion: Boolean,
    modifier: Modifier = Modifier,
) {
    val levelState = animateFloatAsState(
        targetValue = if (state == OrbState.LISTENING) micLevel else 0f,
        animationSpec = tween(durationMillis = 120),
        label = "micLevel",
    )

    val rotationState: State<Float>
    val pulseState: State<Float>
    if (reduceMotion) {
        rotationState = remember { mutableFloatStateOf(0f) }
        pulseState = remember { mutableFloatStateOf(0.5f) }
    } else {
        val transition = rememberInfiniteTransition(label = "soniOrb")
        rotationState = transition.animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(
                tween(if (state == OrbState.PROCESSING) 1_400 else 12_000, easing = LinearEasing)
            ),
            label = "rotation",
        )
        pulseState = transition.animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                tween(
                    durationMillis = when (state) {
                        OrbState.LISTENING -> 700
                        OrbState.SPEAKING -> 480
                        OrbState.PROCESSING -> 900
                        else -> 2_800
                    },
                    easing = FastOutSlowInEasing,
                ),
                repeatMode = RepeatMode.Reverse,
            ),
            label = "pulse",
        )
    }

    val ringColors = when (state) {
        OrbState.SUCCESS -> listOf(SoniColors.Success, SoniColors.Cyan, SoniColors.Violet, SoniColors.Success)
        OrbState.ERROR -> listOf(SoniColors.Error, SoniColors.Violet, SoniColors.Lavender, SoniColors.Error)
        else -> listOf(SoniColors.Cyan, SoniColors.Violet, SoniColors.Lavender, SoniColors.Cyan)
    }
    val amplitude = when (state) {
        OrbState.LISTENING -> 0.05f
        OrbState.SPEAKING -> 0.07f
        OrbState.PROCESSING -> 0.03f
        else -> 0.025f
    }

    Canvas(modifier = modifier.clearAndSetSemantics { }) {
        val radius = size.minDimension / 2f
        val c = center
        val pulse = pulseState.value
        val rotation = rotationState.value
        val level = levelState.value

        // Resplandor exterior.
        val glowColor = if (state == OrbState.ERROR) SoniColors.Error else SoniColors.Violet
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(glowColor.copy(alpha = 0.30f + 0.15f * pulse), Color.Transparent),
                center = c,
                radius = radius,
            ),
            radius = radius,
            center = c,
        )

        // Anillo con gradiente que gira.
        val ringRadius = radius * 0.80f * (1f + amplitude * pulse * 0.5f)
        rotate(degrees = rotation, pivot = c) {
            drawCircle(
                brush = Brush.sweepGradient(ringColors, center = c),
                radius = ringRadius,
                center = c,
                style = Stroke(width = radius * 0.022f),
            )
        }

        // Arco de «procesando».
        if (state == OrbState.PROCESSING) {
            rotate(degrees = rotation * 2f, pivot = c) {
                drawArc(
                    color = SoniColors.Cyan,
                    startAngle = 0f,
                    sweepAngle = 80f,
                    useCenter = false,
                    topLeft = Offset(c.x - ringRadius, c.y - ringRadius),
                    size = Size(ringRadius * 2f, ringRadius * 2f),
                    style = Stroke(width = radius * 0.045f, cap = StrokeCap.Round),
                )
            }
        }

        // Esfera central; al escuchar, crece con el volumen de la voz.
        val coreRadius = radius * 0.56f * (1f + amplitude * pulse + level * 0.12f)
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(SoniColors.Lavender, SoniColors.Violet, SoniColors.DeepViolet, SoniColors.Background),
                center = c + Offset(-coreRadius * 0.30f, -coreRadius * 0.35f),
                radius = coreRadius * 1.45f,
            ),
            radius = coreRadius,
            center = c,
        )

        // Corriente azul que orbita dentro de la esfera.
        val angle = Math.toRadians(rotation.toDouble())
        val swirlCenter = c + Offset(
            (cos(angle) * coreRadius * 0.38f).toFloat(),
            (sin(angle) * coreRadius * 0.38f).toFloat(),
        )
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(SoniColors.Cyan.copy(alpha = 0.55f), Color.Transparent),
                center = swirlCenter,
                radius = coreRadius * 0.75f,
            ),
            radius = coreRadius,
            center = c,
        )

        // Brillo superior.
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(Color.White.copy(alpha = 0.30f), Color.Transparent),
                center = c + Offset(-coreRadius * 0.35f, -coreRadius * 0.42f),
                radius = coreRadius * 0.45f,
            ),
            radius = coreRadius,
            center = c,
        )
    }
}
