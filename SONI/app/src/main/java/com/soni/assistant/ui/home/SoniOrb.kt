package com.soni.assistant.ui.home

import android.provider.Settings
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.clearAndSetSemantics
import com.soni.assistant.ui.theme.SoniColors
import kotlinx.coroutines.isActive
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.acos
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

enum class OrbState { IDLE, LISTENING, PROCESSING, SPEAKING, SUCCESS, ERROR }

/** Partícula fija sobre la esfera (coordenadas esféricas) con su color y tamaño. */
private class OrbParticle(
    val theta: Float,
    val phi: Float,
    val size: Float,
    val phase: Float,
    val color: Color,
    val alpha: Float,
)

/** true si el usuario desactivó las animaciones del sistema (Opciones de accesibilidad/desarrollador). */
@Composable
fun rememberReduceMotion(): Boolean {
    val context = LocalContext.current
    return remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

/**
 * Núcleo visual de SONI: una esfera formada solo por partículas.
 * - Reposo: respira y gira despacio.
 * - Escuchando: las partículas ondulan con el volumen real del micrófono.
 * - Pensando: gira rápido con un remolino.
 * - Hablando: ondas de sonido recorren la esfera de polo a polo.
 * - Éxito/error: se tiñe de verde o rojo un momento.
 */
@Composable
fun SoniOrb(
    state: OrbState,
    micLevel: Float,
    reduceMotion: Boolean,
    modifier: Modifier = Modifier,
) {
    val particles = remember { buildSphere(PARTICLE_COUNT) }

    val amp by animateFloatAsState(
        targetValue = when (state) {
            OrbState.LISTENING -> 0.15f + micLevel.coerceIn(0f, 1f) * 0.85f
            OrbState.SPEAKING -> 0.8f
            OrbState.PROCESSING -> 0.35f
            OrbState.SUCCESS, OrbState.ERROR -> 0.2f
            OrbState.IDLE -> 0f
        },
        animationSpec = tween(200),
        label = "amp",
    )
    val spinSpeed by animateFloatAsState(
        targetValue = if (state == OrbState.PROCESSING) 1.8f else 0.22f,
        animationSpec = tween(600),
        label = "spinSpeed",
    )
    val tintAmount by animateFloatAsState(
        targetValue = if (state == OrbState.SUCCESS || state == OrbState.ERROR) 0.65f else 0f,
        animationSpec = tween(400),
        label = "tint",
    )
    val tintColor = if (state == OrbState.ERROR) SoniColors.Error else SoniColors.Success

    // Reloj propio: tiempo total y ángulo de giro acumulado (así cambiar la velocidad no da saltos).
    val time = remember { mutableFloatStateOf(0f) }
    val spin = remember { mutableFloatStateOf(0f) }
    val currentSpeed by rememberUpdatedState(spinSpeed)
    if (!reduceMotion) {
        LaunchedEffect(Unit) {
            var last = 0L
            while (isActive) {
                withFrameNanos { now ->
                    if (last != 0L) {
                        val dt = ((now - last) / 1_000_000_000f).coerceAtMost(0.05f)
                        time.floatValue += dt
                        spin.floatValue += dt * currentSpeed
                    }
                    last = now
                }
            }
        }
    }

    Canvas(modifier = modifier.clearAndSetSemantics { }) {
        val t = time.floatValue
        val angle = spin.floatValue
        val radius = size.minDimension / 2f
        val baseR = radius * 0.62f
        val c = center
        val a = amp

        // Volumen simulado de la voz de SONI: pulsos irregulares como al hablar.
        val voice = if (state == OrbState.SPEAKING) {
            0.45f + 0.55f * abs(sin(t * 7.3f)) * (0.6f + 0.4f * abs(sin(t * 2.3f + 1f)))
        } else {
            1f
        }

        // Halo suave detrás de la esfera.
        val glow = lerp(SoniColors.Violet, tintColor, tintAmount)
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(glow.copy(alpha = 0.22f + 0.18f * a), Color.Transparent),
                center = c,
                radius = radius,
            ),
            radius = radius,
            center = c,
        )

        val cs = cos(angle)
        val sn = sin(angle)
        val ct = cos(TILT)
        val st = sin(TILT)

        for (p in particles) {
            val ripple = when (state) {
                OrbState.SPEAKING -> 0.65f * sin(p.phi * 8f - t * 10f) + 0.35f * sin(p.theta * 3f + t * 6f)
                OrbState.LISTENING -> sin(p.phi * 5f - t * 7f + p.phase)
                OrbState.PROCESSING -> sin(p.theta * 4f + p.phi * 3f - t * 5f)
                else -> sin(t * 1.4f + p.phase)
            }
            val breath = 0.025f * sin(t * 1.1f + p.phase * 0.5f)
            val r = baseR * (1f + breath + a * voice * 0.22f * ripple)

            // Esféricas → cartesianas
            val s = sin(p.phi)
            val x = r * s * cos(p.theta)
            val y = r * cos(p.phi)
            val z = r * s * sin(p.theta)

            // Giro (eje Y) e inclinación (eje X)
            val x1 = x * cs + z * sn
            val z1 = -x * sn + z * cs
            val y2 = y * ct - z1 * st
            val z2 = y * st + z1 * ct

            val depth = ((z2 / baseR + 1f) * 0.5f).coerceIn(0f, 1f) // 0 = detrás, 1 = delante
            val persp = 1f + z2 / (baseR * 4f)
            val color = if (tintAmount > 0f) lerp(p.color, tintColor, tintAmount) else p.color

            drawCircle(
                color = color.copy(alpha = ((0.12f + 0.88f * depth) * p.alpha).coerceIn(0f, 1f)),
                radius = radius * p.size * persp * (1f + 0.35f * a * voice),
                center = Offset(c.x + x1 * persp, c.y + y2 * persp),
            )
        }
    }
}

private const val PARTICLE_COUNT = 850
private const val TILT = 0.38f

/** Reparte las partículas de forma uniforme sobre la esfera (espiral de Fibonacci). */
private fun buildSphere(count: Int): List<OrbParticle> {
    val rnd = Random(1337)
    val golden = (PI * (3.0 - sqrt(5.0))).toFloat()
    val palette = listOf(SoniColors.Cyan, SoniColors.Violet, SoniColors.Lavender, Color.White)
    return List(count) { i ->
        val y = 1f - 2f * i / (count - 1f)
        OrbParticle(
            theta = golden * i,
            phi = acos(y.coerceIn(-1f, 1f)),
            size = 0.005f + rnd.nextFloat() * 0.009f,
            phase = rnd.nextFloat() * 2f * PI.toFloat(),
            color = palette[rnd.nextInt(palette.size)],
            alpha = 0.6f + rnd.nextFloat() * 0.4f,
        )
    }
}
