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
fun LectureNotesScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFF64748B), fontSize = 14.sp)
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
                            "Lecture Notes & Slides",
                            color = Color(0xFFF472B6),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Access unit-wise presentations, handwritten notes, and practice worksheets provided by the faculty.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                        
                        Spacer(Modifier.height(32.dp))
                        
                        // Search Bar
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF475569), modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(12.dp))
                                BasicTextField(
                                    value = searchQuery,
                                    onValueChange = { searchQuery = it },
                                    textStyle = TextStyle(color = Color.White, fontSize = 15.sp),
                                    cursorBrush = SolidColor(Color(0xFF3B82F6)),
                                    modifier = Modifier.weight(1f),
                                    decorationBox = { innerTextField ->
                                        if (searchQuery.isEmpty()) {
                                            Text("Search subject or unit...", color = Color(0xFF475569), fontSize = 15.sp)
                                        }
                                        innerTextField()
                                    }
                                )
                            }
                        }
                        
                        Spacer(Modifier.height(16.dp))
                        
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
                                    append(". You can read and download notes, but only admins can manage them.")
                                },
                                color = Color(0xFF64748B),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }
                        
                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Units List
                items(unitList) { unit ->
                    UnitExpandableCard(unit)
                    Spacer(Modifier.height(16.dp))
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
fun UnitExpandableCard(unit: UnitData) {
    var expanded by remember { mutableStateOf(false) }
    
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(
                width = 1.dp,
                color = if (expanded) Color(0xFFF472B6).copy(alpha = 0.5f) else Color(0xFF1E293B),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable { expanded = !expanded }
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = Color(0xFFF472B6).copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Layers, contentDescription = null, tint = Color(0xFFF472B6), modifier = Modifier.size(24.dp))
                    }
                }
                Spacer(Modifier.width(16.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "Unit ${unit.id}: ${unit.title}",
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        unit.description,
                        color = Color(0xFF94A3B8),
                        fontSize = 14.sp,
                        maxLines = if (expanded) Int.MAX_VALUE else 2
                    )
                }
                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = Color(0xFF64748B),
                    modifier = Modifier.size(24.dp)
                )
            }
            
            AnimatedVisibility(visible = expanded) {
                Column {
                    Spacer(Modifier.height(20.dp))
                    unit.resources.forEach { resource ->
                        ResourceCard(resource)
                        Spacer(Modifier.height(12.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun ResourceCard(resource: LectureResource) {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.5f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF334155).copy(alpha = 0.5f), RoundedCornerShape(16.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.AutoMirrored.Outlined.InsertDriveFile,
                    contentDescription = null,
                    tint = Color(0xFF94A3B8),
                    modifier = Modifier.size(20.dp)
                )
                Spacer(Modifier.width(12.dp))
                Text(resource.name, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = when(resource.type) {
                        "NOTES" -> Color(0xFF3B82F6).copy(alpha = 0.2f)
                        "SLIDES" -> Color(0xFFEC4899).copy(alpha = 0.2f)
                        else -> Color(0xFF10B981).copy(alpha = 0.2f)
                    },
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        resource.type,
                        color = when(resource.type) {
                            "NOTES" -> Color(0xFF60A5FA)
                            "SLIDES" -> Color(0xFFF472B6)
                            else -> Color(0xFF34D399)
                        },
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
                Spacer(Modifier.width(12.dp))
                Text("•  ${resource.fileSize}", color = Color(0xFF64748B), fontSize = 12.sp)
                Spacer(Modifier.width(12.dp))
                Text("•  Added ${resource.date}", color = Color(0xFF64748B), fontSize = 12.sp)
            }
            
            Spacer(Modifier.height(16.dp))
            Button(
                onClick = { },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0F172A)),
                shape = RoundedCornerShape(10.dp),
                contentPadding = PaddingValues(vertical = 10.dp)
            ) {
                Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(8.dp))
                Text("Download", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

data class UnitData(val id: Int, val title: String, val description: String, val resources: List<LectureResource>)
data class LectureResource(val name: String, val type: String, val fileSize: String, val date: String)

val commonResources = listOf(
    LectureResource("KCL & KVL Complete Guide", "NOTES", "1.1 MB", "Aug 15"),
    LectureResource("Introduction to Basic Electrical Variables", "SLIDES", "2.4 MB", "Aug 10"),
    LectureResource("Mesh & Nodal Analysis Problems", "WORKSHEET", "800 KB", "Aug 20")
)

val unitList = listOf(
    UnitData(1, "DC Circuits", "Fundamental concepts, Ohm's law, Kirchhoff's laws, Nodal and Mesh analysis.", commonResources),
    UnitData(2, "AC Circuits", "Sinusoidal steady-state analysis, phasors, impedance, power in AC circuits.", commonResources),
    UnitData(3, "Electrical Machines", "Principles of DC machines, Transformers, and Induction Motors.", commonResources),
    UnitData(4, "Semiconductor Devices", "PN junction diodes, Zener diodes, BJT and FET transistors.", commonResources),
    UnitData(5, "Digital Electronics", "Number systems, Logic gates, Boolean algebra, Combinational circuits.", commonResources)
)
