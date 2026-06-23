package com.example.srmeeelabfrontend.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// "Circuit Lab" dark scheme — every default Material3 widget (Button,
// Switch, TextField, Checkbox, etc.) that doesn't set explicit colors
// will resolve through this, so it stays on-brand automatically.
private val DarkColorScheme = darkColorScheme(
    primary = ScopeCyan,
    onPrimary = CircuitVoid,
    primaryContainer = ScopeCyanDeep,
    onPrimaryContainer = PhosphorWhite,

    secondary = CopperWire,
    onSecondary = CircuitVoid,
    secondaryContainer = CopperWireDeep,
    onSecondaryContainer = CopperWireLight,

    tertiary = SignalViolet,
    onTertiary = PhosphorWhite,
    tertiaryContainer = SignalVioletDeep,
    onTertiaryContainer = SignalVioletLight,

    background = CircuitVoid,
    onBackground = PhosphorWhite,

    surface = CircuitPanel,
    onSurface = PhosphorWhite,
    surfaceVariant = CircuitSurface,
    onSurfaceVariant = SteelMuted,

    outline = CircuitSurfaceLight,
    outlineVariant = CircuitSurface,

    error = StatusDanger,
    onError = CircuitVoid
)

private val LightColorScheme = lightColorScheme(
    primary = ScopeCyanDeep,
    secondary = CopperWireDeep,
    tertiary = SignalViolet,
    background = Color(0xFFF7FAF9),
    surface = Color.White,
    error = StatusDanger
)

@Composable
fun SrmEEELabFrontendTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
