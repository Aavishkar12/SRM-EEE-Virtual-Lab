package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import com.example.srmeeelabfrontend.network.RetrofitClient
import com.example.srmeeelabfrontend.network.AiChatRequest
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import com.example.srmeeelabfrontend.network.ChatMessage
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class UiChatMessage(
    val text: String,
    val isUser: Boolean
)

@Composable
fun AiAssistantScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var userInput by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    var messages by remember {
        mutableStateOf<List<UiChatMessage>>(emptyList())
    }

    var isLoading by remember {
        mutableStateOf(false)
    }

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

    // Auto-scroll to bottom when new message arrives
    LaunchedEffect(messages.size, isLoading) {
        if (messages.isNotEmpty() || isLoading) {
            listState.animateScrollToItem(listState.layoutInfo.totalItemsCount)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
        AnimatedBackground()

        Scaffold(
            containerColor = Color.Transparent,
            bottomBar = {
                AiInputField(
                    value = userInput,
                    onValueChange = { userInput = it },
                    onSend = {
                        if (userInput.isBlank()) return@AiInputField

                        val question = userInput

                        messages = messages + UiChatMessage(
                            text = question,
                            isUser = true
                        )

                        userInput = ""

                        scope.launch {
                            try {
                                isLoading = true

                                val response =
                                    RetrofitClient.apiService.sendAiMessage(
                                        AiChatRequest(
                                            messages = listOf(
                                                ChatMessage(
                                                    role = "user",
                                                    content = question
                                                )
                                            )
                                        )
                                    )

                                messages = messages + UiChatMessage(
                                    text = response.reply,
                                    isUser = false
                                )

                            } catch (e: Exception) {
                                messages = messages + UiChatMessage(
                                    text = "Failed to get response. Check your connection.",
                                    isUser = false
                                )
                            } finally {
                                isLoading = false
                            }
                        }
                    }
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
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Study Room", color = Color(0xFF6E8699), fontSize = 14.sp)
                    }

                    IconButton(
                        onClick = { isMenuOpen = !isMenuOpen },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color(0xFF142233).copy(alpha = 0.6f), CircleShape)
                            .border(1.dp, Color(0xFF24384C), CircleShape)
                    ) {
                        Icon(Icons.Default.Menu, contentDescription = "Menu", tint = Color.White, modifier = Modifier.size(20.dp))
                    }

                    Surface(
                        color = Color(0xFF0A131F),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(10.dp))
                    ) {
                        Text(text = currentTime, color = Color(0xFF5EEAD4), modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }

                // Chat area
                LazyColumn(
                    state = listState,
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(top = 16.dp, bottom = 20.dp)
                ) {

                    // Show welcome UI only when no messages yet
                    if (messages.isEmpty()) {
                        item {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Spacer(Modifier.height(24.dp))

                                Surface(
                                    color = Color(0xFF142233).copy(alpha = 0.4f),
                                    shape = RoundedCornerShape(20.dp),
                                    modifier = Modifier
                                        .size(80.dp)
                                        .border(1.dp, Color(0xFF24384C).copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(Icons.Default.SmartToy, contentDescription = null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(40.dp))
                                    }
                                }

                                Spacer(Modifier.height(24.dp))

                                Text(
                                    "EEE Study Assistant",
                                    color = Color.White,
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )

                                Spacer(Modifier.height(12.dp))

                                Text(
                                    "Ask me anything about your 26EEE1001T experiments,\ncircuits, and theory",
                                    color = Color(0xFF94ACBA),
                                    fontSize = 15.sp,
                                    textAlign = TextAlign.Center,
                                    lineHeight = 22.sp,
                                    modifier = Modifier.padding(horizontal = 40.dp)
                                )

                                Spacer(Modifier.height(32.dp))

                                val suggestions = listOf(
                                    "Explain KVL with an example",
                                    "How does a full wave rectifier work?",
                                    "What is Thévenin's theorem?",
                                    "Explain op-amp inverting amplifier",
                                    "How does staircase wiring work?"
                                )

                                suggestions.forEach { suggestion ->
                                    SuggestionChip(suggestion, onClick = { userInput = suggestion })
                                    Spacer(Modifier.height(12.dp))
                                }

                                Spacer(Modifier.height(16.dp))
                            }
                        }
                    }

                    // Chat bubbles
                    items(messages) { message ->
                        ChatBubbleItem(message = message)
                        Spacer(Modifier.height(8.dp))
                    }

                    // Typing indicator while loading
                    if (isLoading) {
                        item {
                            TypingIndicator()
                            Spacer(Modifier.height(8.dp))
                        }
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
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "ai_assistant",
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
fun ChatBubbleItem(message: UiChatMessage) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = if (message.isUser) Arrangement.End else Arrangement.Start,
        verticalAlignment = Alignment.Bottom
    ) {
        // AI icon on the left
        if (!message.isUser) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF153449)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.SmartToy,
                    contentDescription = null,
                    tint = Color(0xFF1FD7C4),
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(Modifier.width(8.dp))
        }

        // Bubble
        Surface(
            color = if (message.isUser) Color(0xFF0F766E) else Color(0xFF142233),
            shape = RoundedCornerShape(
                topStart = 18.dp,
                topEnd = 18.dp,
                bottomStart = if (message.isUser) 18.dp else 4.dp,
                bottomEnd = if (message.isUser) 4.dp else 18.dp
            ),
            modifier = Modifier.widthIn(max = 280.dp)
        ) {
            Text(
                text = message.text,
                color = if (message.isUser) Color.White else Color(0xFFE8F4F1),
                fontSize = 14.sp,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
            )
        }

        // User icon on the right
        if (message.isUser) {
            Spacer(Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF0F766E)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
fun TypingIndicator() {
    val infiniteTransition = rememberInfiniteTransition(label = "typing")
    val dot1Alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse),
        label = "dot1"
    )
    val dot2Alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(600, delayMillis = 200), RepeatMode.Reverse),
        label = "dot2"
    )
    val dot3Alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(600, delayMillis = 400), RepeatMode.Reverse),
        label = "dot3"
    )

    Row(
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(Color(0xFF153449)),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.SmartToy, contentDescription = null, tint = Color(0xFF1FD7C4), modifier = Modifier.size(18.dp))
        }

        Spacer(Modifier.width(8.dp))

        Surface(
            color = Color(0xFF142233),
            shape = RoundedCornerShape(topStart = 18.dp, topEnd = 18.dp, bottomStart = 4.dp, bottomEnd = 18.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(Color(0xFF1FD7C4).copy(alpha = dot1Alpha)))
                Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(Color(0xFF1FD7C4).copy(alpha = dot2Alpha)))
                Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(Color(0xFF1FD7C4).copy(alpha = dot3Alpha)))
            }
        }
    }
}

