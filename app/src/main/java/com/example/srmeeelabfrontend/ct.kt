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
import androidx.compose.material.icons.automirrored.outlined.InsertDriveFile
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
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun CtScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFF34D399), fontSize = 14.sp)
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
                            "CT & Exam Schedules",
                            color = Color(0xFF10B981),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Stay on top of your academic deadlines. Track upcoming Cycle Tests, assignment submissions, and End Semester exams for 26EEE1001T.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                        
                        Spacer(Modifier.height(32.dp))
                        
                        // User Info Card
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF1E293B).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        ) {
                            Text(
                                text = buildAnnotatedString {
                                    append("Signed in as ")
                                    withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                                        append("as9261@srmist.edu.in")
                                    }
                                    append(". You can read and track deadlines, but only admins can manage them.")
                                },
                                color = Color(0xFF64748B),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }
                        
                        Spacer(Modifier.height(48.dp))
                    }
                }

                // Timeline List
                items(scheduleList) { item ->
                    TimelineItem(item)
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
                    HamburgerMenu(isLoggedIn = true, onClose = { isMenuOpen = false }, onNavigate = { route ->
                        onNavigate(route)
                        isMenuOpen = false
                    })
                }
            }
        }
    }
}

@Composable
fun TimelineItem(item: ScheduleData) {
    val infiniteTransition = rememberInfiniteTransition(label = "dotPulse")
    val dotScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "dotScale"
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Timeline connector
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.width(32.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .scale(if (item.status == "Upcoming") dotScale else 1f)
                    .background(if (item.status == "Completed") Color(0xFF10B981) else Color(0xFF3B82F6), CircleShape)
                    .then(
                        if (item.status == "Upcoming") {
                            Modifier.border(2.dp, Color(0xFF3B82F6).copy(alpha = 0.5f), CircleShape)
                        } else Modifier
                    )
            )
            Box(
                modifier = Modifier
                    .width(2.dp)
                    .height(if (item.isLast) 0.dp else 400.dp)
                    .background(Color(0xFF1E293B))
            )
        }
        
        Spacer(Modifier.width(16.dp))
        
        // Schedule Card
        Surface(
            color = Color(0xFF0F172A).copy(alpha = 0.85f),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .weight(1f)
                .padding(bottom = 32.dp)
                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = item.accentColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.size(44.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(item.icon, contentDescription = null, tint = item.accentColor, modifier = Modifier.size(22.dp))
                        }
                    }
                    Spacer(Modifier.width(16.dp))
                    Text(item.title, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                }
                
                Spacer(Modifier.height(20.dp))
                
                Surface(
                    color = (if (item.status == "Completed") Color(0xFF064E3B) else Color(0xFF78350F)).copy(alpha = 0.3f),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(
                        1.dp, 
                        if (item.status == "Completed") Color(0xFF065F46) else Color(0xFF92400E), 
                        RoundedCornerShape(20.dp)
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (item.status == "Completed") {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(6.dp))
                        }
                        Text(
                            item.status, 
                            color = if (item.status == "Completed") Color(0xFF10B981) else Color(0xFFFBBF24), 
                            fontSize = 11.sp, 
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                Spacer(Modifier.height(20.dp))
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(12.dp))
                    Text(item.date, color = Color(0xFF94A3B8), fontSize = 14.sp)
                }
                
                if (item.time.isNotEmpty()) {
                    Spacer(Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(12.dp))
                        Text(item.time, color = Color(0xFF94A3B8), fontSize = 14.sp)
                    }
                }
                
                Spacer(Modifier.height(24.dp))
                
                Surface(
                    color = Color(0xFF020617),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(12.dp))
                            Text("Syllabus Coverage", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(item.syllabus, color = Color(0xFF94A3B8), fontSize = 13.sp, lineHeight = 18.sp)
                    }
                }
            }
        }
    }
}

data class ScheduleData(
    val title: String, 
    val status: String, 
    val date: String, 
    val time: String, 
    val syllabus: String, 
    val icon: ImageVector, 
    val accentColor: Color,
    val isLast: Boolean = false
)

val scheduleList = listOf(
    ScheduleData("Cycle Test 1", "Completed", "August 24, 2024", "10:00 AM - 11:30 AM", "Unit 1 & 2 (DC Circuits & AC Circuits)", Icons.AutoMirrored.Outlined.InsertDriveFile, Color(0xFF60A5FA)),
    ScheduleData("Assignment 1 Deadline", "Completed", "September 15, 2024", "11:59 PM", "Unit 1 & 2 Problems", Icons.Default.ErrorOutline, Color(0xFFA78BFA)),
    ScheduleData("Cycle Test 2", "Upcoming", "October 20, 2024", "10:00 AM - 11:30 AM", "Unit 3 & 4 (Machines & Semiconductors)", Icons.AutoMirrored.Outlined.InsertDriveFile, Color(0xFF60A5FA)),
    ScheduleData("Model Lab Exam", "Upcoming", "November 05, 2024", "08:30 AM - 12:30 PM", "All Experiments (1-12)", Icons.Default.AccessTime, Color(0xFF22D3EE), isLast = true)
)
