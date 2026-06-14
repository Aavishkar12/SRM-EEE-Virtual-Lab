package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.ui.theme.SrmEEELabFrontendTheme
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    val scrollState = rememberScrollState()
    
    val contentVisible = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        contentVisible.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing))
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
            modifier = Modifier.fillMaxSize(),
            containerColor = Color.Transparent
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
                    .verticalScroll(scrollState)
                    .padding(horizontal = 24.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header Bar (Logo Left, Time Right)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp)
                        .alpha(contentVisible.value),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .border(
                                    width = 1.dp,
                                    brush = Brush.linearGradient(listOf(Color(0xFF6366F1), Color(0xFFA855F7))),
                                    shape = CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("SRM", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
                        }
                        Text(
                            "VIRTUAL LAB",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    Surface(
                        color = Color(0xFF0F172A),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(10.dp))
                    ) {
                        Text(
                            text = currentTime,
                            color = Color(0xFF60A5FA),
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            letterSpacing = 1.2.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                // Login Form Container
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .scale(0.9f + (contentVisible.value * 0.1f))
                        .alpha(contentVisible.value)
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
                        .background(Color(0xFF080C14).copy(alpha = 0.9f), RoundedCornerShape(24.dp))
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Central Logo
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .border(
                                width = 2.dp,
                                brush = Brush.linearGradient(
                                    colors = listOf(Color(0xFF6366F1), Color(0xFFA855F7))
                                ),
                                shape = CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "SRM", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold)
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "VIRTUAL LAB",
                        color = Color.White,
                        fontSize = 14.sp,
                        letterSpacing = 2.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(28.dp))
                    Text(
                        text = "Sign in to SRM EEE VLab",
                        color = Color.White,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.ExtraBold,
                        textAlign = TextAlign.Center,
                        letterSpacing = (-0.5).sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Use your SRM Academia credentials to continue",
                        color = Color(0xFF94A3B8),
                        fontSize = 15.sp,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 22.sp
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    // Email Field
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(text = "SRM Email Address", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("yourname@srmist.edu.in", color = Color(0xFF475569)) },
                            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = Color(0xFF6366F1)) },
                            shape = RoundedCornerShape(14.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF3B82F6),
                                unfocusedBorderColor = Color(0xFF1E293B),
                                focusedContainerColor = Color(0xFF0F172A),
                                unfocusedContainerColor = Color(0xFF0F172A),
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            singleLine = true
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Password Field
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(text = "Password", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("••••••••", color = Color(0xFF475569)) },
                            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFF6366F1)) },
                            shape = RoundedCornerShape(14.dp),
                            visualTransformation = PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF3B82F6),
                                unfocusedBorderColor = Color(0xFF1E293B),
                                focusedContainerColor = Color(0xFF0F172A),
                                unfocusedContainerColor = Color(0xFF0F172A),
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            singleLine = true
                        )
                        Text(
                            text = "Same password as your SRM Academia portal",
                            color = Color(0xFF475569),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.align(Alignment.End).padding(top = 6.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(32.dp))

                    // Sign In Button
                    Button(
                        onClick = onLoginSuccess,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .border(
                                width = 1.dp,
                                brush = Brush.linearGradient(listOf(Color(0xFF3B82F6), Color(0xFF8B5CF6))),
                                shape = RoundedCornerShape(28.dp)
                            ),
                        shape = RoundedCornerShape(28.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                    ) {
                        Text(text = "Sign in →", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Footer Notice
                    Surface(
                        color = Color(0xFF0F172A).copy(alpha = 0.5f),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                    ) {
                        Text(
                            text = "Your credentials are used only to authenticate with SRM Academia. They are not stored on this platform.",
                            color = Color(0xFF64748B),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(18.dp),
                            textAlign = TextAlign.Center,
                            lineHeight = 20.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.height(60.dp))
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginPreview() {
    SrmEEELabFrontendTheme(darkTheme = true, dynamicColor = false) {
        LoginScreen(onLoginSuccess = {})
    }
}