@Composable
fun SuggestionChip(text: String, onClick: () -> Unit) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF142233), RoundedCornerShape(20.dp))
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(12.dp))
            Text(text, color = Color(0xFF94ACBA), fontSize = 14.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun AiInputField(value: String, onValueChange: (String) -> Unit, onSend: () -> Unit) {
    Surface(
        color = Color(0xFF05080D),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Surface(
                color = Color(0xFF0A131F).copy(alpha = 0.8f),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BasicTextField(
                        value = value,
                        onValueChange = onValueChange,
                        textStyle = TextStyle(color = Color.White, fontSize = 15.sp),
                        cursorBrush = SolidColor(Color(0xFF1FD7C4)),
                        modifier = Modifier.weight(1f),
                        decorationBox = { innerTextField ->
                            if (value.isEmpty()) {
                                Text("Ask about KVL, rectifiers, op-amps, wiring...", color = Color(0xFF3D5468), fontSize = 15.sp)
                            }
                            innerTextField()
                        }
                    )

                    IconButton(
                        onClick = onSend,
                        enabled = value.isNotEmpty(),
                        modifier = Modifier
                            .size(36.dp)
                            .background(if (value.isNotEmpty()) Color(0xFF142233) else Color.Transparent, CircleShape)
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            tint = if (value.isNotEmpty()) Color(0xFF5EEAD4) else Color(0xFF24384C),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
            Text(
                "Shift+Enter for new line · Enter to send",
                color = Color(0xFF24384C),
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            )
        }
    }
}