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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
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
fun AiAssistantScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var userInput by remember { mutableStateOf("") }
    
    val contentAlpha = remember { Animatable(0f) }
    
    LaunchedEffect(Unit) {
        contentAlpha.animateTo(1f, animationSpec = tween(800))
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
            bottomBar = {
                AiInputField(
                    value = userInput,
                    onValueChange = { userInput = it },
                    onSend = { userInput = "" }
                )
            }
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Study Room", color = Color(0xFF64748B), fontSize = 14.sp)
                    }

                    IconButton(
                        onClick = { isMenuOpen = !isMenuOpen },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color(0xFF1E293B).copy(alpha = 0.6f), CircleShape)
                            .border(1.dp, Color(0xFF334155), CircleShape)
                    ) {
                        Icon(Icons.Default.Menu, contentDescription = "Menu", tint = Color.White, modifier = Modifier.size(20.dp))
                    }

                    Surface(
                        color = Color(0xFF0F172A),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(10.dp))
                    ) {
                        Text(text = currentTime, color = Color(0xFF60A5FA), modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    contentPadding = PaddingValues(top = 40.dp, bottom = 20.dp)
                ) {
                    item {
                        Surface(
                            color = Color(0xFF1E293B).copy(alpha = 0.4f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.size(80.dp).border(1.dp, Color(0xFF334155).copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.SmartToy, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(40.dp))
                            }
                        }
                        
                        Spacer(Modifier.height(32.dp))
                        
                        Text(
                            "EEE Study Assistant",
                            color = Color.White,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        
                        Spacer(Modifier.height(16.dp))
                        
                        Text(
                            "Ask me anything about your 26EEE1001T experiments,\ncircuits, and theory",
                            color = Color(0xFF94A3B8),
                            fontSize = 15.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 22.sp,
                            modifier = Modifier.padding(horizontal = 40.dp)
                        )
                        
                        Spacer(Modifier.height(40.dp))
                    }
                    
                    val suggestions = listOf(
                        "Explain KVL with an example",
                        "How does a full wave rectifier work?",
                        "What is Thévenin's theorem?",
                        "Explain op-amp inverting amplifier",
                        "How does staircase wiring work?"
                    )
                    
                    items(suggestions) { suggestion ->
                        SuggestionChip(suggestion, onClick = { userInput = suggestion })
                        Spacer(Modifier.height(12.dp))
                    }
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
fun SuggestionChip(text: String, onClick: () -> Unit) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(12.dp))
            Text(text, color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun AiInputField(value: String, onValueChange: (String) -> Unit, onSend: () -> Unit) {
    Surface(
        color = Color(0xFF020617),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Surface(
                color = Color(0xFF0F172A).copy(alpha = 0.8f),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BasicTextField(
                        value = value,
                        onValueChange = onValueChange,
                        textStyle = TextStyle(color = Color.White, fontSize = 15.sp),
                        cursorBrush = SolidColor(Color(0xFF3B82F6)),
                        modifier = Modifier.weight(1f),
                        decorationBox = { innerTextField ->
                            if (value.isEmpty()) {
                                Text("Ask about KVL, rectifiers, op-amps, wiring...", color = Color(0xFF475569), fontSize = 15.sp)
                            }
                            innerTextField()
                        }
                    )
                    
                    IconButton(
                        onClick = onSend,
                        enabled = value.isNotEmpty(),
                        modifier = Modifier
                            .size(36.dp)
                            .background(if (value.isNotEmpty()) Color(0xFF1E293B) else Color.Transparent, CircleShape)
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            tint = if (value.isNotEmpty()) Color(0xFF60A5FA) else Color(0xFF334155),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
            Text(
                "Shift+Enter for new line · Enter to send",
                color = Color(0xFF334155),
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            )
        }
    }
}
