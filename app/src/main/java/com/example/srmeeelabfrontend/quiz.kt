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
import androidx.compose.material.icons.Icons
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
fun QuizScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    
    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.97f) }
    
    LaunchedEffect(Unit) {
        launch { contentAlpha.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing)) }
        launch { contentScale.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing)) }
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
                            .padding(horizontal = 24.dp, vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Home", color = Color(0xFF64748B), fontSize = 14.sp, modifier = Modifier.clickable { onNavigate("home") })
                        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                        Text("Quizzes", color = Color.White, fontSize = 14.sp)
                    }
                }

                // Title Section - Premium Hero
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color(0xFFA78BFA).copy(alpha = 0.1f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFFA78BFA).copy(alpha = 0.2f), RoundedCornerShape(20.dp))
                        ) {
                            Text(
                                "ACADEMIC ASSESSMENT", 
                                color = Color(0xFFA78BFA), 
                                fontSize = 11.sp, 
                                fontWeight = FontWeight.Black, 
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                                letterSpacing = 1.5.sp
                            )
                        }

                        Spacer(Modifier.height(32.dp))

                        Text(
                            text = "Test Your",
                            color = Color.White,
                            fontSize = 44.sp,
                            fontWeight = FontWeight.Black,
                            textAlign = TextAlign.Center,
                            letterSpacing = (-1).sp
                        )
                        Text(
                            text = "Knowledge",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 44.sp,
                                fontWeight = FontWeight.Black
                            ),
                            textAlign = TextAlign.Center,
                            letterSpacing = (-1).sp
                        )

                        Spacer(Modifier.height(24.dp))

                        Text(
                            text = "Challenge yourself with interactive assessments designed to reinforce your understanding of Electrical Engineering concepts.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 26.sp,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )
                    }
                }

                // Auth Warning - Glassmorphic refined
                if (!isLoggedIn) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 16.dp)
                                .clip(RoundedCornerShape(24.dp))
                                .background(Color(0xFF1E293B).copy(alpha = 0.4f))
                                .border(
                                    width = 1.dp,
                                    brush = Brush.linearGradient(listOf(Color(0xFFFBBF24).copy(alpha = 0.5f), Color.Transparent)),
                                    shape = RoundedCornerShape(24.dp)
                                )
                                .clickable { onNavigate("login") }
                        ) {
                            Row(
                                modifier = Modifier.padding(24.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(52.dp)
                                        .background(Color(0xFFFBBF24).copy(alpha = 0.1f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Outlined.Lock, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(28.dp))
                                }
                                Spacer(Modifier.width(20.dp))
                                Column {
                                    Text("Authentication Required", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                                    Text(
                                        "Sign in with your @srmist.edu.in account to attempt quizzes.", 
                                        color = Color(0xFF94A3B8), 
                                        fontSize = 13.sp,
                                        lineHeight = 18.sp
                                    )
                                }
                            }
                        }
                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Quiz List
                items(quizList) { quiz ->
                    PremiumQuizCard(quiz, isLoggedIn, onNavigate)
                    Spacer(Modifier.height(20.dp))
                }

                item { Footer(onNavigate) }
            }
        }

        // Hamburger Menu
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
                    HamburgerMenu(isLoggedIn = isLoggedIn, onClose = { isMenuOpen = false }, onNavigate = { route ->
                        onNavigate(route)
                        isMenuOpen = false
                    })
                }
            }
        }
    }
}

@Composable
fun PremiumQuizCard(quiz: QuizData, isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    val infiniteTransition = rememberInfiniteTransition(label = "quizGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(2500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clip(RoundedCornerShape(28.dp))
            .background(Color(0xFF0F172A).copy(alpha = 0.7f))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = if (isLoggedIn) {
                        listOf(Color(0xFF1E293B), quiz.diffColor.copy(alpha = glowAlpha), Color(0xFF1E293B))
                    } else {
                        listOf(Color(0xFF1E293B), Color(0xFF334155))
                    }
                ),
                shape = RoundedCornerShape(28.dp)
            )
            .clickable(enabled = isLoggedIn) { onNavigate("quiz_attempt/${quiz.id}") }
    ) {
        Column(modifier = Modifier.padding(28.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = quiz.diffColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.size(52.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            if (isLoggedIn) Icons.Default.Quiz else Icons.Default.Lock, 
                            contentDescription = null, 
                            tint = if (isLoggedIn) quiz.diffColor else Color(0xFF64748B), 
                            modifier = Modifier.size(26.dp)
                        )
                    }
                }
                Spacer(Modifier.weight(1f))
                Surface(
                    color = quiz.diffBg,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, quiz.diffBorder, RoundedCornerShape(20.dp))
                ) {
                    Text(
                        quiz.difficulty,
                        color = quiz.diffColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                        letterSpacing = 0.5.sp
                    )
                }
            }

            Spacer(Modifier.height(24.dp))
            Text(quiz.title, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(12.dp))
            Text(quiz.desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 24.sp)
            
            Spacer(Modifier.height(24.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.FormatListNumbered, contentDescription = null, tint = Color(0xFF475569), modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("${quiz.questions} Questions", color = Color(0xFF64748B), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                
                Spacer(Modifier.weight(1f))
                
                if (isLoggedIn) {
                    Text(
                        "Attempt Now →", 
                        color = quiz.diffColor, 
                        fontSize = 15.sp, 
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.5.sp
                    )
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFF475569), modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(
                            "Locked", 
                            color = Color(0xFF475569), 
                            fontSize = 14.sp, 
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

data class QuizData(
    val id: Int,
    val title: String,
    val desc: String,
    val difficulty: String,
    val questions: Int,
    val diffColor: Color = Color(0xFF34D399),
    val diffBg: Color = Color(0xFF064E3B).copy(alpha = 0.3f),
    val diffBorder: Color = Color(0xFF065F46)
)

val quizList = listOf(
    QuizData(1, "Kirchhoff's Voltage Law Quiz", "Test your knowledge of voltage relationships in closed loop circuits", "Beginner", 10),
    QuizData(2, "Thevenin's Theorem Quiz", "Challenge yourself on circuit simplification techniques", "Intermediate", 10, Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    QuizData(3, "PN Junction Diode Quiz", "Test your understanding of forward and reverse bias characteristics", "Beginner", 1),
    QuizData(4, "Full Wave Rectifier Quiz", "Verify your understanding of AC to DC conversion", "Intermediate", 10, Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E)),
    QuizData(5, "Clipper Circuit Quiz", "Test your knowledge of signal amplitude limiting circuits", "Intermediate", 1, Color(0xFFFBBF24), Color(0xFF78350F).copy(alpha = 0.3f), Color(0xFF92400E))
)
