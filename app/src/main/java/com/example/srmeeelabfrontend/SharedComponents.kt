package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.automirrored.outlined.Login
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

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

        // Orb 3: Moving Linear highlight
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
    }
}

@Composable
fun Header(time: String, onMenuClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 20.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .border(width = 1.dp, brush = Brush.linearGradient(listOf(Color(0xFF6366F1), Color(0xFFA855F7))), shape = CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text("SRM", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
            }
            Text("VIRTUAL LAB", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp, modifier = Modifier.padding(top = 4.dp))
        }

        IconButton(
            onClick = onMenuClick,
            modifier = Modifier
                .size(48.dp)
                .background(Color(0xFF1E293B).copy(alpha = 0.6f), CircleShape)
                .border(1.dp, Color(0xFF334155), CircleShape)
        ) {
            Icon(Icons.Default.Menu, contentDescription = "Menu", tint = Color.White, modifier = Modifier.size(24.dp))
        }

        Surface(
            color = Color(0xFF0F172A),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(10.dp))
        ) {
            Text(text = time, color = Color(0xFF60A5FA), modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), fontSize = 14.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.2.sp)
        }
    }
}

@Composable
fun HamburgerMenu(isLoggedIn: Boolean, onClose: () -> Unit, onNavigate: (String) -> Unit) {
    Surface(
        modifier = Modifier
            .width(230.dp),
        color = Color(0xFF080C14).copy(alpha = 0.98f),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Color(0xFF1E293B)),
        shadowElevation = 16.dp
    ) {
        Column(modifier = Modifier.padding(vertical = 10.dp)) {
            val menuItems = listOf(
                MenuItemData("Home", Icons.Outlined.Home, Color(0xFF60A5FA), "home"),
                MenuItemData("Experiments", Icons.Outlined.Science, Color.White, "experiments"),
                MenuItemData("Study Room", Icons.AutoMirrored.Outlined.MenuBook, Color.White, "study"),
                MenuItemData("Quizzes", Icons.Outlined.Quiz, Color.White, "quizzes"),
                MenuItemData("Team", Icons.Outlined.People, Color.White, "team"),
                MenuItemData("About", Icons.Outlined.Info, Color.White, "about"),
                MenuItemData("Profile", Icons.Outlined.Person, Color.White, "profile"),
                MenuItemData("Settings", Icons.Outlined.Settings, Color.White, "settings"),
                if (isLoggedIn) {
                    MenuItemData("Sign Out", Icons.AutoMirrored.Outlined.Logout, Color(0xFFEF4444), "logout")
                } else {
                    MenuItemData("Sign In", Icons.AutoMirrored.Outlined.Login, Color(0xFF60A5FA), "login")
                }
            )

            menuItems.forEach { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onNavigate(item.route) }
                        .padding(vertical = 12.dp, horizontal = 18.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = null,
                        tint = item.color,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(16.dp))
                    Text(
                        text = item.text,
                        color = item.color,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

data class MenuItemData(
    val text: String, 
    val icon: ImageVector, 
    val color: Color, 
    val route: String
)

@Composable
fun Footer(onNavigate: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().padding(24.dp).padding(top = 60.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        HorizontalDivider(color = Color(0xFF1E293B), thickness = 1.dp)
        Spacer(Modifier.height(48.dp))
        Text("SRM EEE Virtual Lab · 26EEE1001T", color = Color(0xFF64748B), fontSize = 15.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Spacer(Modifier.height(32.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FooterLink("Home", onClick = { onNavigate("home") })
            FooterLink("Experiments", onClick = { onNavigate("experiments") })
            FooterLink("Quizzes", onClick = { onNavigate("quizzes") })
            FooterLink("Team", onClick = { onNavigate("team") })
            FooterLink("About", onClick = { onNavigate("about") })
        }
        Spacer(Modifier.height(56.dp))
        Text("© 2026 SRM Institute of Science and Technology —\nDepartment of EEE. All rights reserved.", color = Color(0xFF475569), fontSize = 13.sp, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center, lineHeight = 20.sp)
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun FooterLink(text: String, onClick: () -> Unit) {
    Text(
        text = text, 
        color = Color(0xFF94A3B8), 
        fontSize = 14.sp, 
        fontWeight = FontWeight.SemiBold, 
        modifier = Modifier.clickable { onClick() }
    )
}
