package com.soni.assistant.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

private val SoniColorScheme = darkColorScheme(
    primary = SoniColors.Violet,
    onPrimary = SoniColors.TextPrimary,
    secondary = SoniColors.Cyan,
    onSecondary = SoniColors.Background,
    tertiary = SoniColors.Lavender,
    onTertiary = SoniColors.Background,
    background = SoniColors.Background,
    onBackground = SoniColors.TextPrimary,
    surface = SoniColors.Card,
    onSurface = SoniColors.TextPrimary,
    surfaceVariant = SoniColors.SurfaceAlt,
    onSurfaceVariant = SoniColors.TextSecondary,
    error = SoniColors.Error,
    onError = SoniColors.Background,
    outline = SoniColors.Outline,
)

private val SoniShapes = Shapes(
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp),
)

/** SONI es siempre oscura: el diseño está pensado para ese fondo. */
@Composable
fun SoniTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SoniColorScheme,
        typography = SoniTypography,
        shapes = SoniShapes,
        content = content,
    )
}
