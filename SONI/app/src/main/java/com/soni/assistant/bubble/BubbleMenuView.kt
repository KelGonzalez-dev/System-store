package com.soni.assistant.bubble

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.view.MotionEvent
import android.view.View
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.sin

/**
 * Menú en arco alrededor de la burbuja: cinco accesos rápidos que aparecen en semicírculo
 * cuando tocas la bolita. Dibujado con Canvas para que viva en la ventana flotante.
 */
class BubbleMenuView(context: Context) : View(context) {

    enum class Action(val label: String) {
        TALK("Hablar"),
        OPEN_APP("Abrir"),
        MUTE("Callar"),
        NOTIFICATIONS("Avisos"),
        HIDE("Ocultar"),
    }

    var onAction: ((Action) -> Unit)? = null

    private val bg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.parseColor("#F21A2238") }
    private val ring = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE; strokeWidth = 2f; color = Color.parseColor("#558B5CF6")
    }
    private val iconPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 4f
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
        color = Color.parseColor("#E9E3FF")
    }
    private val iconFill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.parseColor("#E9E3FF") }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textAlign = Paint.Align.CENTER; textSize = 24f; color = Color.parseColor("#C4B5FD")
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
    }

    private var progress = 0f // 0 cerrado, 1 abierto
    private val buttons = Action.entries.toTypedArray()
    private val hitRadius get() = 42f * resources.displayMetrics.density / 3f

    fun animateIn() {
        animate().cancel()
        progress = 0f
        post(object : Runnable {
            override fun run() {
                progress = (progress + 0.12f).coerceAtMost(1f)
                invalidate()
                if (progress < 1f) postDelayed(this, 16)
            }
        })
    }

    fun animateOut(onEnd: () -> Unit) {
        post(object : Runnable {
            override fun run() {
                progress = (progress - 0.15f).coerceAtLeast(0f)
                invalidate()
                if (progress > 0f) postDelayed(this, 16) else onEnd()
            }
        })
    }

    /** Posición de cada botón en el arco (en coordenadas de la vista). */
    private fun buttonCenter(index: Int): Pair<Float, Float> {
        val cx = width / 2f; val cy = height / 2f
        val radius = width * 0.36f * progress
        // Semicírculo de -100° a 100° para que no queden bajo el dedo.
        val start = -100.0; val sweep = 200.0
        val angle = Math.toRadians(start + sweep * index / (buttons.size - 1))
        return (cx + radius * cos(angle).toFloat()) to (cy + radius * sin(angle).toFloat())
    }

    override fun onDraw(canvas: Canvas) {
        if (progress <= 0f) return
        for (i in buttons.indices) {
            val (bx, by) = buttonCenter(i)
            val rBtn = 40f * progress
            bg.alpha = (242 * progress).toInt()
            canvas.drawCircle(bx, by, rBtn, bg)
            canvas.drawCircle(bx, by, rBtn, ring)
            iconPaint.alpha = (255 * progress).toInt()
            iconFill.alpha = (255 * progress).toInt()
            drawIcon(canvas, buttons[i], bx, by, rBtn * 0.42f)
            if (progress > 0.7f) {
                textPaint.alpha = (255 * (progress - 0.7f) / 0.3f).toInt()
                canvas.drawText(buttons[i].label, bx, by + rBtn + 26f, textPaint)
            }
        }
    }

    /** Dibuja un icono de líneas (no emoji) centrado en (cx,cy) con «radio» r. */
    private fun drawIcon(canvas: Canvas, action: Action, cx: Float, cy: Float, r: Float) {
        when (action) {
            Action.TALK -> { // micrófono
                canvas.drawRoundRect(cx - r * 0.45f, cy - r, cx + r * 0.45f, cy + r * 0.2f, r * 0.45f, r * 0.45f, iconPaint)
                val arc = RectF(cx - r * 0.8f, cy - r * 0.5f, cx + r * 0.8f, cy + r * 0.7f)
                canvas.drawArc(arc, 20f, 140f, false, iconPaint)
                canvas.drawLine(cx, cy + r * 0.7f, cx, cy + r, iconPaint)
            }
            Action.OPEN_APP -> { // cuadrícula de apps
                val s = r * 0.55f; val g = r * 0.5f
                for (dx in intArrayOf(-1, 1)) for (dy in intArrayOf(-1, 1)) {
                    val x = cx + dx * g; val y = cy + dy * g
                    canvas.drawRoundRect(x - s / 2, y - s / 2, x + s / 2, y + s / 2, 3f, 3f, iconPaint)
                }
            }
            Action.MUTE -> { // altavoz con una X
                val p = android.graphics.Path()
                p.moveTo(cx - r * 0.9f, cy - r * 0.35f); p.lineTo(cx - r * 0.45f, cy - r * 0.35f)
                p.lineTo(cx, cy - r * 0.8f); p.lineTo(cx, cy + r * 0.8f)
                p.lineTo(cx - r * 0.45f, cy + r * 0.35f); p.lineTo(cx - r * 0.9f, cy + r * 0.35f); p.close()
                canvas.drawPath(p, iconPaint)
                canvas.drawLine(cx + r * 0.35f, cy - r * 0.4f, cx + r * 0.95f, cy + r * 0.4f, iconPaint)
                canvas.drawLine(cx + r * 0.95f, cy - r * 0.4f, cx + r * 0.35f, cy + r * 0.4f, iconPaint)
            }
            Action.NOTIFICATIONS -> { // campana
                val arc = RectF(cx - r * 0.7f, cy - r, cx + r * 0.7f, cy + r * 0.4f)
                canvas.drawArc(arc, 180f, 180f, false, iconPaint)
                canvas.drawLine(cx - r * 0.7f, cy + r * 0.1f, cx - r * 0.9f, cy + r * 0.5f, iconPaint)
                canvas.drawLine(cx + r * 0.7f, cy + r * 0.1f, cx + r * 0.9f, cy + r * 0.5f, iconPaint)
                canvas.drawLine(cx - r * 0.9f, cy + r * 0.5f, cx + r * 0.9f, cy + r * 0.5f, iconPaint)
                canvas.drawCircle(cx, cy + r * 0.8f, r * 0.18f, iconFill)
            }
            Action.HIDE -> { // una X
                canvas.drawLine(cx - r * 0.7f, cy - r * 0.7f, cx + r * 0.7f, cy + r * 0.7f, iconPaint)
                canvas.drawLine(cx + r * 0.7f, cy - r * 0.7f, cx - r * 0.7f, cy + r * 0.7f, iconPaint)
            }
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_DOWN && progress > 0.5f) {
            for (i in buttons.indices) {
                val (bx, by) = buttonCenter(i)
                if (hypot(event.x - bx, event.y - by) < 60f) {
                    onAction?.invoke(buttons[i])
                    return true
                }
            }
        }
        return false
    }
}
