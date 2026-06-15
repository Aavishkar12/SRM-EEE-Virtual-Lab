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
fun QuizScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    
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

                // Hero Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color(0xFF1E293B).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Box(modifier = Modifier.size(6.dp).background(Color(0xFF6366F1), CircleShape))
                                Spacer(Modifier.width(8.dp))
                                Text("Knowledge Check", color = Color(0xFF94A3B8), fontSize = 12.sp)
                            }
                        }

                        Spacer(Modifier.height(32.dp))

                        Text(
                            text = "Test Your",
                            color = Color.White,
                            fontSize = 42.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "Knowledge",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 42.sp,
                                fontWeight = FontWeight.ExtraBold
                            ),
                            textAlign = TextAlign.Center
                        )

                        Spacer(Modifier.height(24.dp))

                        Text(
                            text = "A student-built virtual laboratory for SRM's 26EEE1001T course. Perform experiments, take quizzes, and master electrical engineering concepts — all from your browser.",
                            color = Color(0xFF64748B),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp
                        )
                        
                        Spacer(Modifier.height(32.dp))
                        
                        Text(
                            text = "Assess your understanding of electrical engineering concepts with our interactive quizzes.",
                            color = Color(0xFF94A3B8),
                            fontSize = 18.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 28.sp
                        )
                    }
                }

                // Available Quizzes Header
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 40.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Available Quizzes",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(4.dp))
                        Box(modifier = Modifier.width(120.dp).height(3.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(20.dp))
                        
                        Text(
                            text = "Select a quiz below to test your knowledge and improve your understanding of electrical engineering concepts",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Login Warning (Conditional)
                if (!isLoggedIn) {
                    item {
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.85f),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 8.dp)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                        ) {
                            Column(
                                modifier = Modifier.padding(24.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(18.dp))
                                    Spacer(Modifier.width(12.dp))
                                    Text(
                                        text = buildAnnotatedString {
                                            append("You must be signed in with your ")
                                            withStyle(SpanStyle(color = Color(0xFF3B82F6))) {
                                                append("@srmist.edu.in")
                                            }
                                            append(" student account to attempt the quizzes.")
                                        },
                                        color = Color.White,
                                        fontSize = 14.sp,
                                        textAlign = TextAlign.Center
                                    )
                                }
                                Spacer(Modifier.height(16.dp))
                                Text(
                                    text = "Sign in to your account",
                                    color = Color(0xFF3B82F6),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.clickable { onNavigate("login") }
                                )
                            }
                        }
                    }
                }

                // Quiz List
                items(quizList) { quiz ->
                    QuizCard(quiz, isLoggedIn, onNavigate)
                    Spacer(Modifier.height(16.dp))
                }

                // Footer
                item {
                    Footer(onNavigate)
                }
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
fun QuizCard(quiz: QuizData, isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = Color(0xFF1E293B),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Bolt, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
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
                        fontWeight = FontWeight.ExtraBold,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(Modifier.height(20.dp))
            Text(quiz.title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(12.dp))
            Text(quiz.desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)
            
            Spacer(Modifier.height(16.dp))
            Text("${quiz.questions} Questions", color = Color(0xFF64748B), fontSize = 13.sp, fontWeight = FontWeight.Bold)

            Spacer(Modifier.height(24.dp))
            
            if (isLoggedIn) {
                TextButton(onClick = { onNavigate("quiz_attempt/${quiz.id}") }, contentPadding = PaddingValues(0.dp)) {
                    Text("Start Quiz →", color = Color(0xFF3B82F6), fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
                }
            } else {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { onNavigate("login") }) {
                    Text("Sign in to Attempt", color = Color(0xFF3B82F6), fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
                    Spacer(Modifier.width(8.dp))
                    Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("→", color = Color(0xFF3B82F6), fontSize = 15.sp)
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
