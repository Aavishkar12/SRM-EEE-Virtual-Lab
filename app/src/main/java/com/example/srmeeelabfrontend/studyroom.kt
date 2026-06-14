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
        launch {
            contentAlpha.animateTo(1f, animationSpec = tween(1000, easing = FastOutSlowInEasing))
        }
        launch {
            contentScale.animateTo(1f, animationSpec = tween(1000, easing = FastOutSlowInEasing))
        }
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

                // Breadcrumb & Badge
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Home", color = Color(0xFF64748B), fontSize = 14.sp, modifier = Modifier.clickable { onNavigate("home") })
                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                            Text("Study Room", color = Color.White, fontSize = 14.sp)
                        }

                        Spacer(Modifier.height(24.dp))

                        Surface(
                            color = Color(0xFF581C87).copy(alpha = 0.2f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF7E22CE).copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.LibraryBooks, contentDescription = null, tint = Color(0xFFA78BFA), modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("26EEE1001T — All Study Resources", color = Color(0xFFA78BFA), fontSize = 12.sp, fontWeight = FontWeight.Bold)
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
                            fontSize = 42.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = (-0.5).sp
                        )
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "Everything you need to ace your EEE lab — AI assistance, virtual experiments, quizzes, notes, and more.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Stats Grid
                item {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            StatCard(Icons.Default.Science, "12", "Experiments", Color(0xFF22D3EE), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            StatCard(Icons.Default.Psychology, "12", "Quizzes", Color(0xFF4ADE80), Modifier.weight(1f))
                        }
                        Spacer(Modifier.height(16.dp))
                        Row(modifier = Modifier.fillMaxWidth()) {
                            StatCard(Icons.Default.SmartToy, "AI", "Assistant", Color(0xFF818CF8), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            StatCard(Icons.Default.Wifi, "24/7", "Access", Color(0xFF60A5FA), Modifier.weight(1f))
                        }
                    }
                }

                // Featured Tools
                item {
                    SectionHeader(Icons.Default.Star, "Featured Tools", Color(0xFFFBBF24))
                }

                item {
                    FeaturedToolCard(
                        icon = Icons.Default.SmartToy,
                        title = "MyAI Lab Assistant",
                        desc = "Ask any EEE concept — get instant explanations, solve circuit problems, generate practice questions, and get step-by-step help.",
                        accentColor = Color(0xFF818CF8),
                        badgeText = "AI Powered"
                    )
                }

                item {
                    FeaturedToolCard(
                        icon = Icons.Default.Science,
                        title = "Virtual Lab Experiments",
                        desc = "Perform all 12 interactive lab experiments virtually with real-time simulations, truth tables, oscilloscopes, and circuit builders.",
                        accentColor = Color(0xFF22D3EE),
                        badgeText = "12 Labs"
                    )
                }

                item {
                    FeaturedToolCard(
                        icon = Icons.Default.Psychology,
                        title = "Practice Quizzes",
                        desc = "Test yourself with topic-wise MCQ quizzes for all 12 experiments. Instant feedback and explanations for every answer.",
                        accentColor = Color(0xFF4ADE80),
                        badgeText = "12 Quizzes"
                    )
                }

                // Academic Resources
                item {
                    SectionHeader(Icons.Default.TrendingUp, "Academic Resources", Color(0xFF3B82F6))
                }

                items(academicResources) { res ->
                    ResourceCard(res)
                    Spacer(Modifier.height(16.dp))
                }

                // Pro Tip Card
                item {
                    ProTipCard()
                }

                // Branded Footer
                item {
                    FooterSimple()
                }
            }
        }

        // Floating Hamburger Menu Overlay
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
                    HamburgerMenu(isLoggedIn = isLoggedIn, onClose = { isMenuOpen = false }, onNavigate = { route ->
                        onNavigate(route)
                        isMenuOpen = false
                    })
                }
            }
        }
    }
}

@Composable
fun StatCard(icon: ImageVector, value: String, label: String, color: Color, modifier: Modifier) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(16.dp),
        modifier = modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            Spacer(Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(value, color = color, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.width(8.dp))
            }
            Text(label, color = Color(0xFF64748B), fontSize = 12.sp, fontWeight = FontWeight.Bold)
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
        Text(title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
    }
}

