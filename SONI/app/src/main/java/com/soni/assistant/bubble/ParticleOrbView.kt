package com.soni.assistant.bubble

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RadialGradient
import android.graphics.Shader
import android.view.View
import kotlin.math.acos
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

/**
 * La bolita de partículas de la burbuja, dibujada con Canvas nativo (va en una ventana de sistema,
 * fuera de Compose). Rota siempre en su sitio y ondula como onda de sonido cuando SONI habla.
 */
class ParticleOrbView(context: Context) : View(context) {

    private data class P(val theta: Float, val phi: Float, val size: Float, val phase: Float, val color: Int)

    private val particles: List<P>
    private val dot = Paint(Paint.ANTI_ALIAS_FLAG)
    private val glow = Paint(Paint.ANTI_ALIAS_FLAG)

    private var time = 0f
    private var spin = 0f
    private var amp = 0f          // 0 reposo, 1 hablando (suavizado)
    var speaking: Boolean = false // lo pone la burbuja según SONI

    private val animator = ValueAnimator.ofFloat(0f, 1f).apply {
        duration = 1_000
        repeatCount = ValueAnimator.INFINITE
        addUpdateListener {
            val dt = 0.016f
            time += dt
            spin += dt * (if (speaking) 0.5f else 0.3f)
            val target = if (speaking) 1f else 0f
            amp += (target - amp) * 0.12f
            invalidate()
        }
    }

    init {
        val rnd = Random(1337)
        val golden = (Math.PI * (3.0 - sqrt(5.0))).toFloat()
        val palette = intArrayOf(0xFF38BDF8.toInt(), 0xFF8B5CF6.toInt(), 0xFFC4B5FD.toInt(), 0xFFFFFFFF.toInt())
        val count = 420
        particles = List(count) { i ->
            val y = 1f - 2f * i / (count - 1f)
            P(
                theta = golden * i,
                phi = acos(y.coerceIn(-1f, 1f)),
                size = 0.012f + rnd.nextFloat() * 0.02f,
                phase = rnd.nextFloat() * 6.28f,
                color = palette[rnd.nextInt(palette.size)],
            )
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        animator.start()
    }

    override fun onDetachedFromWindow() {
        animator.cancel()
        super.onDetachedFromWindow()
    }

    override fun onDraw(canvas: Canvas) {
        val cx = width / 2f
        val cy = height / 2f
        val radius = minOf(width, height) / 2f
        val baseR = radius * 0.6f

        // Halo.
        glow.shader = RadialGradient(
            cx, cy, radius,
            intArrayOf(colorAlpha(0xFF8B5CF6.toInt(), (0.30f + 0.3f * amp)), Color.TRANSPARENT),
            floatArrayOf(0f, 1f), Shader.TileMode.CLAMP,
        )
        canvas.drawCircle(cx, cy, radius, glow)

        val cs = cos(spin); val sn = sin(spin)
        val tilt = 0.4f; val ct = cos(tilt); val st = sin(tilt)

        for (p in particles) {
            val wave = 0.6f * sin(p.phi * 8f - time * 10f) + 0.4f * sin(p.theta * 3f + time * 6f + p.phase)
            val breathe = 0.03f * sin(time * 1.4f + p.phase)
            val r = baseR * (1f + breathe + amp * 0.28f * wave)

            val s = sin(p.phi)
            val x = r * s * cos(p.theta)
            val y = r * cos(p.phi)
            val z = r * s * sin(p.theta)
            val x1 = x * cs + z * sn
            val z1 = -x * sn + z * cs
            val y2 = y * ct - z1 * st
            val z2 = y * st + z1 * ct

            val depth = ((z2 / baseR) + 1f) / 2f
            val persp = 1f + z2 / (baseR * 4f)
            dot.color = colorAlpha(p.color, (0.15f + 0.85f * depth))
            canvas.drawCircle(cx + x1 * persp, cy + y2 * persp, radius * p.size * persp * (1f + amp * 0.4f), dot)
        }
    }

    private fun colorAlpha(color: Int, alpha: Float): Int {
        val a = (alpha.coerceIn(0f, 1f) * 255).toInt()
        return (a shl 24) or (color and 0x00FFFFFF)
    }
}
