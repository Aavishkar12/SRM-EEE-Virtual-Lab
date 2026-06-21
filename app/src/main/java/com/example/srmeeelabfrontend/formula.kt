package com.example.srmeeelabfrontend

import com.example.srmeeelabfrontend.network.FormulaApiModel
import com.example.srmeeelabfrontend.network.RetrofitClient
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
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
fun FormulaScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var formulas by remember { mutableStateOf<List<FormulaApiModel>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

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

    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getFormulas()
            android.util.Log.d("FORMULA_DEBUG", "Response code: ${response.code()}")
            android.util.Log.d("FORMULA_DEBUG", "Response body: ${response.body()}")
            if (response.isSuccessful) {
                formulas = response.body() ?: emptyList()
            }
        } catch (e: Exception) {
            android.util.Log.e("FORMULA_DEBUG", "API ERROR: ${e.message}", e)
        } finally {
            isLoading = false
        }
    }

    val groupedFormulas = formulas.groupBy { it.category }

    val preferredOrder = listOf("DC Circuits", "AC Circuits", "Digital Electronics")
    val orderedCategories = preferredOrder.filter { groupedFormulas.containsKey(it) } +
            groupedFormulas.keys.filter { it !in preferredOrder }.sorted()

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
                item { Header(currentTime, onMenuClick = { isMenuOpen = !isMenuOpen }) }

                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                            .clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFFFBBF24), fontSize = 14.sp)
                    }
                }

                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                    ) {
                        Text(
                            "Formula Cheat Sheet",
                            color = Color(0xFFFBBF24),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "A quick-reference guide for all essential Electrical and Electronics Engineering equations.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )

                        Spacer(Modifier.height(32.dp))

                        Button(
                            onClick = { },
                            modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFFFBBF24).copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(vertical = 14.dp)
                        ) {
                            Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color(0xFFFBBF24))
                            Spacer(Modifier.width(12.dp))
                            Text("Download Full PDF", color = Color(0xFFFBBF24), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        }

                        Spacer(Modifier.height(32.dp))

                        Surface(
                            color = Color(0xFF1E1B1E).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF2E2E2E).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        ) {
                            Text(
                                text = buildAnnotatedString {
                                    append("Signed in as ")
                                    withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                                        append("as9261@srmist.edu.in")
                                    }
                                    append(". You can read the formula cards, but only admins can manage them.")
                                },
                                color = Color(0xFF737373),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }

                        Spacer(Modifier.height(32.dp))
                    }
                }

                if (isLoading) {
                    item {
                        CircularProgressIndicator(
                            color = Color(0xFFFBBF24),
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else if (formulas.isEmpty()) {
                    item {
                        Text(
                            "No formulas found.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else {
                    orderedCategories.forEach { category ->
                        item {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    categoryIcon(category),
                                    contentDescription = null,
                                    tint = categoryColor(category),
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(Modifier.width(12.dp))
                                Text(category, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            }
                        }

                        val categoryFormulas = groupedFormulas[category].orEmpty()
                        items(categoryFormulas) { formula ->
                            FormulaCard(
                                FormulaData(
                                    title = formula.name.uppercase(),
                                    equation = formula.formula,
                                    description = formula.description
                                )
                            )
                            Spacer(Modifier.height(16.dp))
                        }
                    }
                }

                item { Footer(onNavigate) }
            }
        }

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
                        currentRoute = "formula",
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

private fun categoryIcon(category: String): ImageVector = when (category) {
    "DC Circuits" -> Icons.Default.Bolt
    "AC Circuits" -> Icons.Default.ShowChart
    "Digital Electronics" -> Icons.Default.Memory
    else -> Icons.Default.Functions
}

private fun categoryColor(category: String): Color = when (category) {
    "DC Circuits" -> Color(0xFFFBBF24)
    "AC Circuits" -> Color(0xFF22D3EE)
    "Digital Electronics" -> Color(0xFF4ADE80)
    else -> Color(0xFF94A3B8)
}

@Composable
fun FormulaCard(formula: FormulaData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(formula.title, color = Color(0xFF64748B), fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
            Spacer(Modifier.height(20.dp))

            Surface(
                color = Color.Black.copy(alpha = 0.3f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    formula.equation,
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(vertical = 24.dp, horizontal = 16.dp)
                )
            }

            Spacer(Modifier.height(20.dp))
            Text(formula.description, color = Color(0xFF475569), fontSize = 14.sp, lineHeight = 20.sp)
        }
    }
}

data class FormulaData(val title: String, val equation: String, val description: String)