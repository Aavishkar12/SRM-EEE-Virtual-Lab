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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.ui.theme.LabFonts
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// A PCB-trace-style divider: a hairline with a small glowing solder-point
// node in the middle, instead of a plain HorizontalDivider. This is the
// app's signature structural motif — used anywhere a section break would
// otherwise be a flat line.
@Composable
fun CircuitDivider(
    modifier: Modifier = Modifier,
    nodeColor: Color = Color(0xFF1FD7C4)
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        HorizontalDivider(
            modifier = Modifier.weight(1f),
            color = Color(0xFF142233),
            thickness = 1.dp
        )
        Box(
            modifier = Modifier
                .padding(horizontal = 10.dp)
                .size(6.dp)
                .background(nodeColor.copy(alpha = 0.15f), CircleShape)
                .border(1.dp, nodeColor.copy(alpha = 0.6f), CircleShape)
        )
        HorizontalDivider(
            modifier = Modifier.weight(1f),
            color = Color(0xFF142233),
            thickness = 1.dp
        )
    }
}

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

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
        // Orb 1: Deep Indigo Glow
        Box(
            modifier = Modifier
                .offset(x = xOffset1.dp, y = yOffset1.dp)
                .size(400.dp)
                .scale(pulseScale)
                .blur(120.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color(0xFF1A1638).copy(alpha = 0.7f), Color.Transparent)
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
                        colors = listOf(Color(0xFF2B2557).copy(alpha = 0.5f), Color.Transparent)
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
                        colors = listOf(Color(0xFF6D5BD0).copy(alpha = 0.2f), Color.Transparent)
                    ),
                    CircleShape
                )
        )
    }
}

@Composable
fun Header(time: String, onMenuClick: () -> Unit) {
    val date = SimpleDateFormat("EEEE, d MMMM yyyy", Locale.getDefault()).format(Date())

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 24.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Logo Section - Premium Vertical Alignment
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(start = 4.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .border(
                        width = 1.5.dp,
                        brush = Brush.linearGradient(listOf(Color(0xFF1FD7C4), Color(0xFFB57AFA))),
                        shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "SRM",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
            }
            Spacer(Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "VIRTUAL ",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Text(
                    "LAB",
                    style = TextStyle(
                        brush = Brush.linearGradient(listOf(Color(0xFF1FD7C4), Color(0xFFB57AFA))),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                )
            }
        }

        // Center Menu Trigger - Premium Look
        IconButton(
            onClick = onMenuClick,
            modifier = Modifier
                .size(44.dp)
                .background(Color(0xFF142233).copy(alpha = 0.4f), CircleShape)
                .border(1.dp, Color(0xFF24384C).copy(alpha = 0.5f), CircleShape)
        ) {
            Icon(Icons.Default.Menu, contentDescription = "Menu", tint = Color.White, modifier = Modifier.size(22.dp))
        }

        // Time & Date Section - Rebalanced
        Column(horizontalAlignment = Alignment.End) {
            Surface(
                color = Color(0xFF0A131F).copy(alpha = 0.6f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
            ) {
                Text(
                    text = time,
                    color = Color(0xFF5EEAD4),
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = LabFonts.Mono,
                    letterSpacing = 1.sp
                )
            }
            Spacer(Modifier.height(6.dp))
            Text(
                text = date,
                color = Color(0xFF94ACBA),
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.End
            )
        }
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    glowColor: Color = Color(0xFF142233),
    content: @Composable ColumnScope.() -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "glassGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.1f,
        targetValue = 0.4f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.4f),
        shape = RoundedCornerShape(24.dp),
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF142233),
                        glowColor.copy(alpha = glowAlpha),
                        Color(0xFF142233)
                    )
                ),
                shape = RoundedCornerShape(24.dp)
            )
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            content()
        }
    }
}

@Composable
fun HamburgerMenu(isLoggedIn: Boolean, currentRoute: String, onClose: () -> Unit, onNavigate: (String) -> Unit) {
    Surface(
        modifier = Modifier
            .width(240.dp),
        color = Color(0xFF030608).copy(alpha = 0.98f),
        shape = RoundedCornerShape(24.dp),
        border = BorderStroke(1.dp, Color(0xFF142233)),
        shadowElevation = 16.dp
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            val menuItems = listOf(
                MenuItemData("Home", Icons.Outlined.Home, Color(0xFF5EEAD4), "home"),
                MenuItemData("Experiments", Icons.Outlined.Science, Color(0xFF5EEAD4), "experiments"),
                MenuItemData("Study Room", Icons.AutoMirrored.Outlined.MenuBook, Color(0xFF5EEAD4), "study"),
                MenuItemData("Quizzes", Icons.Outlined.Quiz, Color(0xFF5EEAD4), "quizzes"),
                MenuItemData("Team", Icons.Outlined.People, Color(0xFF5EEAD4), "team"),
                MenuItemData("About", Icons.Outlined.Info, Color(0xFF5EEAD4), "about"),
                MenuItemData("Profile", Icons.Outlined.Person, Color(0xFF5EEAD4), "profile"),
                MenuItemData("Settings", Icons.Outlined.Settings, Color(0xFF5EEAD4), "settings"),
                if (isLoggedIn) {
                    MenuItemData("Sign Out", Icons.AutoMirrored.Outlined.Logout, Color(0xFFFF4757), "logout")
                } else {
                    MenuItemData("Sign In", Icons.AutoMirrored.Outlined.Login, Color(0xFF5EEAD4), "login")
                }
            )

            menuItems.forEach { item ->
                val isActive = currentRoute == item.route

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (isActive) item.color.copy(alpha = 0.12f) else Color.Transparent)
                        .clickable {
                            if (!isActive) onNavigate(item.route)
                            onClose()
                        }
                        .padding(vertical = 14.dp, horizontal = 20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = null,
                        tint = if (isActive) item.color else Color(0xFF6E8699),
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(Modifier.width(16.dp))
                    Text(
                        text = item.text,
                        color = if (isActive) Color.White else Color(0xFF94ACBA),
                        fontSize = 15.sp,
                        fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
                        modifier = Modifier.weight(1f)
                    )
                    if (isActive) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .background(item.color, CircleShape)
                        )
                    }
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
        CircuitDivider()
        Spacer(Modifier.height(48.dp))
        Text("SRM EEE Virtual Lab · 26EEE1001T", color = Color(0xFF6E8699), fontSize = 15.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Spacer(Modifier.height(32.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FooterLink("Home", onClick = { onNavigate("home") })
            FooterLink("Team", onClick = { onNavigate("team") })
            FooterLink("About", onClick = { onNavigate("about") })
            FooterLink("Developers", onClick = { onNavigate("developers") })
        }
        Spacer(Modifier.height(56.dp))
        Text("© 2026 SRM Institute of Science and Technology —\nDepartment of EEE. All rights reserved.", color = Color(0xFF3D5468), fontSize = 13.sp, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center, lineHeight = 20.sp)
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun FooterLink(text: String, onClick: () -> Unit) {
    Text(
        text = text,
        color = Color(0xFF94ACBA),
        fontSize = 14.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier.clickable { onClick() }
    )
}
