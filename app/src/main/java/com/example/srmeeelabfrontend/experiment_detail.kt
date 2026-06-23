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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.network.ExperimentApiModel
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.*
import com.example.srmeeelabfrontend.network.RetrofitClient

@Composable
fun ExperimentDetailScreen(experimentId: Int, onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableStateOf("Aim") }
    var experiment by remember { mutableStateOf<ExperimentApiModel?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    val contentAlpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        contentAlpha.animateTo(1f, animationSpec = tween(800, easing = FastOutSlowInEasing))
    }

    LaunchedEffect(experimentId) {
        try {
            val response = RetrofitClient.apiService.getExperimentById(experimentId)
            if (response.isSuccessful) {
                experiment = response.body()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    LaunchedEffect(Unit) {
        while (true) {
            currentTime = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            delay(1000)
        }
    }

    val tabs = listOf("Aim", "Apparatus", "Theory", "Procedure", "Interactive", "Simulation", "Quiz", "Video", "References", "Gallery")

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
        AnimatedBackground()

        Scaffold(containerColor = Color.Transparent) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value)
            ) {
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
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Back to Experiments", color = Color(0xFF1FD7C4), fontSize = 15.sp, fontWeight = FontWeight.Medium)
                        }
                    }

                    // Experiment Info
                    item {
                        Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = Color(0xFF142233),
                                    shape = CircleShape,
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(experimentId.toString(), color = Color(0xFF5EEAD4), fontWeight = FontWeight.Bold)
                                    }
                                }
                                Spacer(Modifier.width(12.dp))
                                Surface(
                                    color = Color(0xFF142233).copy(alpha = 0.5f),
                                    shape = RoundedCornerShape(20.dp),
                                    modifier = Modifier.border(1.dp, Color(0xFF24384C), RoundedCornerShape(20.dp))
                                ) {
                                    Text(
                                        experiment?.category ?: "",
                                        color = Color(0xFF5EEAD4),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                            Spacer(Modifier.height(16.dp))
                            Text(
                                experiment?.title ?: "Loading...",
                                color = Color.White,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                experiment?.description ?: "",
                                color = Color(0xFF94ACBA),
                                fontSize = 16.sp
                            )

                            Spacer(Modifier.height(24.dp))

                            // Duration + Difficulty badges
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Surface(
                                    color = Color(0xFF0A131F).copy(alpha = 0.8f),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
                                ) {
                                    Column(
                                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFFE8954D), modifier = Modifier.size(20.dp))
                                        Spacer(Modifier.height(4.dp))
                                        Text(experiment?.difficulty ?: "", color = Color(0xFF6E8699), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                Surface(
                                    color = Color(0xFF0A131F).copy(alpha = 0.8f),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
                                ) {
                                    Column(
                                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Icon(Icons.Default.Timer, contentDescription = null, tint = Color(0xFF5EEAD4), modifier = Modifier.size(20.dp))
                                        Spacer(Modifier.height(4.dp))
                                        Text(experiment?.duration ?: "", color = Color(0xFF6E8699), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
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
                                .border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp)),
                            color = Color(0xFF0A131F).copy(alpha = 0.5f),
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
                                        color = if (isSelected) Color(0xFF1FD7C4).copy(alpha = 0.2f) else Color.Transparent,
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier
                                            .clickable { selectedTab = tab }
                                            .border(
                                                width = 1.dp,
                                                color = if (isSelected) Color(0xFF1FD7C4) else Color.Transparent,
                                                shape = RoundedCornerShape(10.dp)
                                            )
                                    ) {
                                        Text(
                                            text = tab,
                                            color = if (isSelected) Color.White else Color(0xFF94ACBA),
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

                    // Tab Content
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
                                    "Aim" -> AimContent(aim = experiment?.aim)
                                    "Apparatus" -> ApparatusContent(apparatus = experiment?.apparatus)
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

                    item { Footer(onNavigate) }
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
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "experiment_detail/$experimentId",
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

// ── NEW: Aim Tab ─────────────────────────────────────────────────────────────
@Composable
fun AimContent(aim: String?) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFFE8954D), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Aim", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(20.dp))
            if (aim != null) {
                Text(
                    text = aim,
                    color = Color(0xFF94ACBA),
                    fontSize = 16.sp,
                    lineHeight = 26.sp
                )
            } else {
                Text("Aim not available for this experiment.", color = Color(0xFF3D5468), fontSize = 15.sp)
            }
        }
    }
}

// ── NEW: Apparatus Tab ────────────────────────────────────────────────────────
@Composable
fun ApparatusContent(apparatus: String?) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Build, contentDescription = null, tint = Color(0xFF1FC98D), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Apparatus Required", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(20.dp))

            if (apparatus != null) {
                // Parse apparatus string if it's comma or newline separated
                val items = apparatus.split(",", "\n").map { it.trim() }.filter { it.isNotEmpty() }
                items.forEachIndexed { index, item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Index number badge
                        Surface(
                            color = Color(0xFF142233),
                            shape = CircleShape,
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    (index + 1).toString(),
                                    color = Color(0xFF5EEAD4),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Spacer(Modifier.width(12.dp))
                        Text(item, color = Color(0xFFE8F4F1), fontSize = 15.sp, lineHeight = 22.sp)
                    }
                    if (index < items.lastIndex) {
                        Divider(color = Color(0xFF142233), thickness = 0.5.dp, modifier = Modifier.padding(vertical = 4.dp))
                    }
                }
            } else {
                // Fallback hardcoded apparatus table (same style as website)
                Spacer(Modifier.height(8.dp))
                // Table header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF142233).copy(alpha = 0.7f), RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
                        .padding(vertical = 10.dp, horizontal = 8.dp)
                ) {
                    Text("Sl.No.", color = Color(0xFF5EEAD4), fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.12f), textAlign = TextAlign.Center)
                    Text("Apparatus", color = Color(0xFF5EEAD4), fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.40f))
                    Text("Range", color = Color(0xFF5EEAD4), fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.28f))
                    Text("Qty", color = Color(0xFF5EEAD4), fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.20f), textAlign = TextAlign.Center)
                }
                val apparatusData = listOf(
                    listOf("1", "RPS (regulated power supply)", "(0-30V)", "2"),
                    listOf("2", "Resistance", "330Ω, 220Ω, 1kΩ", "4"),
                    listOf("3", "Voltmeter", "(0-30V)MC", "2"),
                    listOf("4", "Bread Board & Wires", "-", "Required")
                )
                apparatusData.forEachIndexed { index, row ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(if (index % 2 == 0) Color(0xFF0A131F) else Color(0xFF142233).copy(alpha = 0.3f))
                            .padding(vertical = 10.dp, horizontal = 8.dp)
                    ) {
                        Text(row[0], color = Color.White, fontSize = 13.sp, modifier = Modifier.weight(0.12f), textAlign = TextAlign.Center)
                        Text(row[1], color = Color(0xFFE8F4F1), fontSize = 13.sp, modifier = Modifier.weight(0.40f))
                        Text(row[2], color = Color(0xFF94ACBA), fontSize = 13.sp, modifier = Modifier.weight(0.28f))
                        Text(row[3], color = Color(0xFF94ACBA), fontSize = 13.sp, modifier = Modifier.weight(0.20f), textAlign = TextAlign.Center)
                    }
                }
                Spacer(Modifier.height(12.dp))
                Text(
                    "Note: Apparatus may vary per experiment. Refer to your lab manual for exact requirements.",
                    color = Color(0xFF3D5468),
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
            }
        }
    }
}

