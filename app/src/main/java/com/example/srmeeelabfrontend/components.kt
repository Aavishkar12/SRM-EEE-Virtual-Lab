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
fun ComponentsScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedComponent by remember { mutableStateOf<ComponentData?>(null) }
    
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
                            .clickable { if (selectedComponent != null) selectedComponent = null else onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(if (selectedComponent != null) "Back to Components" else "Back to Study Room", color = Color(0xFFF59E0B), fontSize = 14.sp)
                    }
                }

                if (selectedComponent == null) {
                    // Title Section
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 8.dp)
                        ) {
                            Text(
                                "Interactive\nComponent Guide",
                                color = Color(0xFFF59E0B),
                                fontSize = 36.sp,
                                fontWeight = FontWeight.ExtraBold,
                                lineHeight = 44.sp
                            )
                            Spacer(Modifier.height(16.dp))
                            Text(
                                "Explore the specifications, symbols, and practical uses of every electronic component featured in the virtual lab.",
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
                                        cursorBrush = SolidColor(Color(0xFFF59E0B)),
                                        modifier = Modifier.weight(1f),
                                        decorationBox = { innerTextField ->
                                            if (searchQuery.isEmpty()) {
                                                Text("Search components...", color = Color(0xFF475569), fontSize = 15.sp)
                                            }
                                            innerTextField()
                                        }
                                    )
                                }
                            }
                            Spacer(Modifier.height(32.dp))
                        }
                    }

                    // Components List
                    items(componentList.filter { it.name.contains(searchQuery, ignoreCase = true) }) { component ->
                        ComponentCard(component) { selectedComponent = component }
                        Spacer(Modifier.height(16.dp))
                    }
                } else {
                    // Detailed Component View
                    item {
                        ComponentDetailView(selectedComponent!!)
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
                        currentRoute = "components",
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
fun ComponentCard(component: ComponentData, onClick: () -> Unit) {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.4f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(
                width = 1.dp,
                brush = Brush.horizontalGradient(
                    colors = listOf(component.color, Color.Transparent),
                    startX = 0f,
                    endX = 100f
                ),
                shape = RoundedCornerShape(16.dp)
            )
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = component.color.copy(alpha = 0.15f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(component.icon, contentDescription = null, tint = component.color, modifier = Modifier.size(28.dp))
                }
            }
            Spacer(Modifier.width(20.dp))
            Column {
                Text(component.name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text(component.type, color = Color(0xFF64748B), fontSize = 13.sp)
            }
        }
    }
}

@Composable
fun ComponentDetailView(component: ComponentData) {
    Column(modifier = Modifier.padding(horizontal = 24.dp)) {
        // Hero Card
        Surface(
            color = Color(0xFF1E293B).copy(alpha = 0.4f),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(component.color.copy(alpha = 0.2f), Color.Transparent)
                    ),
                    shape = RoundedCornerShape(24.dp)
                )
        ) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = Color.Black.copy(alpha = 0.3f),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.size(72.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(component.icon, contentDescription = null, tint = component.color, modifier = Modifier.size(36.dp))
                        }
                    }
                    Spacer(Modifier.width(24.dp))
                    Column {
                        Surface(
                            color = Color.White.copy(alpha = 0.1f),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Text(component.type, color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(component.name, color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.ExtraBold)
                    }
                }
            }
        }
        
        Spacer(Modifier.height(32.dp))
        
        // Description
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(12.dp))
            Text("Description", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(16.dp))
        Text(
            component.description,
            color = Color(0xFF94A3B8),
            fontSize = 15.sp,
            lineHeight = 24.sp
        )
        
        Spacer(Modifier.height(32.dp))
        
        // Key Specs
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(12.dp))
            Text("Key Specifications", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(20.dp))
        
        SpecItem("SYMBOL", component.symbol)
        Spacer(Modifier.height(12.dp))
        SpecItem("UNIT", component.unit)
        Spacer(Modifier.height(12.dp))
        SpecItem("FORMULA", component.formula)
        
        Spacer(Modifier.height(32.dp))
        
        // Practical Application
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Link, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(12.dp))
            Text("Practical Application", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(16.dp))
        Surface(
            color = component.color.copy(alpha = 0.1f),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                component.application,
                color = component.color.copy(alpha = 0.8f),
                fontSize = 14.sp,
                lineHeight = 22.sp,
                modifier = Modifier.padding(20.dp)
            )
        }
        Spacer(Modifier.height(40.dp))
    }
}

@Composable
fun SpecItem(label: String, value: String) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.5f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(label, color = Color(0xFF475569), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Text(value, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

data class ComponentData(
    val name: String,
    val type: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val color: Color,
    val description: String,
    val symbol: String,
    val unit: String,
    val formula: String,
    val application: String
)

val componentList = listOf(
    ComponentData(
        "Resistor", "Passive Component", Icons.Default.Timeline, Color(0xFFF97316),
        "A passive two-terminal electrical component that implements electrical resistance as a circuit element. In electronic circuits, resistors are used to reduce current flow, adjust signal levels, to divide voltages, bias active elements, and terminate transmission lines.",
        "R", "Ohm (Ω)", "V = I × R",
        "Used in voltage dividers, current limiters, and pull-up/pull-down networks."
    ),
    ComponentData(
        "PN Junction Diode", "Active Component", Icons.Default.Bolt, Color(0xFF3B82F6),
        "A semiconductor device that allows current to flow in one direction only. It is formed by joining p-type and n-type semiconductor materials.",
        "D", "Volt (V)", "I = Is(e^(V/nVt) - 1)",
        "Rectifiers, signal limiters, and voltage regulators."
    ),
    ComponentData(
        "Zener Diode", "Active Component", Icons.Default.ElectricBolt, Color(0xFF8B5CF6),
        "A special type of diode that allows current to flow in the reverse direction when the voltage is above a certain value, known as the Zener voltage.",
        "Z", "Volt (V)", "Vz = Constant",
        "Voltage regulation, surge suppressors, and reference voltages."
    )
)