@Composable
fun FeaturedToolCard(icon: ImageVector, title: String, desc: String, accentColor: Color, badgeText: String) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.8f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 8.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = accentColor.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(56.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(32.dp))
                    }
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = accentColor.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, accentColor.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
                ) {
                    Text(badgeText, color = accentColor, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(12.dp))
            Text(desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)
            Spacer(Modifier.height(24.dp))
            Text("Open →", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ResourceCard(res: ResourceData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = res.color.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.size(40.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(res.icon, contentDescription = null, tint = res.color, modifier = Modifier.size(24.dp))
                    }
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = Color(0xFF1E293B).copy(alpha = 0.5f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(10.dp))
                ) {
                    Text(res.actionText, color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp))
                }
            }
            Spacer(Modifier.height(16.dp))
            Text(res.title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(8.dp))
            Text(res.desc, color = Color(0xFF64748B), fontSize = 14.sp, lineHeight = 20.sp)
            Spacer(Modifier.height(16.dp))
            Text("Explore →", color = res.color, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ProTipCard() {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.4f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp)
            .border(1.dp, Color(0xFF334155), RoundedCornerShape(24.dp))
    ) {
        Column(
            modifier = Modifier.padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                color = Color(0xFF3B82F6).copy(alpha = 0.1f),
                shape = CircleShape,
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.WorkspacePremium, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(32.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(
                "Pro Tip: Use the AI Assistant before your lab session",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Ask the AI to explain the theory and predict the expected results before you do the actual experiment. It drastically improves your understanding and lab report quality!",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp,
                lineHeight = 22.sp,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Icon(Icons.Default.SmartToy, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(10.dp))
                Text("Try AI Assistant", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun FooterSimple() {
    Column(
        modifier = Modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("SRM EEE Virtual Lab · 26EEE1001T", color = Color(0xFF64748B), fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(24.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Text("Home", color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text("Quizzes", color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text("Team", color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text("About", color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
        }
        Spacer(Modifier.height(48.dp))
        Text("© 2026 SRM Institute of Science and Technology. All rights reserved.", color = Color(0xFF475569), fontSize = 12.sp, textAlign = TextAlign.Center)
    }
}

data class ResourceData(val title: String, val desc: String, val icon: ImageVector, val color: Color, val actionText: String)

val academicResources = listOf(
    ResourceData("EEE PYQs", "Previous year question papers with solutions for all semesters. Filter by year, unit, and topic.", Icons.Outlined.Article, Color(0xFF60A5FA), "View Papers"),
    ResourceData("CT Schedules", "Cycle Test dates, syllabus coverage, and important exam deadlines for 26EEE1001T.", Icons.Outlined.CalendarToday, Color(0xFF4ADE80), "View Schedule"),
    ResourceData("Formula Cheat Sheet", "Quick-reference formulas for KVL, KCL, Thevenin, diode equations, logic gates, and more.", Icons.Outlined.Calculate, Color(0xFFFBBF24), "View Formulas"),
    ResourceData("Reference Books", "Digital library of recommended textbooks and reference materials for 26EEE1001T.", Icons.Outlined.LibraryBooks, Color(0xFFF97316), "Browse Library"),
    ResourceData("Lecture Notes & Slides", "Unit-wise lecture notes, slides, and study materials. Download PDFs for offline study.", Icons.Outlined.MenuBook, Color(0xFFF472B6), "View Notes"),
    ResourceData("Video Tutorials", "Curated YouTube playlists for every experiment — from theory to practical demonstration.", Icons.Outlined.VideoLibrary, Color(0xFFEF4444), "Watch Videos"),
    ResourceData("Lab Manual", "Complete digital version of the SRM EEE Virtual Lab Manual with all procedures, apparatus, and circuits.", Icons.Outlined.Book, Color(0xFF818CF8), "Read Manual"),
    ResourceData("Component Guide", "Learn about every component used in the lab — resistors, diodes, op-amps, logic ICs, and more.", Icons.Outlined.Lightbulb, Color(0xFFFB923C), "Interactive")
)
