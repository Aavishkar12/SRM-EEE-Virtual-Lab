package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DevelopersScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    
    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.97f) }
    
    LaunchedEffect(Unit) {
        launch { contentAlpha.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing)) }
        launch { contentScale.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing)) }
    }

    LaunchedEffect(Unit) {
        while (true) {
            currentTime = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            delay(1000)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        AnimatedBackground()

        Scaffold(
            containerColor = Color.Transparent,
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value)
                    .scale(contentScale.value),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                item { Header(currentTime, onMenuClick = { isMenuOpen = !isMenuOpen }) }

                // Breadcrumb
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                            .clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = Color(0xFF1E293B).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(10.dp))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Back", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
                
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            "Meet the",
                            color = Color.White,
                            fontSize = 44.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-1).sp
                        )
                        Text(
                            "Developers",
                            style = androidx.compose.ui.text.TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF3B82F6), Color(0xFFA855F7))),
                                fontSize = 44.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-1).sp
                            )
                        )
                    }
                }

                // Developers List
                items(developerList) { dev ->
                    PremiumDeveloperCard(dev)
                    Spacer(Modifier.height(24.dp))
                }
                
                item { Footer(onNavigate) }
            }
        }

        // Hamburger Menu Overlay
        if (isMenuOpen) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) { isMenuOpen = false }
            ) {
                AnimatedVisibility(
                    visible = isMenuOpen,
                    enter = scaleIn(initialScale = 0.8f) + fadeIn(),
                    exit = scaleOut(targetScale = 0.8f) + fadeOut(),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(top = 75.dp, end = 16.dp)
                ) {
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "developers",
                        onClose = { isMenuOpen = false },
                        onNavigate = { route ->
                            onNavigate(route)
                            isMenuOpen = false
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun PremiumDeveloperCard(dev: DeveloperData) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clip(RoundedCornerShape(32.dp))
            .background(Color(0xFF0F172A).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(listOf(Color(0xFF1E293B), dev.roleColor.copy(alpha = 0.4f), Color(0xFF1E293B))),
                shape = RoundedCornerShape(32.dp)
            )
    ) {
        Column {
            // Profile Photo Placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .background(
                        Brush.verticalGradient(listOf(Color(0xFF1E293B), Color.Black.copy(alpha = 0.3f)))
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = Color(0xFF334155),
                    modifier = Modifier.size(140.dp)
                )
            }
            
            Column(modifier = Modifier.padding(32.dp)) {
                Text(dev.name, color = Color.White, fontSize = 30.sp, fontWeight = FontWeight.Black)
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 8.dp)) {
                    Surface(
                        color = dev.roleColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Code, contentDescription = null, tint = dev.roleColor, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(dev.role, color = dev.roleColor, fontSize = 12.sp, fontWeight = FontWeight.Black, letterSpacing = 0.5.sp)
                        }
                    }
                }
                
                Spacer(Modifier.height(32.dp))
                
                DetailItemPremium(Icons.Default.ConfirmationNumber, "REGISTER NO.", dev.regNo)
                Spacer(Modifier.height(18.dp))
                DetailItemPremium(Icons.Default.CalendarMonth, "BATCH", dev.batch)
                Spacer(Modifier.height(18.dp))
                DetailItemPremium(Icons.Default.School, "UNIVERSITY", dev.university)
                
                Spacer(Modifier.height(40.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(), 
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    SocialButtonPremium(Icons.Default.Terminal, "GitHub", Modifier.weight(1f)) { }
                    SocialButtonPremium(Icons.Default.WorkOutline, "LinkedIn", Modifier.weight(1.1f)) { }
                    SocialButtonPremium(Icons.Default.CameraAlt, "Instagram", Modifier.weight(1.2f)) { }
                }
            }
        }
    }
}

@Composable
fun DetailItemPremium(icon: ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.Top) {
        Box(
            modifier = Modifier.size(32.dp).background(Color(0xFF1E293B).copy(alpha = 0.6f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
        }
        Spacer(Modifier.width(20.dp))
        Column {
            Text(label, color = Color(0xFF475569), fontSize = 10.sp, fontWeight = FontWeight.Black, letterSpacing = 1.sp)
            Text(value, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun SocialButtonPremium(icon: ImageVector, text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.5f),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
            .border(1.dp, Color(0xFF334155), RoundedCornerShape(12.dp))
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(6.dp))
            Text(text, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
    }
}

data class DeveloperData(
    val name: String,
    val role: String,
    val roleColor: Color,
    val regNo: String,
    val batch: String,
    val university: String
)

val developerList = listOf(
    DeveloperData(
        "Krishna Keshab Banik",
        "Full Stack Developer",
        Color(0xFF8B5CF6),
        "RA2411026011003",
        "2024 — 2028",
        "SRM University of Science and Technology, Kattankulathur"
    ),
    DeveloperData(
        "Vooka Sai Siddharth",
        "Full Stack Developer",
        Color(0xFF10B981),
        "RA2511026010906",
        "2025 — 2029",
        "SRM Institute of Science and Technology, Kattankulathur"
    ),
    DeveloperData(
        "Aavishkar Singh",
        "App Developer",
        Color(0xFFF97316),
        "RA251103011024",
        "2025 — 2029",
        "SRM University of Science and Technology, Kattankulathur"
    )
)
