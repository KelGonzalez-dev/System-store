package com.soni.assistant.ui.home

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.layout.size
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.soni.assistant.ui.theme.SoniColors
import kotlin.math.PI
import kotlin.math.acos
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

@Composable
fun SoniSplash(onFinished: () -> Unit) {
    val particles = remember { buildAssembly(620) }
    var time by remember { mutableFloatStateOf(0f) }
    var done by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        val start = withFrameNanosValue()
        var now = start
        while (now - start < TOTAL_NANOS) {
            now = withFrameNanosValue()
            time = (now - start) / 1_000_000_000f
        }
        done = true
        onFinished()
    }

    // 0 → disperso, 1 → ensamblado (en los primeros 1,4 s), con un pequeño rebote al final.
    val assemble = (time / 1.4f).coerceIn(0f, 1f).let { t -> 1f - (1f - t) * (1f - t) * (1f - t) }
    // Mensaje de carga que va cambiando.
    val message = LOADING_MESSAGES[((time / 0.9f).toInt()).coerceIn(0, LOADING_MESSAGES.lastIndex)]
    val titleAlpha by animateFloatAsState(if (time > 1.2f) 1f else 0f, tween(500, easing = LinearEasing), label = "title")
    // Al final se desvanece todo suavemente.
    val fadeOut = ((TOTAL_SECONDS - time) / 0.5f).coerceIn(0f, 1f)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.radialGradient(
                    colors = listOf(Color(0xFF0E1430), SoniColors.Background),
                    radius = 1200f,
                )
            )
    ) {
        Canvas(Modifier.fillMaxSize()) {
            val cx = size.width / 2f
            val cy = size.height / 2.3f
            val baseR = size.minDimension * 0.22f
            val spin = time * 3.2f * (1f - assemble * 0.8f) // gira rápido al entrar, se calma al cuajar
            val cs = cos(spin); val sn = sin(spin)
            val ct = cos(0.42f); val st = sin(0.42f)

            // Pulso final de energía.
            if (assemble > 0.75f) {
                val p = ((assemble - 0.75f) / 0.25f)
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(SoniColors.Violet.copy(alpha = 0.35f * (1f - p)), Color.Transparent),
                        center = Offset(cx, cy),
                        radius = baseR * (1f + p * 2.5f),
                    ),
                    radius = baseR * (1f + p * 2.5f),
                    center = Offset(cx, cy),
                )
            }

            for (p in particles) {
                // La esfera sigue viva: las partículas ondulan como el orbe aunque ya esté formada.
                val wave = sin(p.phi * 7f - time * 6f) + sin(p.theta * 3f + time * 4f + p.spread)
                val liveR = baseR * (1f + assemble * 0.05f * wave)
                val s = sin(p.phi)
                val fx = liveR * s * cos(p.theta)
                val fy = liveR * cos(p.phi)
                val fz = liveR * s * sin(p.theta)
                val x1 = fx * cs + fz * sn
                val z1 = -fx * sn + fz * cs
                val fy2 = fy * ct - z1 * st
                val fz2 = fy * st + z1 * ct

                // Posición inicial: lejos, en la dirección de entrada, con un giro en espiral
                val startDist = baseR * (6f + p.spread)
                val a = p.entryAngle + (1f - assemble) * 6f
                val sx = cos(a) * startDist
                val sy = sin(a) * startDist * 0.6f

                val x = mix(sx, x1, assemble)
                val y = mix(sy, fy2, assemble)
                val depth = ((fz2 / baseR) + 1f) / 2f
                val alpha = (assemble * (0.2f + 0.8f * depth) * fadeOut).coerceIn(0f, 1f)
                val color = lerp(SoniColors.Cyan, lerp(SoniColors.Violet, Color.White, depth), depth)

                drawCircle(
                    color = color.copy(alpha = alpha),
                    radius = (1f + 2f * depth) * (1f + (1f - assemble) * 1.5f),
                    center = Offset(cx + x, cy + y),
                )
            }
        }

        androidx.compose.foundation.layout.Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(top = 230.dp)
                .fillMaxWidth()
                .alpha(titleAlpha * fadeOut),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "SONI",
                style = MaterialTheme.typography.headlineMedium.merge(
                    TextStyle(
                        brush = Brush.linearGradient(listOf(SoniColors.Lavender, SoniColors.Cyan)),
                        letterSpacing = 14.sp,
                        fontWeight = FontWeight.Light,
                    )
                ),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )
            androidx.compose.foundation.layout.Spacer(Modifier.padding(top = 10.dp))
            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall.merge(
                    TextStyle(letterSpacing = 2.sp, fontWeight = FontWeight.Light)
                ),
                color = SoniColors.TextSecondary,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )
            // Puntos de progreso animados.
            androidx.compose.foundation.layout.Spacer(Modifier.padding(top = 14.dp))
            LoadingDots(time)
        }
    }
}

@Composable
private fun LoadingDots(time: Float) {
    androidx.compose.foundation.layout.Row(
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(8.dp),
    ) {
        repeat(3) { i ->
            val pulse = ((sin(time * 4f - i * 0.6f) + 1f) / 2f)
            Canvas(Modifier.size(14.dp)) {
                drawCircle(
                    color = SoniColors.Cyan.copy(alpha = 0.3f + 0.7f * pulse),
                    radius = 4f + 2f * pulse,
                    center = androidx.compose.ui.geometry.Offset(size.width / 2f, size.height / 2f),
                )
            }
        }
    }
}

/** Interpolación lineal entre dos números (la de Compose es solo para colores). */
private fun mix(a: Float, b: Float, t: Float): Float = a + (b - a) * t

private const val TOTAL_SECONDS = 3.8f
private const val TOTAL_NANOS = 3_800_000_000L

private val LOADING_MESSAGES = listOf(
    "Iniciando SONI",
    "Analizando dispositivo",
    "Cargando herramientas",
    "Listo",
)

private class SplashParticle(
    val theta: Float,
    val phi: Float,
    val entryAngle: Float,
    val spread: Float,
)

private fun buildAssembly(count: Int): List<SplashParticle> {
    val rnd = Random(99)
    val golden = (PI * (3.0 - sqrt(5.0))).toFloat()
    return List(count) { i ->
        val y = 1f - 2f * i / (count - 1f)
        SplashParticle(
            theta = golden * i,
            phi = acos(y.coerceIn(-1f, 1f)),
            entryAngle = rnd.nextFloat() * 2f * PI.toFloat(),
            spread = rnd.nextFloat() * 4f,
        )
    }
}

/** Azúcar para leer el nanotiempo del frame dentro de un bucle. */
private suspend fun withFrameNanosValue(): Long {
    var value = 0L
    withFrameNanos { value = it }
    return value
}
