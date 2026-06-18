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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.MenuBook
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
fun LabManualScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF6366F1), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFF6366F1), fontSize = 14.sp)
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
                            "Virtual Lab Manual",
                            color = Color(0xFF60A5FA),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Download the complete digital version of the SRM EEE Virtual Lab Manual, containing procedures, apparatus lists, and theory.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                        
                        Spacer(Modifier.height(32.dp))
                        
                        // Download Full Manual Button
                        Button(
                            onClick = { },
                            modifier = Modifier.fillMaxWidth().height(56.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5)),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color.White)
                            Spacer(Modifier.width(12.dp))
                            Text("Download Full Manual", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                        
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
                                    append(". You can read and download manual chapters, but only admins can manage them.")
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

                // Chapters Section
                item {
                    Surface(
                        color = Color(0xFF0F172A).copy(alpha = 0.85f),
                        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp).border(1.dp, Color(0xFF1E293B), RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                    ) {
                        Row(
                            modifier = Modifier.padding(20.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.AutoMirrored.Filled.MenuBook, contentDescription = null, tint = Color(0xFF818CF8), modifier = Modifier.size(24.dp))
                            Spacer(Modifier.width(16.dp))
                            Text("Chapters & Experiments", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                items(manualChapterList) { chapter ->
                    ManualChapterCard(chapter)
                }
                
                item { Spacer(Modifier.height(16.dp)) }
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
fun ManualChapterCard(chapter: ManualChapterData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(0.5.dp, Color(0xFF1E293B))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = Color(0xFF4F46E5).copy(alpha = 0.15f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Description, contentDescription = null, tint = Color(0xFF818CF8), modifier = Modifier.size(22.dp))
                    }
                }
                Spacer(Modifier.width(16.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(chapter.title, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Row {
                        Surface(
                            color = Color(0xFF1E293B),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Pages ${chapter.pages}", color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                        }
                        Spacer(Modifier.width(8.dp))
                        Text("•  ${chapter.size}  •  PDF", color = Color(0xFF475569), fontSize = 11.sp, modifier = Modifier.align(Alignment.CenterVertically))
                    }
                }
                IconButton(
                    onClick = { },
                    modifier = Modifier.background(Color(0xFF1E293B), RoundedCornerShape(8.dp))
                ) {
                    Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color(0xFF818CF8), modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("PDF", color = Color(0xFF818CF8), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

data class ManualChapterData(val title: String, val pages: String, val size: String)

val manualChapterList = listOf(
    ManualChapterData("Exp 2: Verification of Thevenin's Theorem", "13-18", "920 KB"),
    ManualChapterData("Exp 8: Implementation of Half/Full Adder", "53-60", "1.3 MB"),
    ManualChapterData("Exp 6: Half Wave and Full Wave Rectifiers", "38-45", "1.4 MB"),
    ManualChapterData("Exp 1: Verification of KCL and KVL", "6-12", "850 KB"),
    ManualChapterData("Exp 4: V-I Characteristics of PN Junction Diode", "25-31", "1.1 MB")
)
