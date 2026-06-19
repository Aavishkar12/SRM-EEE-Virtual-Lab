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
import com.example.srmeeelabfrontend.network.QuizApiModel
import com.example.srmeeelabfrontend.network.RetrofitClient

@Composable
fun QuizAttemptScreen(quizId: Int, onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var currentQuestionIndex by remember { mutableIntStateOf(1) }
    var selectedOptionIndex by remember { mutableStateOf<Int?>(null) }
    var showResult by remember { mutableStateOf(false) }

    var isCorrect by remember { mutableStateOf(false) }
    var isQuizFinished by remember { mutableStateOf(false) }
    var score by remember { mutableIntStateOf(0) }
    var userAnswers by remember {
        mutableStateOf(mutableMapOf<Int, Int>())
    }
    var quiz by remember {
        mutableStateOf<QuizApiModel?>(null)
    }

    var isLoading by remember {
        mutableStateOf(true)
    }
    val totalQuestions = quiz?.questions?.size ?: 0
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
    LaunchedEffect(quizId) {
        try {
            val response =
                RetrofitClient.apiService.getQuizById(quizId)

            if (response.isSuccessful) {
                quiz = response.body()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
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
                        showResult = false
                        isCorrect = false
                        userAnswers.clear()
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
                                quiz?.title ?: "Loading...",
                                color = Color.White,
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold,
                                lineHeight = 38.sp
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                quiz?.description ?: "",
                                color = Color(0xFF64748B),
                                fontSize = 15.sp,
                                lineHeight = 22.sp
                            )
                            
                            Spacer(Modifier.height(32.dp))
                            
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Question $currentQuestionIndex of $totalQuestions", color = Color(0xFF94A3B8), fontSize = 14.sp)
                                Spacer(Modifier.weight(1f))
                                val percentage =
                                    if (totalQuestions > 0)
                                        (score * 100) / totalQuestions
                                    else
                                        0

                                Text(
                                    "Score: $score/$totalQuestions ($percentage%)",
                                    color = Color(0xFF94A3B8),
                                    fontSize = 14.sp
                                )
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
                                        quiz?.questions?.getOrNull(currentQuestionIndex - 1)?.question
                                            ?: "Loading...",
                                        color = Color.White,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        lineHeight = 26.sp
                                    )

                                    Spacer(Modifier.height(32.dp))

                                    val options =
                                        quiz?.questions?.getOrNull(currentQuestionIndex - 1)?.options
                                            ?: emptyList()

                                    options.forEachIndexed { index, option ->

                                        val currentQuestion =
                                            quiz?.questions?.getOrNull(currentQuestionIndex - 1)

                                        val correctAnswer =
                                            currentQuestion?.correctAnswer

                                        OptionItem(
                                            text = option,

                                            isSelected =
                                                selectedOptionIndex == index && !showResult,

                                            isCorrect =
                                                showResult &&
                                                        correctAnswer == index,

                                            isWrong =
                                                showResult &&
                                                        selectedOptionIndex == index &&
                                                        selectedOptionIndex != correctAnswer,

                                            onClick = {
                                                if (!showResult) {

                                                    val currentQuestion =
                                                        quiz?.questions?.getOrNull(currentQuestionIndex - 1)

                                                    userAnswers[currentQuestionIndex] =
                                                        selectedOptionIndex ?: -1

                                                    isCorrect =
                                                        selectedOptionIndex == currentQuestion?.correctAnswer

                                                    if (isCorrect) {
                                                        score++
                                                    }

                                                    showResult = true
                                                }
                                            }
                                        )

                                        Spacer(Modifier.height(16.dp))
                                    }

                                    Spacer(Modifier.height(24.dp))
                                    if (showResult) {

                                        val currentQuestion =
                                            quiz?.questions?.getOrNull(currentQuestionIndex - 1)

                                        Surface(
                                            color = if (isCorrect)
                                                Color(0xFF064E3B)
                                            else
                                                Color(0xFF7F1D1D),
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {

                                            Column(
                                                modifier = Modifier.padding(16.dp)
                                            ) {

                                                Text(
                                                    text = if (isCorrect)
                                                        "✅ Correct!"
                                                    else
                                                        "❌ Incorrect",
                                                    color = Color.White,
                                                    fontWeight = FontWeight.Bold
                                                )

                                                Spacer(Modifier.height(8.dp))

                                                if (!isCorrect) {

                                                    val correctIndex =
                                                        currentQuestion?.correctAnswer ?: 0

                                                    Text(
                                                        text =
                                                            "Correct Answer: ${
                                                                currentQuestion?.options?.getOrNull(correctIndex)
                                                            }",
                                                        color = Color.White
                                                    )

                                                    Spacer(Modifier.height(8.dp))
                                                }

                                                Text(
                                                    text =
                                                        currentQuestion?.explanation
                                                            ?: "",
                                                    color = Color.White
                                                )

                                                Spacer(Modifier.height(16.dp))

                                                Button(
                                                    onClick = {

                                                        showResult = false

                                                        if (currentQuestionIndex < totalQuestions) {
                                                            currentQuestionIndex++
                                                            selectedOptionIndex = null
                                                        } else {
                                                            isQuizFinished = true
                                                        }
                                                    }
                                                ) {
                                                    Text("Continue")
                                                }
                                            }
                                        }

                                        Spacer(Modifier.height(16.dp))
                                    }

                                    Button(
                                        onClick = {

                                            if (!showResult) {

                                                val currentQuestion =
                                                    quiz?.questions?.getOrNull(currentQuestionIndex - 1)

                                                isCorrect =
                                                    selectedOptionIndex == currentQuestion?.correctAnswer

                                                if (isCorrect) {
                                                    score++
                                                }

                                                showResult = true

                                            } else {

                                                showResult = false

                                                if (currentQuestionIndex < totalQuestions) {
                                                    currentQuestionIndex++
                                                    selectedOptionIndex = null
                                                } else {
                                                    isQuizFinished = true
                                                }
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
                                            when {
                                                showResult && currentQuestionIndex < totalQuestions ->
                                                    "Next Question"

                                                showResult ->
                                                    "Finish Quiz"

                                                currentQuestionIndex < totalQuestions ->
                                                    "Check Answer"

                                                else ->
                                                    "Check Answer"
                                            }
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
                ) {HamburgerMenu(
                    isLoggedIn = true,
                    currentRoute = "quiz_attempt",
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
fun OptionItem(
    text: String,
    isSelected: Boolean,
    isCorrect: Boolean = false,
    isWrong: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.3f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.dp,
                when {
                    isCorrect -> Color(0xFF22C55E)
                    isWrong -> Color(0xFFEF4444)
                    isSelected -> Color(0xFF3B82F6)
                    else -> Color(0xFF334155)
                },
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
