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
import androidx.compose.material.icons.automirrored.filled.*
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HomeScreen(isLoggedIn: Boolean, onExploreExperiments: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }

    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.95f) }

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
                horizontalAlignment = Alignment.CenterHorizontally,
                contentPadding = PaddingValues(bottom = 32.dp)
            ) {
                item { Header(currentTime, onMenuClick = { isMenuOpen = !isMenuOpen }) }
                item { HeroSection(onExploreClick = onExploreExperiments, onNavigate = onNavigate) }
                item { FeaturesSection() }
                item { ExperimentsHeader(onViewAllClick = onExploreExperiments) }
                items(experimentListShort) { experiment ->
                    ExperimentCardHome(experiment, onClick = { onNavigate("experiment_detail/${experiment.id}") })
                    Spacer(Modifier.height(16.dp))
                }
                item { Footer(onNavigate) }
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
                    HamburgerMenu(isLoggedIn = isLoggedIn, currentRoute = "home", onClose = { isMenuOpen = false }, onNavigate = { route ->
                        onNavigate(route)
                        isMenuOpen = false
                    })
                }
            }
        }
    }
}

@Composable
fun HeroSection(onExploreClick: () -> Unit, onNavigate: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 48.dp, horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Surface(
            color = Color(0xFF142233).copy(alpha = 0.5f),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.border(1.dp, Color(0xFF24384C), RoundedCornerShape(24.dp))
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                Box(modifier = Modifier.size(8.dp).background(Color(0xFF8B7CF6), CircleShape))
                Spacer(Modifier.width(10.dp))
                Text("26EEE1001T · Virtual Lab", color = Color(0xFF94ACBA), fontSize = 13.sp, fontWeight = FontWeight.Medium)
            }
        }
        Spacer(Modifier.height(32.dp))
        Text(text = "Learn EEE", color = Color.White, fontSize = 52.sp, fontWeight = FontWeight.Black, letterSpacing = (-1.5).sp)
        Text(text = "Interactively", style = TextStyle(brush = Brush.horizontalGradient(listOf(Color(0xFF5EEAD4), Color(0xFFC4A8FF))), fontSize = 52.sp, fontWeight = FontWeight.Black, letterSpacing = (-1.5).sp))
        Spacer(Modifier.height(28.dp))
        Text(text = "A student-built virtual laboratory for SRM's 26EEE1001T course. Perform experiments, take quizzes, and master electrical engineering concepts — all from your browser.", color = Color(0xFF94ACBA), fontSize = 16.sp, textAlign = TextAlign.Center, lineHeight = 26.sp, modifier = Modifier.padding(horizontal = 12.dp))
        Spacer(Modifier.height(48.dp))

        // Premium Gradient Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp)
                .clip(RoundedCornerShape(32.dp))
                .background(Brush.linearGradient(listOf(Color(0xFF0D9488), Color(0xFF9D7CF7))))
                .clickable { onExploreClick() },
            contentAlignment = Alignment.Center
        ) {
            Text("Explore Experiments →", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color.White)
        }

        Spacer(Modifier.height(24.dp))
        TextButton(onClick = { onNavigate("quizzes") }) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Quiz, contentDescription = null, tint = Color(0xFF5EEAD4), modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(10.dp))
                Text("Take a Quiz", color = Color(0xFF5EEAD4), fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun FeaturesSection() {
    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 40.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Surface(color = Color(0xFF1A1638).copy(alpha = 0.8f), shape = RoundedCornerShape(20.dp), modifier = Modifier.border(1.dp, Color(0xFF2B2557), RoundedCornerShape(20.dp))) {
            Text("Why SRM EEE Virtual Lab?", color = Color(0xFFA89BFF), fontSize = 13.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 18.dp, vertical = 8.dp), letterSpacing = 1.sp)
        }
        Spacer(Modifier.height(24.dp))
        Text("Built for Engineering Students", color = Color.White, fontSize = 36.sp, fontWeight = FontWeight.Black, textAlign = TextAlign.Center, lineHeight = 44.sp, letterSpacing = (-0.5).sp)
        Spacer(Modifier.height(40.dp))
        FeatureCard(Icons.Default.Science, "12 Lab Experiments", "Covering all units of 26EEE1001T — from DC circuits to power generation", Color(0xFF5EEAD4))
        Spacer(Modifier.height(20.dp))
        FeatureCard(Icons.Default.Bolt, "Interactive Simulations", "Tinkercad-powered circuit simulations with real-time component interaction", Color(0xFFE8954D))
        Spacer(Modifier.height(20.dp))
        FeatureCard(Icons.Default.Psychology, "Knowledge Quizzes", "Post-experiment MCQ quizzes to reinforce learning and test understanding", Color(0xFFC4A8FF))
    }
}