// ── Existing tabs (unchanged) ─────────────────────────────────────────────────

@Composable
fun TheoryContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("STATEMENT:", color = Color(0xFF5EEAD4), fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
            Spacer(Modifier.height(16.dp))
            Text("KVL: In any closed path / mesh, the algebraic sum of all the voltages is zero.", color = Color.White, fontSize = 16.sp, lineHeight = 24.sp)
            Spacer(Modifier.height(16.dp))
            Text("Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero. This is a fundamental principle in circuit analysis.", color = Color(0xFF94ACBA), fontSize = 16.sp, lineHeight = 24.sp)
            Spacer(Modifier.height(24.dp))
            Text("Mathematically, it is expressed as:", color = Color(0xFF94ACBA), fontSize = 16.sp)
            Spacer(Modifier.height(12.dp))
            Text("ΣV = 0", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(16.dp))
            Text("Where:\n• ΣV represents the sum of all voltage drops and rises around a closed loop", color = Color(0xFF94ACBA), fontSize = 16.sp, lineHeight = 24.sp)
            Spacer(Modifier.height(32.dp))
            Surface(
                color = Color(0xFF05080D),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp))
            ) {
                Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Kirchhoff's Voltage Law", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Understanding the theoretical principles is essential before conducting the practical experiment.", color = Color(0xFF6E8699), fontSize = 14.sp, textAlign = TextAlign.Center)
                }
            }
        }
    }
}

