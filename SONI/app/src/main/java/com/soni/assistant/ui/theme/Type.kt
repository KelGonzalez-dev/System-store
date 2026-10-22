package com.soni.assistant.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val Base = Typography()

val SoniTypography = Base.copy(
    titleLarge = Base.titleLarge.copy(fontWeight = FontWeight.SemiBold),
    titleMedium = Base.titleMedium.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.2.sp),
    bodyLarge = Base.bodyLarge.copy(lineHeight = 24.sp),
    bodyMedium = Base.bodyMedium.copy(lineHeight = 21.sp),
)