@Composable
fun FeatureCard(icon: ImageVector, title: String, desc: String, iconTint: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
            .background(Color(0xFF0A131F).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(listOf(Color(0xFF142233), iconTint.copy(alpha = 0.4f), Color(0xFF142233))),
                shape = RoundedCornerShape(28.dp)
            )
    ) {
        Column(modifier = Modifier.padding(28.dp)) {
            Surface(color = iconTint.copy(alpha = 0.1f), shape = RoundedCornerShape(14.dp), modifier = Modifier.size(56.dp)) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(28.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(10.dp))
            Text(desc, color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 24.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun ExperimentsHeader(onViewAllClick: () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 56.dp)) {
        Surface(
            color = Color(0xFF5EEAD4).copy(alpha = 0.1f),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.border(1.dp, Color(0xFF5EEAD4).copy(alpha = 0.2f), RoundedCornerShape(10.dp))
        ) {
            Text("INTERACTIVE LEARNING", color = Color(0xFF5EEAD4), fontSize = 12.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp), letterSpacing = 1.5.sp)
        }
        Spacer(Modifier.height(24.dp))
        Text("Hands-on Experiments", color = Color.White, fontSize = 40.sp, fontWeight = FontWeight.Black, letterSpacing = (-0.5).sp)
        Spacer(Modifier.height(16.dp))
        Text("Six core experiments from your lab manual — with theory, interactive simulations, and quizzes.", color = Color(0xFF94ACBA), fontSize = 16.sp, lineHeight = 26.sp, fontWeight = FontWeight.Medium)
        Spacer(Modifier.height(32.dp))
        TextButton(onClick = onViewAllClick, contentPadding = PaddingValues(0.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("View all 12 experiments", color = Color(0xFF1FD7C4), fontSize = 18.sp, fontWeight = FontWeight.Black)
                Spacer(Modifier.width(10.dp))
                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(24.dp))
            }
        }
    }
}

@Composable
fun ExperimentCardHome(exp: ExperimentHome, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .padding(horizontal = 24.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
            .background(Color(0xFF0A131F).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(listOf(Color(0xFF142233), Color(0xFF1FD7C4).copy(alpha = 0.3f), Color(0xFF142233))),
                shape = RoundedCornerShape(28.dp)
            )
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(28.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(color = Color(0xFF142233), shape = RoundedCornerShape(12.dp), modifier = Modifier.size(44.dp)) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(exp.id.toString().padStart(2, '0'), color = Color(0xFF5EEAD4), fontWeight = FontWeight.Black, fontSize = 20.sp, fontFamily = com.example.srmeeelabfrontend.ui.theme.LabFonts.Mono)
                    }
                }
                Spacer(Modifier.width(16.dp))
                Surface(color = Color(0xFFE8954D).copy(alpha = 0.1f), shape = RoundedCornerShape(20.dp), modifier = Modifier.border(1.dp, Color(0xFFE8954D).copy(alpha = 0.2f), RoundedCornerShape(20.dp))) {
                    Text(exp.category.uppercase(), color = Color(0xFFE8954D), fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.8.sp, fontFamily = com.example.srmeeelabfrontend.ui.theme.LabFonts.Mono, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                }
                Spacer(Modifier.weight(1f))
                Surface(color = Color(0xFF3DE8B0).copy(alpha = 0.1f), shape = RoundedCornerShape(20.dp), modifier = Modifier.border(1.dp, Color(0xFF3DE8B0).copy(alpha = 0.2f), RoundedCornerShape(20.dp))) {
                    Text(exp.difficulty, color = Color(0xFF3DE8B0), fontSize = 11.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(exp.title, color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(12.dp))
            Text(exp.desc, color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 24.sp, fontWeight = FontWeight.Medium)
            Spacer(Modifier.height(32.dp))
            HorizontalDivider(color = Color(0xFF142233), thickness = 1.dp)
            Spacer(Modifier.height(24.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFF3D5468), modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text(exp.duration, color = Color(0xFF6E8699), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text("Start Lab →", color = Color(0xFF1FD7C4), fontWeight = FontWeight.Black, fontSize = 16.sp)
            }
        }
    }
}

data class ExperimentHome(val id: Int, val title: String, val desc: String, val category: String, val difficulty: String, val duration: String)

val experimentListShort = listOf(
    ExperimentHome(1, "Kirchhoff's Voltage Law", "Verify KVL by measuring voltages in a closed-loop DC circuit and confirming their algebraic sum is...", "Circuit Analysis", "Beginner", "45 min"),
    ExperimentHome(2, "Thevenin's Theorem", "Simplify complex linear circuits into a single voltage source and series resistance.", "Circuit Analysis", "Intermediate", "60 min"),
    ExperimentHome(3, "House Wiring", "Implement residential wiring using switches, energy meter, lamps, and fan in parallel circuits.", "Electrical Installation", "Intermediate", "90 min"),
    ExperimentHome(4, "Fluorescent Lamp Wiring", "Study the choke-starter mechanism and wire a 40W fluorescent tube lamp correctly.", "Electrical Installation", "Intermediate", "60 min"),
    ExperimentHome(5, "Staircase Wiring", "Control a single lamp from two locations using two-way switches for staircase circuits.", "Electrical Installation", "Intermediate", "75 min"),
    ExperimentHome(6, "Full Wave Rectifier", "Build a bridge rectifier using 4 diodes and observe waveforms with and without filter capacitor.", "Power Electronics", "Intermediate", "60 min")
)
