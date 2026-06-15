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
fun SettingsScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableIntStateOf(0) }
    
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

                if (!isLoggedIn) {
                    // Access Denied Section
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
                                        text = "SRM settings access",
                                        color = Color.White,
                                        fontSize = 22.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        textAlign = TextAlign.Center
                                    )
                                    
                                    Spacer(Modifier.height(16.dp))
                                    
                                    Text(
                                        text = "Settings are available only to signed-in SRM users.",
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
                    // Settings Content
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 32.dp)
                        ) {
                            Text(
                                "PREFERENCES",
                                color = Color(0xFF3B82F6),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.sp
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "Settings",
                                color = Color.White,
                                fontSize = 42.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = (-0.5).sp
                            )
                            Spacer(Modifier.height(12.dp))
                            Text(
                                "Manage your account, appearance, notifications, and administrative access.",
                                color = Color(0xFF94A3B8),
                                fontSize = 16.sp,
                                lineHeight = 24.sp
                            )
                        }
                    }

                    // User Summary Card
                    item {
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.6f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text("AAVISHKAR SINGH", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                                Text("as9261@srmist.edu.in", color = Color(0xFF64748B), fontSize = 14.sp)
                            }
                        }
                        Spacer(Modifier.height(24.dp))
                    }

                    // Tab bar
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp)
                                .background(Color(0xFF0F172A).copy(alpha = 0.6f), RoundedCornerShape(12.dp))
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp)),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            listOf(Icons.Default.AccountCircle, Icons.Default.Palette, Icons.Default.Notifications, Icons.Default.Lock).forEachIndexed { index, icon ->
                                IconButton(
                                    onClick = { selectedTab = index },
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(4.dp)
                                        .background(
                                            if (selectedTab == index) Color(0xFF1E293B) else Color.Transparent,
                                            RoundedCornerShape(8.dp)
                                        )
                                ) {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = null,
                                        tint = if (selectedTab == index) Color(0xFF60A5FA) else Color(0xFF94A3B8)
                                    )
                                }
                            }
                        }
                        Spacer(Modifier.height(32.dp))
                    }

                    if (selectedTab == 0) {
                        // Profile Settings
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp)
                            ) {
                                Text("Academia Profile", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(8.dp))
                                Text("These details are synced from your SRM Academia account.", color = Color(0xFF64748B), fontSize = 14.sp)
                                Spacer(Modifier.height(24.dp))
                            }
                        }

                        items(academiaSettingsInfo) { info ->
                            SettingsInfoCard(info)
                            Spacer(Modifier.height(16.dp))
                        }

                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp, vertical = 32.dp)
                            ) {
                                Text("Display Preferences", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(24.dp))
                                
                                Text("Display Name", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(12.dp))
                                CustomTextField(value = "AAVISHKAR SINGH")
                                
                                Spacer(Modifier.height(24.dp))
                                
                                Text("Bio", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(12.dp))
                                CustomTextField(
                                    value = "Computer Science and Engineering(CS), Section (O1 Section)",
                                    singleLine = false,
                                    modifier = Modifier.height(100.dp)
                                )
                                
                                Spacer(Modifier.height(32.dp))
                                Button(
                                    onClick = { },
                                    modifier = Modifier.align(Alignment.End),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Save Settings", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    } else if (selectedTab == 3) {
                        // Privacy Settings (as in last screenshot)
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp)
                            ) {
                                Text("Privacy Settings", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(32.dp))
                                
                                PrivacySwitchRow("Share Progress", "Allow instructors to view your experiment progress", true)
                                Spacer(Modifier.height(24.dp))
                                PrivacySwitchRow("Public Profile", "Make your profile visible to other students", false)
                                Spacer(Modifier.height(24.dp))
                                PrivacySwitchRow("Data Collection", "Allow anonymous usage data collection to improve the platform", true)
                                
                                Spacer(Modifier.height(48.dp))
                                Button(
                                    onClick = { },
                                    modifier = Modifier.align(Alignment.End),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Save Settings", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    } else {
                        // Placeholder for other tabs
                        item {
                            Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                                Text("Section under development", color = Color(0xFF64748B))
                            }
                        }
                    }
                    
                    item { Spacer(Modifier.height(32.dp)) }
                }

                // Footer
                item { Footer(onNavigate) }
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
fun SettingsInfoCard(info: ProfileInfo) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = info.icon,
                contentDescription = null,
                tint = Color(0xFF64748B),
                modifier = Modifier.size(18.dp)
            )
            Spacer(Modifier.width(16.dp))
            Column {
                Text(
                    text = info.label,
                    color = Color(0xFF64748B),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = info.value,
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }
        }
    }
}

@Composable
fun CustomTextField(value: String, singleLine: Boolean = true, modifier: Modifier = Modifier) {
    var text by remember { mutableStateOf(value) }
    Surface(
        color = Color(0xFF1E293B).copy(alpha = 0.5f),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF334155), RoundedCornerShape(10.dp))
    ) {
        BasicTextField(
            value = text,
            onValueChange = { text = it },
            textStyle = TextStyle(color = Color.White, fontSize = 16.sp),
            cursorBrush = SolidColor(Color(0xFF3B82F6)),
            modifier = Modifier.padding(16.dp),
            singleLine = singleLine
        )
    }
}

@Composable
fun PrivacySwitchRow(title: String, desc: String, initialValue: Boolean) {
    var checked by remember { mutableStateOf(initialValue) }
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Text(desc, color = Color(0xFF64748B), fontSize = 13.sp)
        }
        Switch(
            checked = checked,
            onCheckedChange = { checked = it },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF2563EB),
                uncheckedThumbColor = Color(0xFF94A3B8),
                uncheckedTrackColor = Color(0xFF1E293B)
            )
        )
    }
}

val academiaSettingsInfo = listOf(
    ProfileInfo("STUDENT NAME", "AAVISHKAR SINGH", Icons.Default.Person, Color.White),
    ProfileInfo("EMAIL", "as9261@srmist.edu.in", Icons.Default.Email, Color.White),
    ProfileInfo("REGISTRATION NO.", "RA2511003011024", Icons.Default.Tag, Color.White),
    ProfileInfo("BRANCH", "Computer Science and Engineering(CS)", Icons.Default.Apartment, Color.White),
    ProfileInfo("YEAR", "—", Icons.Default.Tag, Color.White),
    ProfileInfo("SEMESTER", "2", Icons.Default.Tag, Color.White),
    ProfileInfo("BATCH", "1/1", Icons.Default.Tag, Color.White)
)
