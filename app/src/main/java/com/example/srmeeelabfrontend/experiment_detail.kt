package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
fun ExperimentDetailScreen(experimentId: Int, onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableStateOf("Theory") }
    
    val contentAlpha = remember { Animatable(0f) }
    
    LaunchedEffect(Unit) {
        contentAlpha.animateTo(1f, animationSpec = tween(800, easing = FastOutSlowInEasing))
    }

    LaunchedEffect(Unit) {
        while (true) {
            currentTime = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            delay(1000)
        }
    }

    val tabs = listOf("Theory", "Procedure", "Interactive", "Simulation", "Quiz", "Video", "References", "Gallery")

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        AnimatedBackground()

        Scaffold(
            containerColor = Color.Transparent,
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value)
            ) {
                // Header
                Header(currentTime, onMenuClick = { isMenuOpen = !isMenuOpen })

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(bottom = 32.dp)
                ) {
                    // Back Button
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 16.dp)
                                .clickable { onBack() },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Back to Experiments", color = Color(0xFF3B82F6), fontSize = 15.sp, fontWeight = FontWeight.Medium)
                        }
                    }

                    // Experiment Info
                    item {
                        Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = Color(0xFF1E293B),
                                    shape = CircleShape,
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(experimentId.toString(), color = Color(0xFF60A5FA), fontWeight = FontWeight.Bold)
                                    }
                                }
                                Spacer(Modifier.width(12.dp))
                                Surface(
                                    color = Color(0xFF1E293B).copy(alpha = 0.5f),
                                    shape = RoundedCornerShape(20.dp),
                                    modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                                ) {
                                    Text(
                                        "Circuit Analysis",
                                        color = Color(0xFF60A5FA),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                            Spacer(Modifier.height(16.dp))
                            Text(
                                "Kirchhoff's Voltage Law",
                                color = Color.White,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "To verify Kirchhoff's voltage law for the given circuit.",
                                color = Color(0xFF94A3B8),
                                fontSize = 16.sp
                            )
                            
                            Spacer(Modifier.height(24.dp))
                            
                            Surface(
                                color = Color(0xFF0F172A).copy(alpha = 0.8f),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.size(70.dp).border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(24.dp))
                                    Text("EXP-1", color = Color(0xFF64748B), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    // Tab Navigation
                    item {
                        Spacer(Modifier.height(32.dp))
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp)),
                            color = Color(0xFF0F172A).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            LazyRow(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(tabs) { tab ->
                                    val isSelected = selectedTab == tab
                                    Surface(
                                        color = if (isSelected) Color(0xFF3B82F6).copy(alpha = 0.2f) else Color.Transparent,
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier
                                            .clickable { selectedTab = tab }
                                            .border(
                                                width = 1.dp,
                                                color = if (isSelected) Color(0xFF3B82F6) else Color.Transparent,
                                                shape = RoundedCornerShape(10.dp)
                                            )
                                    ) {
                                        Text(
                                            text = tab,
                                            color = if (isSelected) Color.White else Color(0xFF94A3B8),
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
                                        )
                                    }
                                }
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                    }

                    // Content based on Tab
                    item {
                        Column(modifier = Modifier.padding(horizontal = 24.dp)) {
                            AnimatedContent(
                                targetState = selectedTab,
                                transitionSpec = {
                                    fadeIn(animationSpec = tween(300)) togetherWith fadeOut(animationSpec = tween(300))
                                },
                                label = "TabContentTransition"
                            ) { targetTab ->
                                when (targetTab) {
                                    "Theory" -> TheoryContent()
                                    "Procedure" -> ProcedureContent()
                                    "Interactive" -> InteractiveContent()
                                    "Simulation" -> SimulationContent()
                                    "Quiz" -> QuizDetailContent(onNavigate)
                                    "Video" -> VideoContent()
                                    "References" -> ReferencesContent()
                                    "Gallery" -> GalleryContent()
                                }
                            }
                        }
                    }
                    
                    item {
                        Footer(onNavigate)
                    }
                    
                    item { Spacer(Modifier.height(40.dp)) }
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
fun TheoryContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(
                "STATEMENT:",
                color = Color(0xFF60A5FA),
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 1.sp
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "KVL: In any closed path / mesh, the algebraic sum of all the voltages is zero.",
                color = Color.White,
                fontSize = 16.sp,
                lineHeight = 24.sp
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero. This is a fundamental principle in circuit analysis.",
                color = Color(0xFF94A3B8),
                fontSize = 16.sp,
                lineHeight = 24.sp
            )
            Spacer(Modifier.height(24.dp))
            Text(
                "Mathematically, it is expressed as:",
                color = Color(0xFF94A3B8),
                fontSize = 16.sp
            )
            Spacer(Modifier.height(12.dp))
            Text(
                "ΣV = 0",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Where:\n• ΣV represents the sum of all voltage drops and rises around a closed loop",
                color = Color(0xFF94A3B8),
                fontSize = 16.sp,
                lineHeight = 24.sp
            )
            
            Spacer(Modifier.height(32.dp))
            Surface(
                color = Color(0xFF020617),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("Kirchhoff's Voltage Law", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Understanding the theoretical principles is essential before conducting the practical experiment.",
                        color = Color(0xFF64748B),
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
fun ProcedureContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(
                "EXPERIMENTAL PROCEDURE:",
                color = Color(0xFF60A5FA),
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 1.sp
            )
            Spacer(Modifier.height(16.dp))
            val steps = listOf(
                "1. Set up a circuit with multiple voltage sources and resistors in a closed loop.",
                "2. Measure the voltage across each component in the circuit.",
                "3. Record all voltage measurements, noting whether they are voltage rises (from sources) or drops (across loads).",
                "4. Sum all voltages around the loop, considering their polarities.",
                "5. Verify that the sum equals zero, within measurement error.",
                "6. Repeat for different loops in the circuit if multiple loops exist.",
                "7. Compare experimental results with theoretical calculations."
            )
            steps.forEach { step ->
                Text(step, color = Color.White, fontSize = 16.sp, lineHeight = 24.sp)
                Spacer(Modifier.height(12.dp))
            }
            
            Spacer(Modifier.height(32.dp))
            Text(
                "THEORETICAL VALUES:",
                color = Color(0xFF60A5FA),
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 1.sp
            )
            Spacer(Modifier.height(16.dp))
            // Basic Table implementation
            Column(modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B))) {
                Row(modifier = Modifier.background(Color(0xFF1E293B).copy(alpha = 0.5f))) {
                    TableCell("Sl.No.", weight = 0.15f)
                    TableCell("RPS Voltage (E) Volts", weight = 0.35f)
                    TableCell("V1 Volts", weight = 0.25f)
                    TableCell("V2 Volts", weight = 0.25f)
                }
                repeat(4) { i ->
                    Row {
                        TableCell((i+1).toString(), weight = 0.15f)
                        TableCell((6*(i+1)).toString(), weight = 0.35f)
                        TableCell("%.2f".format(2.3 * (i+1)), weight = 0.25f)
                        TableCell("%.2f".format(3.7 * (i+1)), weight = 0.25f)
                    }
                }
            }
        }
    }
}

