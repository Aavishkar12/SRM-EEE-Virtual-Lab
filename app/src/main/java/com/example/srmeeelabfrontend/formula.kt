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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun FormulaScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFFFBBF24), fontSize = 14.sp)
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
                            "Formula Cheat Sheet",
                            color = Color(0xFFFBBF24),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "A quick-reference guide for all essential Electrical and Electronics Engineering equations.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                        
                        Spacer(Modifier.height(32.dp))
                        
                        // Download Button
                        Button(
                            onClick = { },
                            modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFFFBBF24).copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(vertical = 14.dp)
                        ) {
                            Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color(0xFFFBBF24))
                            Spacer(Modifier.width(12.dp))
                            Text("Download Full PDF", color = Color(0xFFFBBF24), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        }
                        
                        Spacer(Modifier.height(32.dp))
                        
                        // User Info Card
                        Surface(
                            color = Color(0xFF1E1B1E).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF2E2E2E).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        ) {
                            Text(
                                text = buildAnnotatedString {
                                    append("Signed in as ")
                                    withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                                        append("as9261@srmist.edu.in")
                                    }
                                    append(". You can read the formula cards, but only admins can manage them.")
                                },
                                color = Color(0xFF737373),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }
                        
                        Spacer(Modifier.height(32.dp))
                    }
                }

                // DC Circuits Section
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(24.dp))
                        Spacer(Modifier.width(12.dp))
                        Text("DC Circuits", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                    }
                }

                items(dcFormulaList) { formula ->
                    FormulaCard(formula)
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
fun FormulaCard(formula: FormulaData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(formula.title, color = Color(0xFF64748B), fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
            Spacer(Modifier.height(20.dp))
            
            Surface(
                color = Color.Black.copy(alpha = 0.3f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    formula.equation,
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(vertical = 24.dp, horizontal = 16.dp)
                )
            }
            
            Spacer(Modifier.height(20.dp))
            Text(formula.description, color = Color(0xFF475569), fontSize = 14.sp, lineHeight = 20.sp)
        }
    }
}

data class FormulaData(val title: String, val equation: String, val description: String)

val dcFormulaList = listOf(
    FormulaData("KIRCHHOFF'S CURRENT LAW (KCL)", "Σ I_in = Σ I_out", "The sum of currents entering a node equals the sum leaving."),
    FormulaData("POWER EQUATION", "P = V × I = I²R = V²/R", "Electrical power consumed by a resistor."),
    FormulaData("KIRCHHOFF'S VOLTAGE LAW (KVL)", "Σ V_drop = Σ V_rise", "The directed sum of potential differences around any closed loop is zero."),
    FormulaData("OHM'S LAW", "V = I × R", "Relationship between voltage, current, and resistance.")
)
