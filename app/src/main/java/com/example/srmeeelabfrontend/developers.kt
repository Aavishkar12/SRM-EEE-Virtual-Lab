package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class DeveloperData(
    val name: String,
    val registerNumber: String,
    val university: String,
    val batch: String,
    val role: String,
    val drawableRes: Int,
    val github: String,
    val linkedin: String,
    val instagram: String,
    val gradientStart: Color,
    val gradientEnd: Color,
)

val developerList = listOf(
    DeveloperData(
        name = "Krishna Keshab Banik",
        registerNumber = "RA2411026011003",
        university = "SRM University of Science and Technology, Kattankulathur",
        batch = "2024 – 2028",
        role = "Full Stack Developer",
        drawableRes = R.drawable.krishna,
        github = "https://github.com/krishnakeshab-banik",
        linkedin = "https://www.linkedin.com/in/krishna-keshab-banik-067819324",
        instagram = "https://www.instagram.com/krish.banik.1234",
        gradientStart = Color(0xFF7C3AED),
        gradientEnd = Color(0xFF2563EB),
    ),
    DeveloperData(
        name = "Vooka Sai Siddharth",
        registerNumber = "RA2511026010906",
        university = "SRM Institute of Science and Technology, Kattankulathur",
        batch = "2025 – 2029",
        role = "Full Stack Developer",
        drawableRes = R.drawable.siddharth,
        github = "https://github.com/siddharth-1118",
        linkedin = "https://www.linkedin.com/in/sai-siddharth-ba0a92369",
        instagram = "https://www.instagram.com/saisiddharth2007",
        gradientStart = Color(0xFF0891B2),
        gradientEnd = Color(0xFF059669),
    ),
    DeveloperData(
        name = "Aavishkar Singh",
        registerNumber = "RA2511003011024",
        university = "SRM University of Science and Technology, Kattankulathur",
        batch = "2025 – 2029",
        role = "App Developer",
        drawableRes = R.drawable.aavishkar,
        github = "https://github.com/Aavishkar12",
        linkedin = "https://www.linkedin.com/in/aavishkar-singh-b2a2a5262",
        instagram = "https://www.instagram.com/aavishkar__23",
        gradientStart = Color(0xFFEA580C),
        gradientEnd = Color(0xFFDB2777),
    ),
)

@Composable
fun DevelopersScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    val uriHandler = LocalUriHandler.current

    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.97f) }

    LaunchedEffect(Unit) {
        launch { contentAlpha.animateTo(1f, animationSpec = tween(1000, easing = FastOutSlowInEasing)) }
        launch { contentScale.animateTo(1f, animationSpec = tween(1000, easing = FastOutSlowInEasing)) }
    }
    LaunchedEffect(Unit) {
        while (true) {
            currentTime = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            delay(1000)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        AnimatedBackground()

        Scaffold(containerColor = Color.Transparent) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value)
                    .scale(contentScale.value),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back", color = Color(0xFF64748B), fontSize = 14.sp)
                    }
                }

                // Hero
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color(0xFF7C3AED).copy(alpha = 0.15f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF7C3AED).copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                        ) {
                            Text(
                                "MEET THE TEAM",
                                color = Color(0xFFA78BFA),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 2.sp,
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                            )
                        }
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "The Developers",
                            color = Color.White,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "The minds behind the SRM EEE Virtual Lab — building tools that make learning electrical engineering accessible and interactive.",
                            color = Color(0xFF94A3B8),
                            fontSize = 15.sp,
                            lineHeight = 24.sp,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Developer cards
                items(developerList.size) { index ->
                    val dev = developerList[index]
                    DeveloperCard(dev = dev, onOpenLink = { uriHandler.openUri(it) })
                    Spacer(Modifier.height(20.dp))
                }

                // SRM Insider CTA
                item {
                    Surface(
                        color = Color(0xFF0F172A).copy(alpha = 0.9f),
                        shape = RoundedCornerShape(24.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
                    ) {
                        Column(
                            modifier = Modifier.padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                "BUILT FOR THE STUDENTS, BY THE STUDENTS",
                                color = Color(0xFF475569),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 1.5.sp,
                                textAlign = TextAlign.Center
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                buildString {
                                    append("SRM ")
                                },
                                color = Color.White,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.ExtraBold,
                                textAlign = TextAlign.Center
                            )
                            // Gradient "INSIDER" text workaround
                            Text(
                                "SRM INSIDER",
                                color = Color(0xFFA78BFA),
                                fontSize = 28.sp,
                                fontWeight = FontWeight.ExtraBold,
                                textAlign = TextAlign.Center
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                "SRM Insider is a student-driven platform built to empower the SRM community — from resources and events to projects like this Virtual Lab.",
                                color = Color(0xFF94A3B8),
                                fontSize = 14.sp,
                                lineHeight = 22.sp,
                                textAlign = TextAlign.Center
                            )
                            Spacer(Modifier.height(24.dp))
                            Button(
                                onClick = { uriHandler.openUri("https://srminsider.in/") },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF7C3AED)
                                ),
                                shape = RoundedCornerShape(14.dp),
                                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 14.dp)
                            ) {
                                Icon(Icons.Default.Language, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Visit SRM Insider", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            }
                        }
                    }
                    Spacer(Modifier.height(32.dp))
                }

                item { Footer(onNavigate) }
            }
        }

        if (isMenuOpen) {
            Box(
                modifier = Modifier.fillMaxSize().clickable(
                    interactionSource = remember { MutableInteractionSource() }, indication = null
                ) { isMenuOpen = false }
            ) {
                AnimatedVisibility(
                    visible = isMenuOpen,
                    enter = scaleIn(initialScale = 0.8f) + fadeIn(),
                    exit = scaleOut(targetScale = 0.8f) + fadeOut(),
                    modifier = Modifier.align(Alignment.TopEnd).padding(top = 75.dp, end = 16.dp)
                ) {
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "developers",
                        onClose = { isMenuOpen = false },
                        onNavigate = { route -> onNavigate(route); isMenuOpen = false }
                    )
                }
            }
        }
    }
}

