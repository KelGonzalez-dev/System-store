package com.soni.assistant

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
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
        setContent {
            SoniTheme {
                HomeScreen(viewModel = viewModel)
            }
        }
    }

    override fun onStop() {
        super.onStop()
        // Al salir de la app se deja de escuchar y de hablar (no al girar la pantalla).
        if (!isChangingConfigurations) viewModel.onAppBackground()
    }
}
