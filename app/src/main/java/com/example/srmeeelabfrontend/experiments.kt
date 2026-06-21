package com.example.srmeeelabfrontend

import com.example.srmeeelabfrontend.network.ExperimentApiModel
import com.example.srmeeelabfrontend.network.RetrofitClient
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
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
fun ExperimentsScreen(isLoggedIn: Boolean, onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var searchQuery by remember { mutableStateOf("") }
    var isMenuOpen by remember { mutableStateOf(false) }
    var selectedCategory by remember { mutableStateOf("All") }
    var experiments by remember { mutableStateOf<List<ExperimentApiModel>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

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

    // ✅ Single API call — duplicate removed
    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getExperiments()

            println("Response Code: ${response.code()}")
            println("Response Body: ${response.body()}")

            if (response.isSuccessful) {
                experiments = response.body() ?: emptyList()
                println("Experiments Loaded: ${experiments.size}")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            println("API ERROR: ${e.message}")
        } finally {
            isLoading = false
        }
    }

    val categories = listOf("All", "Circuit Analysis", "Analog Electronics", "Digital Electronics", "Electrical Machines", "Electrical Installation")

    val filteredExperiments = experiments.filter { exp ->
        (selectedCategory == "All" || exp.category == selectedCategory) &&
                (
                        searchQuery.isEmpty() ||
                                exp.title.contains(searchQuery, ignoreCase = true) ||
                                exp.description.contains(searchQuery, ignoreCase = true)
                        )
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
                            Text("Experiments", color = Color.White, fontSize = 14.sp)
                        }

                        Spacer(Modifier.height(24.dp))

                        Surface(
                            color = Color(0xFF1E293B).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFF60A5FA), modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("26EEE1001T — All Lab Experiments", color = Color(0xFF60A5FA), fontSize = 12.sp, fontWeight = FontWeight.Bold)
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
                            "Lab Experiments",
                            color = Color.White,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = (-0.5).sp
                        )
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "12 interactive experiments covering circuit analysis, analog electronics, digital electronics, electrical machines, and wiring.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Search Bar
                item {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        placeholder = { Text("Search experiments...", color = Color(0xFF475569)) },
                        leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null, tint = Color(0xFF475569)) },
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF3B82F6),
                            unfocusedBorderColor = Color(0xFF1E293B),
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                }

                // Filter Chips
                item {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 24.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.padding(bottom = 24.dp)
                    ) {
                        items(categories) { category ->
                            FilterChip(
                                text = category,
                                isSelected = selectedCategory == category,
                                onClick = { selectedCategory = category }
                            )
                        }
                    }
                }

                // Count
                item {
                    Text(
                        text = "Showing ${filteredExperiments.size} of ${experiments.size} experiments",
                        color = Color(0xFF64748B),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                    )
                }

                // Experiment List
                if (isLoading) {
                    item {
                        CircularProgressIndicator(
                            color = Color(0xFF3B82F6),
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else {
                    items(filteredExperiments) { exp ->
                        val uiExp = ExperimentData(
                            id = exp.id,
                            title = exp.title,
                            desc = exp.description,
                            category = exp.category,
                            difficulty = exp.difficulty,
                            duration = exp.duration
                        )
                        ExperimentCardDetailed(
                            uiExp,
                            onClick = { onNavigate("experiment_detail/${exp.id}") }
                        )
                        Spacer(Modifier.height(16.dp))
                    }
                }

                // Stats Section
                item { StatsSection() }

                // Footer
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
                    HamburgerMenu(
                        isLoggedIn = isLoggedIn,
                        currentRoute = "experiments",
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
fun FilterChip(text: String, isSelected: Boolean, onClick: () -> Unit) {
    Surface(
        color = if (isSelected) Color(0xFF1E293B) else Color.Transparent,
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .border(
                width = 1.dp,
                color = if (isSelected) Color(0xFF3B82F6) else Color(0xFF1E293B),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable { onClick() }
    ) {
        Text(
            text = text,
            color = if (isSelected) Color.White else Color(0xFF94A3B8),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp)
        )
    }
}

@Composable
fun ExperimentCardDetailed(exp: ExperimentData, onClick: () -> Unit) {
    val infiniteTransition = rememberInfiniteTransition(label = "borderGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.7f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(
                width = 1.5.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF3B82F6).copy(alpha = glowAlpha),
                        Color(0xFF1E293B),
                        Color(0xFF60A5FA).copy(alpha = glowAlpha)
                    )
                ),
                shape = RoundedCornerShape(24.dp)
            )
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = Color(0xFF1E293B),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(exp.id.toString(), color = Color(0xFF60A5FA), fontWeight = FontWeight.ExtraBold)
                    }
                }
                Spacer(Modifier.width(12.dp))
                Surface(
                    color = Color(0xFF1E293B).copy(alpha = 0.5f),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                ) {
                    Text(
                        exp.category,
                        color = exp.categoryColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = exp.diffBg,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, exp.diffBorder, RoundedCornerShape(20.dp))
                ) {
                    Text(
                        exp.difficulty,
                        color = exp.diffColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(Modifier.height(20.dp))
            Text(exp.title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(12.dp))
            Text(exp.desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)

            Spacer(Modifier.height(32.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text(exp.duration, color = Color(0xFF64748B), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                TextButton(onClick = onClick) {
                    Text("Start Lab", color = Color(0xFF3B82F6), fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
                    Spacer(Modifier.width(6.dp))
                    Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
fun StatsSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 60.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatItem("12", "Experiments")
            StatItem("5", "Subject Areas")
        }
        Spacer(Modifier.height(48.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatItem("6", "Tinkercad Sims")
            StatItem("100%", "Interactive")
        }
    }
}

@Composable
fun StatItem(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = Color.White, fontSize = 48.sp, fontWeight = FontWeight.ExtraBold)
        Spacer(Modifier.height(8.dp))
        Text(label, color = Color(0xFF94A3B8), fontSize = 15.sp, fontWeight = FontWeight.Medium)
    }
}

data class ExperimentData(
    val id: Int,
    val title: String,
    val desc: String,
    val category: String,
    val difficulty: String,
    val duration: String,
    val categoryColor: Color = Color(0xFF60A5FA),
    val diffColor: Color = Color(0xFF34D399),
    val diffBg: Color = Color(0xFF064E3B).copy(alpha = 0.3f),
    val diffBorder: Color = Color(0xFF065F46)
)

val allExperiments = listOf(
    ExperimentData(1, "Kirchhoff's Voltage Law", "Verify KVL by measuring voltages in a closed-loop DC circuit. Measure voltage drops across resistors and confirm the...", "Circuit Analysis", "Beginner", "45 min"),
    ExperimentData(2, "Thevenin's Theorem", "Replace a complex linear circuit with its Thevenin equivalent (V_TH and R_TH) and verify load current.", "Circuit Analysis", "Intermediate", "60 min", Color(0xFF60A5FA), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(3, "PN Junction Diode Characteristics", "Plot V-I characteristics of a PN junction diode in forward and reverse bias modes.", "Analog Electronics", "Beginner", "60 min", Color(0xFF60A5FA)),
    ExperimentData(4, "Full Wave Rectifier", "Build a bridge rectifier using 4 IN4007 diodes. Observe output waveforms with and without a filter capacitor.", "Analog Electronics", "Intermediate", "60 min", Color(0xFF60A5FA), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(5, "Clipper Circuit", "Study series and parallel clipping circuits using diodes and observe how they limit signal amplitude.", "Analog Electronics", "Intermediate", "60 min", Color(0xFF60A5FA), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(6, "Op-Amp Inverting / Non-Inverting Amplifier", "Design inverting and non-inverting amplifier circuits using LM741 Op-Amp and verify gain experimentally.", "Analog Electronics", "Advanced", "75 min", Color(0xFF60A5FA), Color(0xFFFCA5A5), Color(0xFF7F1D1D).copy(alpha = 0.3f), Color(0xFF991B1B)),
    ExperimentData(7, "Basic Logic Gates", "Implement AND, OR, NOT, NAND, NOR, XOR, XNOR gates using ICs and verify truth tables experimentally.", "Digital Electronics", "Beginner", "60 min", Color(0xFF34D399)),
    ExperimentData(8, "Half Adder & Full Adder", "Design and implement Half Adder and Full Adder circuits using logic gates. Verify sum and carry...", "Digital Electronics", "Intermediate", "75 min", Color(0xFF34D399), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(9, "Energy Measurement", "Measure electrical energy consumption using a single-phase energy meter. Calculate units consume...", "Electrical Machines", "Beginner", "45 min", Color(0xFFF97316)),
    ExperimentData(10, "House Wiring", "Implement residential wiring with energy meter, MCB, switches, lamp, and fan. Read energy meter in kWh.", "Electrical Installation", "Intermediate", "90 min", Color(0xFFFBBF24), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(11, "Fluorescent Lamp Wiring", "Connect a 40W fluorescent lamp with choke and starter. Understand the role of each component.", "Electrical Installation", "Intermediate", "60 min", Color(0xFFFBBF24), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    ExperimentData(12, "Staircase Wiring", "Control a lamp from two locations using two-way switches. Understand SPDT switch operation.", "Electrical Installation", "Intermediate", "75 min", Color(0xFFFBBF24), Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E))
)