package com.soni.assistant.bubble

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import com.soni.assistant.data.settings.AvailabilitySettings
import com.soni.assistant.notifications.SoniNotificationListener
import com.soni.assistant.voice.SpeechController
import com.soni.assistant.voice.WakeWordController
import com.soni.assistant.voice.WakeWordService
import com.soni.assistant.voice.StartListeningActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlin.math.hypot

/**
 * Burbuja flotante de partículas sobre todas las apps. Rota siempre, ondula cuando SONI habla,
 * se arrastra por la pantalla y, al tocarla (sin arrastrar), abre un menú en arco con accesos rápidos.
 */
class BubbleService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var root: FrameLayout
    private lateinit var orb: ParticleOrbView
    private lateinit var menu: BubbleMenuView
    private lateinit var params: WindowManager.LayoutParams
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private var menuOpen = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        val size = dp(72)
        orb = ParticleOrbView(this)
        menu = BubbleMenuView(this).apply { visibility = View.GONE }

        root = FrameLayout(this)
        root.addView(menu, FrameLayout.LayoutParams(dp(240), dp(240), Gravity.CENTER))
        root.addView(orb, FrameLayout.LayoutParams(size, size, Gravity.CENTER))

        params = WindowManager.LayoutParams(
            dp(240), dp(240),
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
            PixelFormat.TRANSLUCENT,
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = dp(16)
            y = dp(140)
        }

        if (!Settings.canDrawOverlays(this)) { stopSelf(); return }
        windowManager.addView(root, params)
        setupTouch()
        setupMenuActions()

        // La bolita ondula cuando SONI habla.
        scope.launch { WakeWordController.speaking.collect { orb.speaking = it } }
    }

    private fun setupTouch() {
        var downX = 0f; var downY = 0f
        var startX = 0; var startY = 0
        var moved = false
        var downTime = 0L

        orb.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    downX = event.rawX; downY = event.rawY
                    startX = params.x; startY = params.y
                    moved = false; downTime = System.currentTimeMillis()
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - downX); val dy = (event.rawY - downY)
                    if (hypot(dx, dy) > dp(8)) moved = true
                    if (menuOpen) { closeMenu() }
                    params.x = startX + dx.toInt()
                    params.y = startY + dy.toInt()
                    windowManager.updateViewLayout(root, params)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val quick = System.currentTimeMillis() - downTime < 350
                    if (!moved && quick) toggleMenu() else snapToEdge()
                    true
                }
                else -> false
            }
        }
        // Tocar fuera de la burbuja cierra el menú.
        root.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_OUTSIDE && menuOpen) closeMenu()
            false
        }
    }

    private fun setupMenuActions() {
        menu.onAction = { action ->
            when (action) {
                BubbleMenuView.Action.TALK -> {
                    closeMenu()
                    if (WakeWordController.isRunning) {
                        WakeWordService.listenNow(this)
                    } else {
                        // Aún no escucha: hay que pasar por una pantalla para que Android permita el micrófono.
                        startActivity(StartListeningActivity.intent(this))
                    }
                }
                BubbleMenuView.Action.OPEN_APP -> {
                    closeMenu()
                    packageManager.getLaunchIntentForPackage(packageName)?.let {
                        it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); startActivity(it)
                    }
                }
                BubbleMenuView.Action.MUTE -> { SpeechController.stopSpeaking(); closeMenu() }
                BubbleMenuView.Action.NOTIFICATIONS -> {
                    val av = AvailabilitySettings.get(this)
                    val on = !av.current.readAloud
                    if (on && !SoniNotificationListener.isEnabled(this)) {
                        SoniNotificationListener.openSettings(this)
                    } else {
                        av.update { it.copy(readAloud = on) }
                    }
                    closeMenu()
                }
                BubbleMenuView.Action.HIDE -> stopSelf()
            }
        }
    }

    private fun toggleMenu() = if (menuOpen) closeMenu() else openMenu()

    private fun openMenu() {
        menuOpen = true
        menu.visibility = View.VISIBLE
        menu.animateIn()
    }

    private fun closeMenu() {
        menuOpen = false
        menu.animateOut { menu.visibility = View.GONE }
    }

    /** Pega la burbuja al borde más cercano (izquierda o derecha). */
    private fun snapToEdge() {
        val metrics = resources.displayMetrics
        val center = params.x + dp(120)
        params.x = if (center < metrics.widthPixels / 2) dp(8) else metrics.widthPixels - dp(248)
        windowManager.updateViewLayout(root, params)
    }

    override fun onDestroy() {
        scope.cancel()
        runCatching { windowManager.removeView(root) }
        super.onDestroy()
    }

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()

    companion object {
        fun start(context: Context) {
            if (!Settings.canDrawOverlays(context)) return
            context.startService(Intent(context, BubbleService::class.java))
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, BubbleService::class.java))
        }
    }
}
