package com.example.srmeeelabfrontend

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun AnimatedBackground() {
    val infiniteTransition = rememberInfiniteTransition(label = "dynamic_bg")
    
    // Orb 1 Movement
    val xOffset1 by infiniteTransition.animateFloat(
        initialValue = -150f,
        targetValue = 450f,
        animationSpec = infiniteRepeatable(
            animation = tween(20000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "orb1x"
    )
    val yOffset1 by infiniteTransition.animateFloat(
        initialValue = -100f,
        targetValue = 700f,
        animationSpec = infiniteRepeatable(
            animation = tween(28000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "orb1y"
    )

    // Orb 2 Movement
    val xOffset2 by infiniteTransition.animateFloat(
        initialValue = 500f,
        targetValue = -200f,
        animationSpec = infiniteRepeatable(
            animation = tween(22000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "orb2x"
    )
    val yOffset2 by infiniteTransition.animateFloat(
        initialValue = 800f,
        targetValue = 100f,
        animationSpec = infiniteRepeatable(
            animation = tween(25000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "orb2y"
    )

    // Orb 3 Rotation & Pulsing
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(40000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ), label = "rotation"
    )
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.4f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "pulse"
    )

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        // Orb 1: Deep Indigo Glow
        Box(
            modifier = Modifier
                .offset(x = xOffset1.dp, y = yOffset1.dp)
                .size(400.dp)
                .scale(pulseScale)
                .blur(120.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color(0xFF1E1B4B).copy(alpha = 0.7f), Color.Transparent)
                    ),
                    CircleShape
                )
        )
        
        // Orb 2: Royal Blue Bottom Highlight
        Box(
            modifier = Modifier
                .offset(x = xOffset2.dp, y = yOffset2.dp)
                .size(500.dp)
                .scale(pulseScale * 0.9f)
                .blur(140.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color(0xFF312E81).copy(alpha = 0.5f), Color.Transparent)
                    ),
                    CircleShape
                )
        )

        // Orb 3: Moving Linear highlight (like the long capsules in your screenshot)
        val rectX by infiniteTransition.animateFloat(
            initialValue = -300f,
            targetValue = 600f,
            animationSpec = infiniteRepeatable(
                animation = tween(35000, easing = LinearEasing),
                repeatMode = RepeatMode.Reverse
            ), label = "rectX"
        )
        Box(
            modifier = Modifier
                .offset(x = rectX.dp, y = 250.dp)
                .rotate(rotation)
                .width(400.dp)
                .height(150.dp)
                .blur(100.dp)
                .background(
                    Brush.linearGradient(
                        colors = listOf(Color(0xFF4F46E5).copy(alpha = 0.2f), Color.Transparent)
                    ),
                    CircleShape
                )
        )

        // Orb 4: Cyan accent
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .offset(x = (-100).dp, y = (-200).dp)
                .size(350.dp)
                .blur(180.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color(0xFF06B6D4).copy(alpha = 0.15f), Color.Transparent)
                    ),
                    CircleShape
                )
        )
    }
}
