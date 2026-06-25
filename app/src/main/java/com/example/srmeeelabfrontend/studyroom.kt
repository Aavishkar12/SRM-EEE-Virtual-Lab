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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun StudyRoomScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
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

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
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

                // Breadcrumb & Badge
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Home", color = Color(0xFF6E8699), fontSize = 14.sp, modifier = Modifier.clickable { onNavigate("home") })
                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
                            Text("Study Room", color = Color.White, fontSize = 14.sp)
                        }

                        Spacer(Modifier.height(24.dp))

                        Surface(
                            color = Color(0xFF4A1E73).copy(alpha = 0.15f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF8B3FD8).copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.LibraryBooks, contentDescription = null, tint = Color(0xFFC4A8FF), modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(10.dp))
                                Text("26EEE1001T — ACADEMIC RESOURCES", color = Color(0xFFC4A8FF), fontSize = 11.sp, fontWeight = FontWeight.Black, letterSpacing = 0.5.sp)
                            }
                        }
                    }
                }

                // Title Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                    ) {
                        Text(
                            "Study Room",
                            color = Color.White,
                            fontSize = 44.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-1).sp
                        )
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "Everything you need to ace your EEE lab — AI assistance, virtual experiments, quizzes, notes, and more.",
                            color = Color(0xFF94ACBA),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Featured Tools
                item {
                    SectionHeader(Icons.Default.Star, "FEATURED TOOLS", Color(0xFFE8954D))
                }

                item {
                    PremiumFeaturedCard(
                        icon = Icons.Default.SmartToy,
                        title = "MyAI Lab Assistant",
                        desc = "Ask any EEE concept — get instant explanations, solve circuit problems, and get step-by-step help.",
                        accentColor = Color(0xFFA89BFF),
                        badgeText = "AI POWERED",
                        onClick = { onNavigate("ai_assistant") }
                    )
                }

                item {
                    PremiumFeaturedCard(
                        icon = Icons.Default.Science,
                        title = "Virtual Lab Experiments",
                        desc = "Perform all 12 interactive lab experiments virtually with real-time simulations and circuit builders.",
                        accentColor = Color(0xFF53F1E0),
                        badgeText = "12 LABS",
                        onClick = { onNavigate("experiments") }
                    )
                }

                // Academic Resources
                item {
                    SectionHeader(Icons.Default.TrendingUp, "ACADEMIC RESOURCES", Color(0xFF1FD7C4))
                }

                items(academicResourcesList) { res ->
                    PremiumResourceCard(res, onClick = {
                        when (res.title) {
                            "EEE PYQs" -> onNavigate("pyq")
                            "CT Schedules" -> onNavigate("ct")
                            "Lecture Notes & Slides" -> onNavigate("lecturenotes")
                            "Reference Books" -> onNavigate("references")
                            "Formula Cheat Sheet" -> onNavigate("formula")
                            "Video Tutorials" -> onNavigate("tutorials")
                            "Lab Manual" -> onNavigate("labmanual")
                            "Component Guide" -> onNavigate("components")
                            else -> { /* Other resources */ }
                        }
                    })
                    Spacer(Modifier.height(16.dp))
                }

                // Footer
                item {
                    FooterSimple(onNavigate)
                }
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
                    HamburgerMenu(isLoggedIn = isLoggedIn, currentRoute = "study", onClose = { isMenuOpen = false }, onNavigate = { route ->
                        onNavigate(route)
                        isMenuOpen = false
                    })
                }
            }
        }
    }
}

@Composable
fun PremiumFeaturedCard(icon: ImageVector, title: String, desc: String, accentColor: Color, badgeText: String, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(28.dp))
            .background(Color(0xFF0A131F).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(listOf(Color(0xFF142233), accentColor.copy(alpha = 0.4f), Color(0xFF142233))),
                shape = RoundedCornerShape(28.dp)
            )
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(28.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = accentColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.size(56.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(30.dp))
                    }
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = accentColor.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, accentColor.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                ) {
                    Text(badgeText, color = accentColor, fontSize = 10.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), letterSpacing = 1.sp)
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(title, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(12.dp))
            Text(desc, color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 22.sp)
            Spacer(Modifier.height(24.dp))
            Text("Open Tool →", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Black)
        }
    }
}

