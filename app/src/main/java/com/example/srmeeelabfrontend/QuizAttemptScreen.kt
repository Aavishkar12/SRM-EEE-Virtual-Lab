package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun QuizAttemptScreen(quizId: Int, onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var currentQuestionIndex by remember { mutableIntStateOf(1) }
    var selectedOptionIndex by remember { mutableStateOf<Int?>(null) }
    var isQuizFinished by remember { mutableStateOf(false) }
    var score by remember { mutableIntStateOf(0) }
    
    val totalQuestions = 10
    val progress = currentQuestionIndex.toFloat() / totalQuestions
    
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
        ) { paddingValues ->
            if (isQuizFinished) {
                QuizCompletedView(
                    score = score,
                    totalQuestions = totalQuestions,
                    currentTime = currentTime,
                    onMenuClick = { isMenuOpen = !isMenuOpen },
                    onRetry = {
                        isQuizFinished = false
                        currentQuestionIndex = 1
                        selectedOptionIndex = null
                        score = 0
                    },
                    onBack = onBack
                )
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                        .alpha(contentAlpha.value)
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
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF60A5FA), modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Back to Quizzes", color = Color(0xFF60A5FA), fontSize = 14.sp, fontWeight = FontWeight.Medium)
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
                        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 16.dp)
                    ) {
                        item {
                            Text(
                                "Kirchhoff's Voltage Law\nQuiz",
                                color = Color.White,
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold,
                                lineHeight = 38.sp
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                "Test your knowledge of voltage relationships in closed loop circuits",
                                color = Color(0xFF64748B),
                                fontSize = 15.sp,
                                lineHeight = 22.sp
                            )
                            
                            Spacer(Modifier.height(32.dp))
                            
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Question $currentQuestionIndex of $totalQuestions", color = Color(0xFF94A3B8), fontSize = 14.sp)
                                Spacer(Modifier.weight(1f))
                                Text("Score: $score/$totalQuestions", color = Color(0xFF94A3B8), fontSize = 14.sp)
                            }
                            
                            Spacer(Modifier.height(12.dp))
                            
                            LinearProgressIndicator(
                                progress = { progress },
                                modifier = Modifier.fillMaxWidth().height(4.dp).clip(CircleShape),
                                color = Color(0xFF3B82F6).copy(alpha = 0.6f),
                                trackColor = Color(0xFF1E293B)
                            )
                            
                            Spacer(Modifier.height(32.dp))
                        }
                        
                        item {
                            Surface(
                                color = Color(0xFF0F172A).copy(alpha = 0.8f),
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                            ) {
                                Column(modifier = Modifier.padding(24.dp)) {
                                    Text(
                                        "What does Kirchhoff's Voltage Law (KVL) state?",
                                        color = Color.White,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        lineHeight = 26.sp
                                    )
                                    
                                    Spacer(Modifier.height(32.dp))
                                    
                                    val options = listOf(
                                        "The sum of all currents entering a node equals the sum of all currents leaving the node",
                                        "The algebraic sum of all voltages around any closed loop in a circuit must equal zero",
                                        "The voltage across a resistor is directly proportional to the current flowing through it",
                                        "The power dissipated in a circuit equals the product of voltage and current"
                                    )
                                    
                                    options.forEachIndexed { index, option ->
                                        OptionItem(
                                            text = option,
                                            isSelected = selectedOptionIndex == index,
                                            onClick = { selectedOptionIndex = index }
                                        )
                                        Spacer(Modifier.height(16.dp))
                                    }
                                    
                                    Spacer(Modifier.height(24.dp))
                                    
                                    Button(
                                        onClick = {
                                            if (selectedOptionIndex == 1) { // Assuming index 1 is correct for demo
                                                score++
                                            }
                                            if (currentQuestionIndex < totalQuestions) {
                                                currentQuestionIndex++
                                                selectedOptionIndex = null
                                            } else {
                                                isQuizFinished = true
                                            }
                                        },
                                        enabled = selectedOptionIndex != null,
                                        modifier = Modifier.align(Alignment.End),
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = Color(0xFF1E293B),
                                            disabledContainerColor = Color(0xFF1E293B).copy(alpha = 0.5f)
                                        ),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text(
                                            if (currentQuestionIndex < totalQuestions) "Next Question" else "Finish Quiz",
                                            color = if (selectedOptionIndex != null) Color.White else Color(0xFF475569),
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 8.dp)
                                        )
                                    }
                                }
                            }
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
fun QuizCompletedView(score: Int, totalQuestions: Int, currentTime: String, onMenuClick: () -> Unit, onRetry: () -> Unit, onBack: () -> Unit) {
    val accuracy = if (totalQuestions > 0) (score.toFloat() / totalQuestions * 100).toInt() else 0
    
    Column(modifier = Modifier.fillMaxSize()) {
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
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF60A5FA), modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(8.dp))
                Text("Back to Quizzes", color = Color(0xFF60A5FA), fontSize = 14.sp, fontWeight = FontWeight.Medium)
            }

            IconButton(
                onClick = onMenuClick,
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
            contentPadding = PaddingValues(24.dp)
        ) {
            item {
                Surface(
                    color = Color(0xFF0F172A).copy(alpha = 0.85f),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
                ) {
                    Column(
                        modifier = Modifier.padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.EmojiEvents,
                            contentDescription = null,
                            tint = Color(0xFFFBBF24),
                            modifier = Modifier.size(80.dp)
                        )
                        Spacer(Modifier.height(24.dp))
                        Text(
                            "Quiz Completed!",
                            color = Color.White,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "You scored $score out of $totalQuestions",
                            color = Color(0xFF94A3B8),
                            fontSize = 18.sp
                        )
                    }
                }
                
                Spacer(Modifier.height(32.dp))
                
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text("Your Performance", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    
                    LinearProgressIndicator(
                        progress = { score.toFloat() / totalQuestions },
                        modifier = Modifier.fillMaxWidth().height(16.dp).clip(CircleShape),
                        color = Color(0xFF3B82F6),
                        trackColor = Color(0xFF1E293B)
                    )
                    
                    Row(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                        Text("0", color = Color(0xFF475569), fontSize = 14.sp)
                        Spacer(Modifier.weight(1f))
                        Text("$totalQuestions", color = Color(0xFF475569), fontSize = 14.sp)
                    }
                }
                
                Spacer(Modifier.height(32.dp))
                
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Surface(
                        color = Color(0xFF1E293B).copy(alpha = 0.6f),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f).border(1.dp, Color(0xFF334155), RoundedCornerShape(16.dp))
                    ) {
                        Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("$accuracy%", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            Text("Accuracy", color = Color(0xFF64748B), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    
                    Surface(
                        color = Color(0xFF1E293B).copy(alpha = 0.6f),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f).border(1.dp, Color(0xFF334155), RoundedCornerShape(16.dp))
                    ) {
                        Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("$score", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            Text("Correct Answers", color = Color(0xFF64748B), fontSize = 13.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                        }
                    }
                }
                
                Spacer(Modifier.height(32.dp))
                
                Surface(
                    color = Color(0xFF3B82F6).copy(alpha = 0.1f),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFF3B82F6).copy(alpha = 0.2f), RoundedCornerShape(16.dp))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text("Performance Analysis", color = Color(0xFF60A5FA), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            if (accuracy >= 80) "Perfect score! You've mastered this topic completely!" 
                            else if (accuracy >= 50) "Good job! You have a solid understanding, but some areas need review."
                            else "Keep practicing! Review the theory and try again to improve your score.",
                            color = Color.White,
                            fontSize = 15.sp,
                            lineHeight = 22.sp
                        )
                    }
                }
                
                Spacer(Modifier.height(48.dp))
                
                Button(
                    onClick = onRetry,
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Retry Quiz", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
                
                Spacer(Modifier.height(16.dp))
                
                Button(
                    onClick = onBack,
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Back to Quizzes", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun OptionItem(text: String, isSelected: Boolean, onClick: () -> Unit) {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.3f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.dp, 
                if (isSelected) Color(0xFF3B82F6).copy(alpha = 0.5f) else Color(0xFF334155).copy(alpha = 0.5f), 
                RoundedCornerShape(12.dp)
            )
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(20.dp),
                shape = CircleShape,
                color = Color.Transparent,
                border = BorderStroke(1.dp, if (isSelected) Color(0xFF3B82F6) else Color(0xFF475569))
            ) {
                if (isSelected) {
                    Box(
                        modifier = Modifier
                            .padding(4.dp)
                            .background(Color(0xFF3B82F6), CircleShape)
                    )
                }
            }
            Spacer(Modifier.width(16.dp))
            Text(
                text = text,
                color = if (isSelected) Color.White else Color(0xFF94A3B8),
                fontSize = 15.sp,
                lineHeight = 22.sp
            )
        }
    }
}
