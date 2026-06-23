package com.example.srmeeelabfrontend.ui.theme

import androidx.compose.ui.graphics.Color

// ───────────────────────────────────────────────
// SRM EEE Virtual Lab — "Circuit Lab" design tokens
// A duotone built for an electronics lab: oscilloscope
// cyan as the live signal, copper as the warm secondary
// (like exposed PCB traces / wiring), violet reserved
// for tertiary/rare highlights.
// ───────────────────────────────────────────────

// Backgrounds — deep circuit-board navy, near-black with a cool undertone
val CircuitVoid = Color(0xFF05080D)        // app background, deepest layer
val CircuitPanel = Color(0xFF0A131F)       // section / sunken panel background
val CircuitSurface = Color(0xFF142233)     // card surface, default border colour
val CircuitSurfaceLight = Color(0xFF24384C) // raised card border / divider on surface

// Text — "phosphor" whites and steel-blue mutes
val PhosphorWhite = Color(0xFFE8F4F1)      // primary text on dark
val SteelMuted = Color(0xFF94ACBA)         // secondary / supporting text
val SteelFaint = Color(0xFF6E8699)         // tertiary / caption text
val SteelGhost = Color(0xFF3D5468)         // disabled / lowest-emphasis text

// Primary accent — Oscilloscope Cyan (the app's signature colour)
val ScopeCyan = Color(0xFF1FD7C4)
val ScopeCyanLight = Color(0xFF5EEAD4)
val ScopeCyanDeep = Color(0xFF0D9488)

// Secondary accent — Copper Wire (warm, used for highlights/CTAs/badges)
val CopperWire = Color(0xFFE8954D)
val CopperWireLight = Color(0xFFF6C28B)
val CopperWireDeep = Color(0xFF6B3A14)

// Tertiary accent — Signal Violet (rare highlights, gradients only)
val SignalViolet = Color(0xFF8B5CF6)
val SignalVioletLight = Color(0xFFC4A8FF)
val SignalVioletDeep = Color(0xFF2B2557)

// Status — kept legible against the dark navy base
val StatusSuccess = Color(0xFF3DE8B0)
val StatusWarning = Color(0xFFE8954D)
val StatusDanger = Color(0xFFFF6B6B)
val StatusInfo = Color(0xFF5EEAD4)
