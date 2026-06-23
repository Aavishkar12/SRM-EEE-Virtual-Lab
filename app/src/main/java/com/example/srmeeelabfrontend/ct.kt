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
import com.example.srmeeelabfrontend.network.RetrofitClient
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun CtScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }

    // --- API state ---
    var schedules by remember { mutableStateOf<List<ScheduleData>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

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

    // Fetch CT / exam schedules from the backend
    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getSchedules()
            if (response.isSuccessful) {
                val apiList = response.body() ?: emptyList()
                schedules = apiList.mapIndexed { index, item ->
                    ScheduleData(
                        title = item.title,
                        status = item.status,
                        date = item.date,
                        time = item.time,
                        syllabus = item.syllabus,
                        icon = iconForScheduleType(item.type),
                        accentColor = colorForScheduleType(item.type),
                        isLast = index == apiList.lastIndex
                    )
                }
            } else {
                errorMessage = "Couldn't load schedules (code ${response.code()})"
            }
        } catch (e: Exception) {
            errorMessage = e.localizedMessage ?: "Couldn't reach the server"
        } finally {
            isLoading = false
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

                // Breadcrumb
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                            .clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF3DE8B0), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFF3DE8B0), fontSize = 14.sp)
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
                            color = Color(0xFF1FC98D),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Stay on top of your academic deadlines. Track upcoming Cycle Tests, assignment submissions, and End Semester exams for 26EEE1001T.",
                            color = Color(0xFF94ACBA),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )

                        Spacer(Modifier.height(32.dp))

                        // User Info Card
                        Surface(
                            color = Color(0xFF0A131F).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF142233).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        ) {
                            Text(
                                text = buildAnnotatedString {
                                    append("Signed in as ")
                                    withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                                        append("as9261@srmist.edu.in")
                                    }
                                    append(". You can read and track deadlines, but only admins can manage them.")
                                },
                                color = Color(0xFF6E8699),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }

                        Spacer(Modifier.height(48.dp))
                    }
                }

                // Timeline List (loading / error / empty / data)
                when {
                    isLoading -> item {
                        Box(modifier = Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = Color(0xFF1FC98D))
                        }
                    }
                    errorMessage != null -> item {
                        Text(
                            errorMessage ?: "Something went wrong",
                            color = Color(0xFFFF6B6B),
                            fontSize = 14.sp,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 24.dp)
                        )
                    }
                    schedules.isEmpty() -> item {
                        Text(
                            "No schedules posted yet.",
                            color = Color(0xFF6E8699),
                            fontSize = 14.sp,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 24.dp)
                        )
                    }
                    else -> items(schedules) { item ->
                        TimelineItem(item)
                    }
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
                        currentRoute = "ct",
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
                    .background(if (item.status == "Completed") Color(0xFF1FC98D) else Color(0xFF1FD7C4), CircleShape)
                    .then(
                        if (item.status == "Upcoming") {
                            Modifier.border(2.dp, Color(0xFF1FD7C4).copy(alpha = 0.5f), CircleShape)
                        } else Modifier
                    )
            )
            Box(
                modifier = Modifier
                    .width(2.dp)
                    .height(if (item.isLast) 0.dp else 400.dp)
                    .background(Color(0xFF142233))
            )
        }

        Spacer(Modifier.width(16.dp))

        // Schedule Card
        Surface(
            color = Color(0xFF0A131F).copy(alpha = 0.85f),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .weight(1f)
                .padding(bottom = 32.dp)
                .border(1.dp, Color(0xFF142233), RoundedCornerShape(20.dp))
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
                    color = (if (item.status == "Completed") Color(0xFF0A3D32) else Color(0xFF3D2412)).copy(alpha = 0.3f),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(
                        1.dp,
                        if (item.status == "Completed") Color(0xFF0C4A3C) else Color(0xFF6B3A14),
                        RoundedCornerShape(20.dp)
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (item.status == "Completed") {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF1FC98D), modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(6.dp))
                        }
                        Text(
                            item.status,
                            color = if (item.status == "Completed") Color(0xFF1FC98D) else Color(0xFFE8954D),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(Modifier.height(20.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF1FC98D), modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(12.dp))
                    Text(item.date, color = Color(0xFF94ACBA), fontSize = 14.sp)
                }

                if (item.time.isNotEmpty()) {
                    Spacer(Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFF1FC98D), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(12.dp))
                        Text(item.time, color = Color(0xFF94ACBA), fontSize = 14.sp)
                    }
                }

                Spacer(Modifier.height(24.dp))

                Surface(
                    color = Color(0xFF05080D),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF94ACBA), modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(12.dp))
                            Text("Syllabus Coverage", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(item.syllabus, color = Color(0xFF94ACBA), fontSize = 13.sp, lineHeight = 18.sp)
                    }
                }
            }
        }
    }
}

// Maps the backend's "type" field (Exam / Submission / Lab / ...) to an icon + accent color,
// since the API doesn't send UI styling directly.
private fun iconForScheduleType(type: String): ImageVector = when (type) {
    "Exam" -> Icons.AutoMirrored.Outlined.InsertDriveFile
    "Submission" -> Icons.Default.ErrorOutline
    "Lab" -> Icons.Default.AccessTime
    else -> Icons.AutoMirrored.Outlined.InsertDriveFile
}

private fun colorForScheduleType(type: String): Color = when (type) {
    "Exam" -> Color(0xFF5EEAD4)
    "Submission" -> Color(0xFFC4A8FF)
    "Lab" -> Color(0xFF53F1E0)
    else -> Color(0xFF5EEAD4)
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