@Composable
fun ProcedureContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("EXPERIMENTAL PROCEDURE:", color = Color(0xFF5EEAD4), fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
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
            Text("THEORETICAL VALUES:", color = Color(0xFF5EEAD4), fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
            Spacer(Modifier.height(16.dp))
            Column(modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233))) {
                Row(modifier = Modifier.background(Color(0xFF142233).copy(alpha = 0.5f))) {
                    TableCell("Sl.No.", weight = 0.15f)
                    TableCell("RPS Voltage (E) Volts", weight = 0.35f)
                    TableCell("V1 Volts", weight = 0.25f)
                    TableCell("V2 Volts", weight = 0.25f)
                }
                repeat(4) { i ->
                    Row {
                        TableCell((i + 1).toString(), weight = 0.15f)
                        TableCell((6 * (i + 1)).toString(), weight = 0.35f)
                        TableCell("%.2f".format(2.3 * (i + 1)), weight = 0.25f)
                        TableCell("%.2f".format(3.7 * (i + 1)), weight = 0.25f)
                    }
                }
            }
        }
    }
}

@Composable
fun RowScope.TableCell(text: String, weight: Float) {
    Text(text = text, modifier = Modifier.weight(weight).border(0.5.dp, Color(0xFF142233)).padding(8.dp), color = Color.White, fontSize = 12.sp, textAlign = TextAlign.Center)
}

@Composable
fun InteractiveContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Kirchhoff's Voltage Law - Interactive Demonstration", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Step 1 of 5", color = Color(0xFF6E8699), fontSize = 14.sp)
            Spacer(Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Icon(Icons.Default.Refresh, null, tint = Color.White)
                Icon(Icons.Default.ChevronLeft, null, tint = Color.White)
                Icon(Icons.Default.PlayArrow, null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(24.dp))
                Icon(Icons.Default.ChevronRight, null, tint = Color.White)
            }
            Spacer(Modifier.height(32.dp))
            Text("Introduction to Kirchhoff's Voltage Law", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero.", color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 22.sp)
            Spacer(Modifier.height(32.dp))
            Surface(color = Color(0xFF05080D), shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp))) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("KVL Circuit Demonstration", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF142233)), shape = RoundedCornerShape(8.dp)) {
                            Text("Show Values", color = Color(0xFF5EEAD4), fontSize = 12.sp)
                        }
                        Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0A3D32)), shape = RoundedCornerShape(8.dp)) {
                            Text("Demonstrate KVL", color = Color(0xFF3DE8B0), fontSize = 12.sp)
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                    Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.DarkGray.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.ElectricBolt, null, tint = Color(0xFFE8954D), modifier = Modifier.size(100.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun SimulationContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Tungsten, contentDescription = null, tint = Color(0xFFE8954D), modifier = Modifier.size(64.dp))
            Spacer(Modifier.height(24.dp))
            Text("Interactive Circuit Simulator", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            Text("Use our Tinkercad-powered simulator to build and test KVL circuits in real-time.", color = Color(0xFF94ACBA), fontSize = 15.sp, textAlign = TextAlign.Center, lineHeight = 22.sp)
            Spacer(Modifier.height(32.dp))
            Button(onClick = { }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D9488)), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth().height(50.dp)) {
                Text("Launch Simulator", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun QuizDetailContent(onNavigate: (String) -> Unit) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Kirchhoff's Voltage Law - Knowledge Check", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(16.dp))
            Text("Ready to test your understanding? Start the interactive quiz to challenge yourself.", color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 22.sp)
            Spacer(Modifier.height(32.dp))
            Button(onClick = { onNavigate("quiz_attempt/1") }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D9488)), modifier = Modifier.fillMaxWidth().height(50.dp), shape = RoundedCornerShape(10.dp)) {
                Text("Start Interactive Quiz", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun VideoContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.PlayCircle, null, tint = Color(0xFFFF4757), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Video Tutorial", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(16.dp))
            Box(modifier = Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(16.dp)).background(Color.Black), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(64.dp))
                    Text("Watch on YouTube", color = Color.White, fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(24.dp))
            Text("In this video, we demonstrate the step-by-step procedure to verify Kirchhoff's Voltage Law using a breadboard and basic components.", color = Color(0xFF94ACBA), fontSize = 15.sp, lineHeight = 22.sp)
        }
    }
}

@Composable
fun ReferencesContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.MenuBook, null, tint = Color(0xFF1FC98D), modifier = Modifier.size(24.dp))
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
                Row(modifier = Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Link, null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(12.dp))
                    Text(ref, color = Color(0xFF5EEAD4), fontSize = 15.sp)
                }
            }
        }
    }
}

@Composable
fun GalleryContent() {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Image, null, tint = Color(0xFFFF7AC6), modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Text("Component Gallery", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(8.dp))
            Text("Components and equipment used in this experiment", color = Color(0xFF6E8699), fontSize = 14.sp)
            Spacer(Modifier.height(48.dp))
            Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.BrokenImage, null, tint = Color(0xFF142233), modifier = Modifier.size(64.dp))
                Spacer(Modifier.height(16.dp))
                Text("No components added yet.", color = Color(0xFF3D5468), fontSize = 15.sp)
            }
            Spacer(Modifier.height(48.dp))
        }
    }
}