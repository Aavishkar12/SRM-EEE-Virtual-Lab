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
import androidx.compose.material.icons.Icons
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
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.network.RetrofitClient
import com.example.srmeeelabfrontend.network.UserApiModel
import com.example.srmeeelabfrontend.network.UserSession
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ProfileScreen(userSession: UserSession?, onNavigate: (String) -> Unit) {
    val isLoggedIn = userSession != null
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }

    // Live user data fetched from API
    var userData by remember { mutableStateOf<UserApiModel?>(null) }
    var completedCount by remember { mutableStateOf(0) }
    var isLoadingUser by remember { mutableStateOf(false) }
    var loadError by remember { mutableStateOf<String?>(null) }

    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.97f) }
    val scope = rememberCoroutineScope()

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

    // Fetch user data and progress when logged in
    LaunchedEffect(userSession) {
        if (userSession != null) {
            isLoadingUser = true
            loadError = null
            try {
                val userResponse = RetrofitClient.apiService.getUser(userSession.id)
                if (userResponse.isSuccessful) {
                    userData = userResponse.body()
                } else {
                    loadError = "Could not load profile data."
                }

                val progressResponse = RetrofitClient.apiService.getProgress(userSession.id)
                if (progressResponse.isSuccessful) {
                    completedCount = progressResponse.body()?.count { it.completed } ?: 0
                }
            } catch (e: Exception) {
                loadError = "Network error. Showing cached info."
            } finally {
                isLoadingUser = false
            }
        }
    }

    // Build the profile info list from live data, falling back to session data
    val liveInfo: List<ProfileInfo> = remember(userData, userSession, completedCount) {
        if (userSession == null) return@remember emptyList()
        val name = userData?.name ?: userSession.name
        val email = userData?.email ?: userSession.email
        val role = userData?.role ?: userSession.role
        val completed = userData?.completedExperiments?.size ?: completedCount
        listOf(
            ProfileInfo("FULL NAME", name.uppercase(), Icons.Default.Person, Color(0xFF60A5FA)),
            ProfileInfo("SRM EMAIL ADDRESS", email, Icons.Default.Email, Color(0xFFA78BFA)),
            ProfileInfo("PORTAL ACCESS ROLE", role.replaceFirstChar { it.uppercase() }, Icons.Default.Shield, Color(0xFF34D399)),
            ProfileInfo("COMPLETED EXPERIMENTS", "$completed experiment(s)", Icons.Default.Science, Color(0xFFFBBF24)),
            ProfileInfo("ACCOUNT ID", userSession.id, Icons.Default.Tag, Color(0xFFF472B6))
        )
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        AnimatedBackground()

        Scaffold(containerColor = Color.Transparent) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .alpha(contentAlpha.value)
                    .scale(contentScale.value),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                item { Header(currentTime, onMenuClick = { isMenuOpen = !isMenuOpen }) }

                if (!isLoggedIn) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 24.dp, vertical = 80.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Surface(
                                color = Color(0xFF0F172A).copy(alpha = 0.8f),
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
                                        imageVector = Icons.Default.Lock,
                                        contentDescription = null,
                                        modifier = Modifier.size(64.dp),
                                        tint = Color(0xFF3B82F6)
                                    )
                                    Spacer(Modifier.height(24.dp))
                                    Text(
                                        text = "SRM profile access",
                                        color = Color.White,
                                        fontSize = 22.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        textAlign = TextAlign.Center
                                    )
                                    Spacer(Modifier.height(16.dp))
                                    Text(
                                        text = "Profile details are available only to signed-in SRM users.",
                                        color = Color(0xFF94A3B8),
                                        fontSize = 15.sp,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 22.sp
                                    )
                                    Spacer(Modifier.height(16.dp))
                                    Text(
                                        text = buildAnnotatedString {
                                            append("Sign in with your ")
                                            withStyle(SpanStyle(color = Color(0xFF60A5FA))) {
                                                append("@srmist.edu.in")
                                            }
                                            append(" email to continue.")
                                        },
                                        color = Color(0xFF94A3B8),
                                        fontSize = 15.sp,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 22.sp
                                    )
                                    Spacer(Modifier.height(32.dp))
                                    Button(
                                        onClick = { onNavigate("login") },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                                        shape = RoundedCornerShape(12.dp),
                                        modifier = Modifier.fillMaxWidth().height(50.dp)
                                    ) {
                                        Text("Go to Sign In", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Title
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 32.dp)
                        ) {
                            Text(
                                "My Profile",
                                color = Color.White,
                                fontSize = 42.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = (-0.5).sp
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                "Your Academia-linked student profile with course, department, and portal access details.",
                                color = Color(0xFF94A3B8),
                                fontSize = 16.sp,
                                lineHeight = 24.sp
                            )
                        }
                    }

                    // Loading / error state
                    if (isLoadingUser) {
                        item {
                            Box(
                                modifier = Modifier.fillMaxWidth().height(120.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(color = Color(0xFF3B82F6))
                            }
                        }
                    } else {
                        if (loadError != null) {
                            item {
                                Surface(
                                    color = Color(0xFF1C1917).copy(alpha = 0.6f),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 24.dp)
                                        .border(1.dp, Color(0xFF78716C), RoundedCornerShape(12.dp))
                                ) {
                                    Text(
                                        text = loadError!!,
                                        color = Color(0xFFFBBF24),
                                        fontSize = 13.sp,
                                        modifier = Modifier.padding(14.dp),
                                        textAlign = TextAlign.Center
                                    )
                                }
                                Spacer(Modifier.height(16.dp))
                            }
                        }

                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp, vertical = 16.dp)
                            ) {
                                Text(
                                    "Academia Information",
                                    color = Color.White,
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(Modifier.height(24.dp))
                            }
                        }

                        items(liveInfo) { info ->
                            ProfileInfoCard(info)
                            Spacer(Modifier.height(16.dp))
                        }
                    }

                    item { Spacer(Modifier.height(32.dp)) }
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
                        currentRoute = "profile",
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
fun ProfileInfoCard(info: ProfileInfo) {
    val infiniteTransition = rememberInfiniteTransition(label = "profileGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(2500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF1E293B),
                        info.color.copy(alpha = glowAlpha),
                        Color(0xFF1E293B)
                    )
                ),
                shape = RoundedCornerShape(16.dp)
            )
    ) {
        Row(
            modifier = Modifier.padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = Color(0xFF1E293B),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(48.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = info.icon,
                        contentDescription = null,
                        tint = info.color,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }
            Spacer(Modifier.width(20.dp))
            Column {
                Text(
                    text = info.label,
                    color = Color(0xFF64748B),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = info.value,
                    color = Color.White,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }
        }
    }
}

data class ProfileInfo(val label: String, val value: String, val icon: ImageVector, val color: Color)