@Composable
fun PremiumResourceCard(res: ResourceData, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xFF0A131F).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(listOf(Color(0xFF142233), res.color.copy(alpha = 0.3f), Color(0xFF142233))),
                shape = RoundedCornerShape(24.dp)
            )
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = res.color.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(res.icon, contentDescription = null, tint = res.color, modifier = Modifier.size(24.dp))
                    }
                }
                Spacer(Modifier.weight(1f))
                Text(res.actionText, color = Color(0xFF3D5468), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(16.dp))
            Text(res.title, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(8.dp))
            Text(res.desc, color = Color(0xFF94ACBA), fontSize = 14.sp, lineHeight = 20.sp)
            Spacer(Modifier.height(16.dp))
            Text("Explore →", color = res.color, fontSize = 14.sp, fontWeight = FontWeight.Black)
        }
    }
}

@Composable
fun SectionHeader(icon: ImageVector, title: String, color: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 24.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
        Spacer(Modifier.width(12.dp))
        Text(title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black, letterSpacing = 1.5.sp)
    }
}

@Composable
fun FooterSimple(onNavigate: (String) -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("SRM EEE Virtual Lab · 26EEE1001T", color = Color(0xFF3D5468), fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(32.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Text("Home", color = Color(0xFF6E8699), fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigate("home") })
            Text("Quizzes", color = Color(0xFF6E8699), fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigate("quizzes") })
            Text("Team", color = Color(0xFF6E8699), fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigate("team") })
            Text("Developers", color = Color(0xFF6E8699), fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigate("developers") })
        }
        Spacer(Modifier.height(48.dp))
        Text("© 2026 SRM Institute of Science and Technology. All rights reserved.", color = Color(0xFF24384C), fontSize = 11.sp, textAlign = TextAlign.Center)
    }
}

data class ResourceData(val title: String, val desc: String, val icon: ImageVector, val color: Color, val actionText: String)

val academicResourcesList = listOf(
    ResourceData("EEE PYQs", "Previous year question papers with solutions for all semesters. Filter by year, unit, and topic.", Icons.Outlined.Article, Color(0xFF5EEAD4), "VIEW PAPERS"),
    ResourceData("CT Schedules", "Cycle Test dates, syllabus coverage, and important exam deadlines for 26EEE1001T.", Icons.Outlined.CalendarToday, Color(0xFF5BEFA0), "VIEW SCHEDULE"),
    ResourceData("Formula Cheat Sheet", "Quick-reference formulas for KVL, KCL, Thevenin, diode equations, and more.", Icons.Outlined.Calculate, Color(0xFFE8954D), "VIEW FORMULAS"),
    ResourceData("Reference Books", "Digital library of recommended textbooks and reference materials.", Icons.Outlined.LibraryBooks, Color(0xFFE07A2C), "BROWSE LIBRARY"),
    ResourceData("Lecture Notes & Slides", "Unit-wise lecture notes, slides, and study materials. Download PDFs.", Icons.Outlined.MenuBook, Color(0xFFFF7AC6), "VIEW NOTES"),
    ResourceData("Video Tutorials", "Curated YouTube playlists for every experiment — from theory to practical.", Icons.Outlined.VideoLibrary, Color(0xFFFF4757), "WATCH VIDEOS"),
    ResourceData("Lab Manual", "Complete digital version of the SRM EEE Virtual Lab Manual with all procedures.", Icons.Outlined.Book, Color(0xFFA89BFF), "READ MANUAL"),
    ResourceData("Component Guide", "Learn about every component used in the lab — resistors, diodes, and more.", Icons.Outlined.Lightbulb, Color(0xFFF0A868), "INTERACTIVE")
)