@Composable
fun DeveloperCard(dev: DeveloperData, onOpenLink: (String) -> Unit) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.9f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column {
            // Accent bar at top
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(Brush.horizontalGradient(listOf(dev.gradientStart, dev.gradientEnd)))
            )

            // Photo
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .clip(RoundedCornerShape(0.dp))
            ) {
                androidx.compose.foundation.Image(
                    painter = painterResource(id = dev.drawableRes),
                    contentDescription = dev.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                // Fade overlay at bottom
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(Color.Transparent, Color(0xFF0F172A).copy(alpha = 0.7f))
                            )
                        )
                )
            }

            // Info
            Column(modifier = Modifier.padding(20.dp)) {
                Text(dev.name, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(4.dp))
                Text(dev.role, color = dev.gradientStart, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(20.dp))

                // Details grid
                InfoRow(icon = Icons.Default.Badge, label = "Register No.", value = dev.registerNumber)
                Spacer(Modifier.height(12.dp))
                InfoRow(icon = Icons.Default.CalendarToday, label = "Batch", value = dev.batch)
                Spacer(Modifier.height(12.dp))
                InfoRow(icon = Icons.Default.School, label = "University", value = dev.university)
                Spacer(Modifier.height(20.dp))

                // Social links
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    SocialButton("GitHub", Color(0xFF1E293B), Color(0xFF94A3B8)) { onOpenLink(dev.github) }
                    SocialButton("LinkedIn", Color(0xFF1E3A5F), Color(0xFF60A5FA)) { onOpenLink(dev.linkedin) }
                    SocialButton("Instagram", Color(0xFF3B1E3A), Color(0xFFF472B6)) { onOpenLink(dev.instagram) }
                }
            }
        }
    }
}

@Composable
fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(icon, contentDescription = null, tint = Color(0xFF475569), modifier = Modifier.size(16.dp).padding(top = 2.dp))
        Spacer(Modifier.width(10.dp))
        Column {
            Text(label.uppercase(), color = Color(0xFF475569), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Text(value, color = Color(0xFFE2E8F0), fontSize = 13.sp)
        }
    }
}

@Composable
fun SocialButton(label: String, bgColor: Color, textColor: Color, onClick: () -> Unit) {
    Surface(
        color = bgColor,
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier
            .border(1.dp, textColor.copy(alpha = 0.25f), RoundedCornerShape(10.dp))
            .clickable { onClick() }
    ) {
        Text(
            label,
            color = textColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
        )
    }
}