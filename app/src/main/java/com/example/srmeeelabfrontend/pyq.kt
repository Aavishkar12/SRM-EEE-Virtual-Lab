package com.example.srmeeelabfrontend

import com.example.srmeeelabfrontend.network.PyqApiModel
import com.example.srmeeelabfrontend.network.RetrofitClient
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
import androidx.compose.foundation.text.BasicTextField
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
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
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
fun PyqScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var pyqs by remember { mutableStateOf<List<PyqApiModel>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

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

    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getPyqs()
            if (response.isSuccessful) {
                pyqs = response.body() ?: emptyList()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    val filteredPyqs = pyqs.filter { paper ->
        searchQuery.isEmpty() ||
                paper.subject.contains(searchQuery, ignoreCase = true) ||
                paper.unit.contains(searchQuery, ignoreCase = true)
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFF6E8699), fontSize = 14.sp)
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
                            "Previous Year\nQuestion Papers",
                            color = Color(0xFF5EEAD4),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Access a comprehensive archive of cycle test and end-semester question papers to prepare effectively for your exams.",
                            color = Color(0xFF94ACBA),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )

                        Spacer(Modifier.height(32.dp))

                        // Search Bar
                        Surface(
                            color = Color(0xFF0A131F).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF3D5468), modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(12.dp))
                                BasicTextField(
                                    value = searchQuery,
                                    onValueChange = { searchQuery = it },
                                    textStyle = TextStyle(color = Color.White, fontSize = 15.sp),
                                    cursorBrush = SolidColor(Color(0xFF1FD7C4)),
                                    modifier = Modifier.weight(1f),
                                    decorationBox = { innerTextField ->
                                        if (searchQuery.isEmpty()) {
                                            Text("Search subject or unit...", color = Color(0xFF3D5468), fontSize = 15.sp)
                                        }
                                        innerTextField()
                                    }
                                )
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        // Filter Dropdowns
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            FilterDropdown("All Years")
                            FilterDropdown("All Exams")
                        }

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
                                    append(". You can read and download PYQs, but only admins can manage them.")
                                },
                                color = Color(0xFF6E8699),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }

                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Question Papers List
                if (isLoading) {
                    item {
                        CircularProgressIndicator(
                            color = Color(0xFF1FD7C4),
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else {
                    items(filteredPyqs) { paper ->
                        val uiPaper = PyqData(
                            examType = paper.type,
                            subject = paper.subject,
                            units = paper.unit,
                            date = paper.date,
                            year = paper.year,
                            size = paper.size
                        )
                        PyqCard(uiPaper)
                        Spacer(Modifier.height(16.dp))
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
                        currentRoute = "pyq",
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
fun FilterDropdown(text: String) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.5f),
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(10.dp))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text, color = Color.White, fontSize = 14.sp)
            Spacer(Modifier.width(8.dp))
            Icon(Icons.Default.KeyboardArrowDown, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
        }
    }
}

@Composable
fun PyqCard(paper: PyqData) {
    val infiniteTransition = rememberInfiniteTransition(label = "pyqGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.7f,
        animationSpec = infiniteRepeatable(
            animation = tween(2500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF142233),
                        Color(0xFF1FD7C4).copy(alpha = glowAlpha),
                        Color(0xFF142233)
                    )
                ),
                shape = RoundedCornerShape(20.dp)
            )
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = Color(0xFF1FD7C4).copy(alpha = 0.15f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.AutoMirrored.Outlined.InsertDriveFile, contentDescription = null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(22.dp))
                    }
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = Color(0xFF142233),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Text(paper.year, color = Color(0xFF94ACBA), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                }
            }

            Spacer(Modifier.height(20.dp))
            Text(paper.examType, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Text(paper.subject, color = Color(0xFF6E8699), fontSize = 15.sp, modifier = Modifier.padding(top = 4.dp))

            Spacer(Modifier.height(16.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF3D5468), modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(8.dp))
                Text(paper.units, color = Color(0xFF6E8699), fontSize = 14.sp)
            }
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF3D5468), modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(8.dp))
                Text(paper.date, color = Color(0xFF6E8699), fontSize = 14.sp)
            }

            Spacer(Modifier.height(24.dp))
            HorizontalDivider(color = Color(0xFF142233), thickness = 1.dp)
            Spacer(Modifier.height(20.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(paper.size, color = Color(0xFF3D5468), fontSize = 13.sp, fontWeight = FontWeight.Medium)
                Spacer(Modifier.weight(1f))
                Button(
                    onClick = { },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF142233)),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color(0xFF5EEAD4), modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Download PDF", color = Color(0xFF5EEAD4), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

data class PyqData(val examType: String, val subject: String, val units: String, val date: String, val year: String, val size: String)