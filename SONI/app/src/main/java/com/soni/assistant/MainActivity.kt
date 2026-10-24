package com.soni.assistant

import android.graphics.Color
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.soni.assistant.ui.home.SoniSplash
import com.soni.assistant.ui.home.HomeScreen
import com.soni.assistant.ui.home.HomeViewModel
import com.soni.assistant.ui.theme.SoniTheme

class MainActivity : ComponentActivity() {

    private val viewModel: HomeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
        )
        super.onCreate(savedInstanceState)
        handleSharedImage(intent)
        setContent {
            SoniTheme {
                var showSplash by rememberSaveable { mutableStateOf(true) }
                HomeScreen(viewModel = viewModel)
                if (showSplash) {
                    SoniSplash(onFinished = { showSplash = false })
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleSharedImage(intent)
    }

    /** Si abrieron SONI con «Compartir → SONI» una imagen, la describe. */
    private fun handleSharedImage(intent: Intent?) {
        if (intent?.action != Intent.ACTION_SEND) return
        if (intent.type?.startsWith("image/") != true) return
        val uri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
        } else {
            @Suppress("DEPRECATION") intent.getParcelableExtra(Intent.EXTRA_STREAM) as? Uri
        }
        uri?.let { viewModel.describeSharedImage(it) }
    }

    override fun onStop() {
        super.onStop()
        // Al salir de la app se deja de escuchar y de hablar (no al girar la pantalla).
        if (!isChangingConfigurations) viewModel.onAppBackground()
    }
}
