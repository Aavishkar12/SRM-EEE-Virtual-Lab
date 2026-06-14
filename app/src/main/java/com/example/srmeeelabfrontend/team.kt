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
import androidx.compose.material.icons.automirrored.outlined.LibraryBooks
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.automirrored.outlined.MenuBook
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun TeamScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    
    val contentAlpha = remember { Animatable(0f) }
    val contentScale = remember { Animatable(0.97f) }
    
    LaunchedEffect(Unit) {
        launch {
            contentAlpha.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing))
        }
        launch {
            contentScale.animateTo(1f, animationSpec = tween(1200, easing = FastOutSlowInEasing))
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

                // Hero Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 40.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Meet Our",
                            color = Color.White,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "Expert Faculty Team",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 36.sp,
                                fontWeight = FontWeight.ExtraBold
                            ),
                            textAlign = TextAlign.Center
                        )

                        Spacer(Modifier.height(24.dp))

                        Text(
                            text = "Meet the dedicated faculty and staff behind the EEE Learning Platform. Our team brings decades of experience in electrical engineering education and research.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Faculty Cards
                items(facultyList) { faculty ->
                    FacultyCard(faculty)
                    Spacer(Modifier.height(24.dp))
                }

                // Faculty Expertise Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 48.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Faculty Expertise",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold
                            ),
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            text = "Our faculty members specialize in various domains of electrical engineering, bringing their expertise to the classroom and research.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Expertise Cards
                items(expertiseList) { exp ->
                    ExpertiseCard(exp)
                    Spacer(Modifier.height(16.dp))
                }

                // Faculty Achievements Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 48.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Faculty Achievements",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold
                            ),
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            text = "Our team's collective accomplishments in research, teaching, and industry collaboration",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp
                        )
                    }
                }

                // Achievements Grid
                item {
                    Column(modifier = Modifier.padding(horizontal = 24.dp)) {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            AchievementCard(Icons.Outlined.People, "4+", "Faculty Members", Color(0xFF3B82F6), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            AchievementCard(Icons.Outlined.School, "50+", "Years Experience", Color(0xFFA78BFA), Modifier.weight(1f))
                        }
                        Spacer(Modifier.height(16.dp))
                        Row(modifier = Modifier.fillMaxWidth()) {
                            AchievementCard(Icons.AutoMirrored.Outlined.LibraryBooks, "25+", "Research Projects", Color(0xFF22D3EE), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            AchievementCard(Icons.Outlined.EmojiEvents, "100+", "Publications", Color(0xFFFBBF24), Modifier.weight(1f))
                        }
                    }
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
fun FacultyCard(faculty: FacultyData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column {
            // Profile Placeholder (Big Icon)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .background(Color(0xFF1E293B).copy(alpha = 0.5f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    modifier = Modifier.size(120.dp),
                    tint = Color(0xFF64748B).copy(alpha = 0.5f)
                )
            }

            Column(modifier = Modifier.padding(24.dp)) {
                Text(
                    text = faculty.name,
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = faculty.role,
                    color = Color(0xFF3B82F6),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = faculty.dept,
                    color = Color(0xFF64748B),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
                Spacer(Modifier.height(16.dp))
                Text(
                    text = faculty.bio,
                    color = Color(0xFF94A3B8),
                    fontSize = 15.sp,
                    lineHeight = 22.sp
                )
                
                Spacer(Modifier.height(24.dp))
                
                Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                    Icon(Icons.Outlined.Email, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(20.dp))
                    Icon(Icons.Outlined.Link, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(20.dp))
                    Icon(Icons.Outlined.Code, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(20.dp))
                }
            }
        }
    }
}

@Composable
fun ExpertiseCard(exp: ExpertiseData) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.75f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Icon(exp.icon, contentDescription = null, tint = exp.color, modifier = Modifier.size(32.dp))
            Spacer(Modifier.height(16.dp))
            Text(exp.title, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(8.dp))
            Text(exp.desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)
        }
    }
}

@Composable
fun AchievementCard(icon: ImageVector, value: String, label: String, color: Color, modifier: Modifier) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.75f),
        shape = RoundedCornerShape(20.dp),
        modifier = modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(28.dp))
            Spacer(Modifier.height(16.dp))
            Text(value, color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(4.dp))
            Text(label, color = Color(0xFF64748B), fontSize = 13.sp, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center)
        }
    }
}

data class FacultyData(val name: String, val role: String, val dept: String, val bio: String)
data class ExpertiseData(val title: String, val desc: String, val icon: ImageVector, val color: Color)

val facultyList = listOf(
    FacultyData("Dr. K. Saravanan", "Associate Professor", "Department of Electrical Engineering", "Dr. K. Saravanan has over 15 years of experience in electrical engineering education and research. He specializes in power systems and renewable energy integration."),
    FacultyData("Dr. S. Vidyasagar", "Assistant Professor", "Department of Electronics Engineering", "Dr. S. Vidyasagar specializes in power electronics and control systems. He has contributed to several research projects in renewable energy applications."),
    FacultyData("Dr. D. Sattianandan", "Associate Professor", "Department of Electrical Engineering", "Dr. D. Sattianandan is an expert in power systems and smart grid technologies. He has led multiple projects on grid integration and power quality improvement."),
    FacultyData("Dr. V. Kalyanasundaram", "Assistant Professor", "Department of Electrical Engineering", "Dr. V. Kalyanasundaram specializes in electrical machines and drives. His research focuses on efficiency improvement and fault diagnosis in electrical systems.")
)

val expertiseList = listOf(
    ExpertiseData("Power Systems", "Research in smart grids, renewable energy integration, and power quality improvement", Icons.AutoMirrored.Outlined.MenuBook, Color(0xFF3B82F6)),
    ExpertiseData("Power Electronics", "Expertise in converter design, motor drives, and energy-efficient systems", Icons.Outlined.School, Color(0xFFA78BFA)),
    ExpertiseData("Control Systems", "Advanced research in automation, industrial controls, and system optimization", Icons.Outlined.WorkspacePremium, Color(0xFF34D399)),
    ExpertiseData("Electrical Machines", "Design and analysis of motors, generators, and transformers", Icons.AutoMirrored.Outlined.MenuBook, Color(0xFFFBBF24)),
    ExpertiseData("Renewable Energy", "Solar, wind, and hybrid energy systems research and development", Icons.Outlined.Info, Color(0xFFFCA5A5)),
    ExpertiseData("Digital Signal Processing", "Signal analysis, filtering techniques, and embedded systems applications", Icons.Outlined.Settings, Color(0xFF60A5FA))
)
