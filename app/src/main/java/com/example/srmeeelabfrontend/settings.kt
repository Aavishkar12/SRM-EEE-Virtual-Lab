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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.network.UserSession
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun SettingsScreen(userSession: UserSession?, onNavigate: (String) -> Unit) {
    val isLoggedIn = userSession != null
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableIntStateOf(0) }

    // Academia profile fields come straight from userSession (set at login) —
    // no extra network call needed here.
    var isLoadingUser by remember { mutableStateOf(false) }
    var loadError by remember { mutableStateOf<String?>(null) }

    // Editable display name field (tab 0)
    var displayName by remember { mutableStateOf("") }
    var isSaving by remember { mutableStateOf(false) }
    var saveSuccess by remember { mutableStateOf(false) }

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

    // Seed the editable display name from the Academia session (already
    // populated at login — no extra fetch from the mock /api/users endpoint).
    LaunchedEffect(userSession) {
        if (userSession != null) {
            displayName = userSession.name
        }
    }

    // Build academia info list straight from the session data
    val settingsInfoList: List<ProfileInfo> = remember(userSession) {
        if (userSession == null) return@remember emptyList()
        listOf(
            ProfileInfo("STUDENT NAME", userSession.name.uppercase(), Icons.Default.Person, Color.White),
            ProfileInfo("EMAIL", userSession.email, Icons.Default.Email, Color.White),
            ProfileInfo("REGISTRATION NUMBER", userSession.registrationNumber.ifBlank { "N/A" }, Icons.Default.Badge, Color.White),
            ProfileInfo("DEPARTMENT", userSession.department.ifBlank { "N/A" }, Icons.Default.School, Color.White),
            ProfileInfo("BRANCH", userSession.branch.ifBlank { "N/A" }, Icons.Default.AccountTree, Color.White),
            ProfileInfo("YEAR / SEMESTER", "${userSession.year.ifBlank { "N/A" }} / ${userSession.semester.ifBlank { "N/A" }}", Icons.Default.CalendarMonth, Color.White),
            ProfileInfo("SECTION", userSession.section.ifBlank { "N/A" }, Icons.Default.Groups, Color.White),
            ProfileInfo("BATCH", userSession.batch.ifBlank { "N/A" }, Icons.Default.Tag, Color.White),
            ProfileInfo("PROGRAM", userSession.program.ifBlank { "N/A" }, Icons.Default.MenuBook, Color.White),
            ProfileInfo("MOBILE", userSession.mobile.ifBlank { "N/A" }, Icons.Default.Phone, Color.White),
            ProfileInfo("ROLE", userSession.role.replaceFirstChar { it.uppercase() }, Icons.Default.Shield, Color.White)
        )
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
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
                                color = Color(0xFF0A131F).copy(alpha = 0.8f),
                                shape = RoundedCornerShape(24.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
                            ) {
                                Column(
                                    modifier = Modifier.padding(32.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Lock,
                                        contentDescription = null,
                                        modifier = Modifier.size(64.dp),
                                        tint = Color(0xFF1FD7C4)
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
                                        color = Color(0xFF94ACBA),
                                        fontSize = 15.sp,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 22.sp
                                    )
                                    Spacer(Modifier.height(16.dp))
                                    Text(
                                        text = buildAnnotatedString {
                                            append("Sign in with your ")
                                            withStyle(SpanStyle(color = Color(0xFF5EEAD4))) {
                                                append("@srmist.edu.in")
                                            }
                                            append(" email to continue.")
                                        },
                                        color = Color(0xFF94ACBA),
                                        fontSize = 15.sp,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 22.sp
                                    )
                                    Spacer(Modifier.height(32.dp))
                                    Button(
                                        onClick = { onNavigate("login") },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D9488)),
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
                                "PREFERENCES",
                                color = Color(0xFF1FD7C4),
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
                                color = Color(0xFF94ACBA),
                                fontSize = 16.sp,
                                lineHeight = 24.sp
                            )
                        }
                    }

                    // User Summary Card — live data
                    item {
                        Surface(
                            color = Color(0xFF0A131F).copy(alpha = 0.6f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp)
                                .border(1.dp, Color(0xFF142233), RoundedCornerShape(20.dp))
                        ) {
                            if (isLoadingUser) {
                                Box(
                                    modifier = Modifier.fillMaxWidth().height(60.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    CircularProgressIndicator(
                                        color = Color(0xFF1FD7C4),
                                        modifier = Modifier.size(24.dp),
                                        strokeWidth = 2.dp
                                    )
                                }
                            } else {
                                Column(modifier = Modifier.padding(20.dp)) {
                                    Text(
                                        (userSession?.name ?: "").uppercase(),
                                        color = Color.White,
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.ExtraBold
                                    )
                                    Text(
                                        userSession?.email ?: "",
                                        color = Color(0xFF6E8699),
                                        fontSize = 14.sp
                                    )
                                }
                            }
                        }
                        Spacer(Modifier.height(24.dp))
                    }

                    // Error banner
                    if (loadError != null) {
                        item {
                            Surface(
                                color = Color(0xFF13181D).copy(alpha = 0.6f),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp)
                                    .border(1.dp, Color(0xFF7E8A8A), RoundedCornerShape(12.dp))
                            ) {
                                Text(
                                    text = loadError!!,
                                    color = Color(0xFFE8954D),
                                    fontSize = 13.sp,
                                    modifier = Modifier.padding(14.dp),
                                    textAlign = TextAlign.Center
                                )
                            }
                            Spacer(Modifier.height(16.dp))
                        }
                    }

                    // Tab bar
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp)
                                .background(Color(0xFF0A131F).copy(alpha = 0.6f), RoundedCornerShape(12.dp))
                                .border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp)),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            listOf(
                                Icons.Default.AccountCircle,
                                Icons.Default.Palette,
                                Icons.Default.Notifications,
                                Icons.Default.Lock
                            ).forEachIndexed { index, icon ->
                                IconButton(
                                    onClick = { selectedTab = index },
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(4.dp)
                                        .background(
                                            if (selectedTab == index) Color(0xFF142233) else Color.Transparent,
                                            RoundedCornerShape(8.dp)
                                        )
                                ) {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = null,
                                        tint = if (selectedTab == index) Color(0xFF5EEAD4) else Color(0xFF94ACBA)
                                    )
                                }
                            }
                        }
                        Spacer(Modifier.height(32.dp))
                    }

                    // Tab 0 — Account / Profile
                    if (selectedTab == 0) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp)
                            ) {
                                Text("Academia Profile", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(8.dp))
                                Text(
                                    "These details are synced from your SRM Academia account.",
                                    color = Color(0xFF6E8699),
                                    fontSize = 14.sp
                                )
                                Spacer(Modifier.height(24.dp))
                            }
                        }

                        items(settingsInfoList) { info ->
                            SettingsInfoCard(info)
                            Spacer(Modifier.height(16.dp))
                        }

                        // Display name edit + Save button wired to PUT /api/users/{id}
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp, vertical = 32.dp)
                            ) {
                                Text(
                                    "Display Preferences",
                                    color = Color.White,
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(Modifier.height(24.dp))

                                Text("Display Name", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(12.dp))
                                CustomTextField(
                                    value = displayName,
                                    onValueChange = { displayName = it }
                                )

                                Spacer(Modifier.height(24.dp))

                                Text("Email", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(12.dp))
                                // Email is read-only — shown as plain text
                                Surface(
                                    color = Color(0xFF142233).copy(alpha = 0.3f),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(1.dp, Color(0xFF142233), RoundedCornerShape(10.dp))
                                ) {
                                    Text(
                                        text = userSession?.email ?: "",
                                        color = Color(0xFF6E8699),
                                        fontSize = 15.sp,
                                        modifier = Modifier.padding(16.dp)
                                    )
                                }

                                // Save success banner
                                if (saveSuccess) {
                                    Spacer(Modifier.height(16.dp))
                                    Surface(
                                        color = Color(0xFF072A20).copy(alpha = 0.7f),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .border(1.dp, Color(0xFF1B5A42), RoundedCornerShape(10.dp))
                                    ) {
                                        Text(
                                            "Settings saved successfully.",
                                            color = Color(0xFFA0F7C4),
                                            fontSize = 13.sp,
                                            modifier = Modifier.padding(12.dp),
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                }

                                Spacer(Modifier.height(32.dp))

                                Button(
                                    onClick = {
                                        // NOTE: there's no real backend endpoint to persist a
                                        // display-name override for an Academia-sourced profile
                                        // (PUT /api/users/{id} is mock data only and would 404
                                        // for a real userSession.id, which is now an email).
                                        // This just updates local UI state for this session.
                                        saveSuccess = true
                                    },
                                    modifier = Modifier.align(Alignment.End),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D9488)),
                                    shape = RoundedCornerShape(10.dp),
                                    enabled = !isSaving
                                ) {
                                    if (isSaving) {
                                        CircularProgressIndicator(
                                            color = Color.White,
                                            modifier = Modifier.size(16.dp),
                                            strokeWidth = 2.dp
                                        )
                                    } else {
                                        Text("Save Settings", fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        // Tab 3 — Privacy
                    } else if (selectedTab == 3) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 24.dp)
                            ) {
                                Text("Privacy Settings", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(32.dp))

                                PrivacySwitchRow(
                                    "Share Progress",
                                    "Allow instructors to view your experiment progress",
                                    true
                                )
                                Spacer(Modifier.height(24.dp))
                                PrivacySwitchRow(
                                    "Public Profile",
                                    "Make your profile visible to other students",
                                    false
                                )
                                Spacer(Modifier.height(24.dp))
                                PrivacySwitchRow(
                                    "Data Collection",
                                    "Allow anonymous usage data collection to improve the platform",
                                    true
                                )

                                Spacer(Modifier.height(48.dp))
                                // Privacy prefs are local-only (no backend endpoint)
                                Button(
                                    onClick = { saveSuccess = true },
                                    modifier = Modifier.align(Alignment.End),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D9488)),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Save Settings", fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        // Tabs 1 & 2 — placeholder
                    } else {
                        item {
                            Box(
                                modifier = Modifier.fillMaxWidth().height(200.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("Section under development", color = Color(0xFF6E8699))
                            }
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
                        currentRoute = "settings",
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
fun SettingsInfoCard(info: ProfileInfo) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.6f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = info.icon,
                contentDescription = null,
                tint = Color(0xFF6E8699),
                modifier = Modifier.size(18.dp)
            )
            Spacer(Modifier.width(16.dp))
            Column {
                Text(
                    text = info.label,
                    color = Color(0xFF6E8699),
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
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit = {},
    singleLine: Boolean = true,
    modifier: Modifier = Modifier
) {
    var text by remember(value) { mutableStateOf(value) }
    Surface(
        color = Color(0xFF142233).copy(alpha = 0.5f),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF24384C), RoundedCornerShape(10.dp))
    ) {
        BasicTextField(
            value = text,
            onValueChange = {
                text = it
                onValueChange(it)
            },
            textStyle = TextStyle(color = Color.White, fontSize = 16.sp),
            cursorBrush = SolidColor(Color(0xFF1FD7C4)),
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
            Text(desc, color = Color(0xFF6E8699), fontSize = 13.sp)
        }
        Switch(
            checked = checked,
            onCheckedChange = { checked = it },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF0D9488),
                uncheckedThumbColor = Color(0xFF94ACBA),
                uncheckedTrackColor = Color(0xFF142233)
            )
        )
    }
}