@Composable
fun RowScope.TableCell(text: String, weight: Float) {
    Text(
        text = text,
        modifier = Modifier.weight(weight).border(0.5.dp, Color(0xFF1E293B)).padding(8.dp),
        color = Color.White,
        fontSize = 12.sp,
        textAlign = TextAlign.Center
    )
}

@Composable
fun InteractiveContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(
                "Kirchhoff's Voltage Law - Interactive Demonstration",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(8.dp))
            Text("Step 1 of 5", color = Color(0xFF64748B), fontSize = 14.sp)
            Spacer(Modifier.height(16.dp))
            
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Icon(Icons.Default.Refresh, null, tint = Color.White)
                Icon(Icons.Default.ChevronLeft, null, tint = Color.White)
                Icon(Icons.Default.PlayArrow, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(24.dp))
                Icon(Icons.Default.ChevronRight, null, tint = Color.White)
            }
            
            Spacer(Modifier.height(32.dp))
            Text("Introduction to Kirchhoff's Voltage Law", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text(
                "Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero.",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp,
                lineHeight = 22.sp
            )
            
            Spacer(Modifier.height(32.dp))
            Surface(
                color = Color(0xFF020617),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("KVL Circuit Demonstration", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)), shape = RoundedCornerShape(8.dp)) {
                            Text("Show Values", color = Color(0xFF60A5FA), fontSize = 12.sp)
                        }
                        Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF064E3B)), shape = RoundedCornerShape(8.dp)) {
                            Text("Demonstrate KVL", color = Color(0xFF34D399), fontSize = 12.sp)
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                    // Placeholder for Circuit Image/Drawing
                    Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.DarkGray.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.ElectricBolt, null, tint = Color(0xFFFBBF24), modifier = Modifier.size(100.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun SimulationContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Tungsten, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(64.dp))
            Spacer(Modifier.height(24.dp))
            Text("Interactive Circuit Simulator", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            Text(
                "Use our Tinkercad-powered simulator to build and test KVL circuits in real-time.",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Text("Launch Simulator", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun QuizDetailContent(onNavigate: (String) -> Unit) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(
                "Kirchhoff's Voltage Law - Knowledge Check",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Ready to test your understanding? Start the interactive quiz to challenge yourself.",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp,
                lineHeight = 22.sp
            )
            
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { onNavigate("quiz_attempt/1") },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Start Interactive Quiz", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun VideoContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.PlayCircle, null, tint = Color(0xFFEF4444), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Video Tutorial", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(64.dp))
                    Text("Watch on YouTube", color = Color.White, fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(24.dp))
            Text(
                "In this video, we demonstrate the step-by-step procedure to verify Kirchhoff's Voltage Law using a breadboard and basic components.",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp,
                lineHeight = 22.sp
            )
        }
    }
}

@Composable
fun ReferencesContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.MenuBook, null, tint = Color(0xFF10B981), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Study References", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(24.dp))
            val references = listOf(
                "Standard Textbook of Electrical Technology - B.L. Theraja",
                "Electronic Devices and Circuit Theory - Boylestad",
                "AllAboutCircuits - KVL Theory & Examples",
                "Khan Academy - Kirchhoff's Laws",
                "MIT OpenCourseWare - Basic Circuit Analysis"
            )
            references.forEach { ref ->
                Row(
                    modifier = Modifier.padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Link, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(12.dp))
                    Text(ref, color = Color(0xFF60A5FA), fontSize = 15.sp)
                }
            }
        }
    }
}

@Composable
fun GalleryContent() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Image, null, tint = Color(0xFFF472B6), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Component Gallery", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(8.dp))
            Text("Components and equipment used in this experiment", color = Color(0xFF64748B), fontSize = 14.sp)
            
            Spacer(Modifier.height(48.dp))
            Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.BrokenImage, null, tint = Color(0xFF1E293B), modifier = Modifier.size(64.dp))
                Spacer(Modifier.height(16.dp))
                Text("No components added yet.", color = Color(0xFF475569), fontSize = 15.sp)
            }
            Spacer(Modifier.height(48.dp))
        }
    }
}
