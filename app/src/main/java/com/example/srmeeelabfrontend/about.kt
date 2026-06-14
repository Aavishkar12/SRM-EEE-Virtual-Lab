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
fun AboutScreen(isLoggedIn: Boolean, onNavigate: (String) -> Unit) {
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

                // Hero Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color(0xFF1E293B).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFF60A5FA), modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("SRM Institute of Science and Technology", color = Color(0xFF94A3B8), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                            }
                        }

                        Spacer(Modifier.height(32.dp))

                        Text(
                            text = "EEE",
                            color = Color.White,
                            fontSize = 48.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "Virtual Lab",
                            style = TextStyle(
                                brush = Brush.horizontalGradient(listOf(Color(0xFF60A5FA), Color(0xFFA78BFA))),
                                fontSize = 48.sp,
                                fontWeight = FontWeight.ExtraBold
                            ),
                            textAlign = TextAlign.Center
                        )

                        Spacer(Modifier.height(28.dp))

                        Text(
                            text = "An interactive virtual laboratory for the Department of Electrical & Electronics Engineering — empowering students with 24/7 access to experiments, simulations, and study resources.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 26.sp,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )
                    }
                }

                // Stats Grid
                item {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            AboutStatCard(Icons.Outlined.Science, "12+", "Experiments", Color(0xFF3B82F6), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            AboutStatCard(Icons.Outlined.Book, "50+", "Quiz Questions", Color(0xFFA78BFA), Modifier.weight(1f))
                        }
                        Spacer(Modifier.height(16.dp))
                        Row(modifier = Modifier.fillMaxWidth()) {
                            AboutStatCard(Icons.Outlined.School, "30+", "Study Resources", Color(0xFF22D3EE), Modifier.weight(1f))
                            Spacer(Modifier.width(16.dp))
                            AboutStatCard(Icons.Outlined.AccessTime, "∞", "24 / 7 Access", Color(0xFF34D399), Modifier.weight(1f))
                        }
                    }
                }

                // Our Mission
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 40.dp)
                    ) {
                        Text(
                            text = "Our Mission",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Box(modifier = Modifier.width(60.dp).height(4.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(32.dp))
                        
                        Text(
                            text = "The SRM EEE Virtual Lab is a resource of the Electrical and Electronics Engineering Department at SRM Institute of Science and Technology, Kattankulathur. The lab gives engineering students a comprehensive platform to explore, experiment, and build a robust understanding of the core principles of electrical and electronics engineering.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 26.sp
                        )
                        Spacer(Modifier.height(24.dp))
                        Text(
                            text = "We are committed to bridging the gap between theory and practice — empowering students to enhance their problem-solving skills, strengthen technical expertise, and foster a passion for innovation in the engineering domain, anytime and from anywhere.",
                            color = Color(0xFF94A3B8),
                            fontSize = 16.sp,
                            lineHeight = 26.sp
                        )
                    }
                }

                // Key Features
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 24.dp)
                    ) {
                        Text(
                            text = "Key Features",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Box(modifier = Modifier.width(60.dp).height(4.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(32.dp))
                    }
                }

                items(aboutFeatures) { feature ->
                    AboutFeatureCard(feature)
                    Spacer(Modifier.height(16.dp))
                }

                // Objectives
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 48.dp)
                    ) {
                        Text(
                            text = "Objectives",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Box(modifier = Modifier.width(60.dp).height(4.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(32.dp))
                    }
                }

                items(aboutObjectives) { objective ->
                    AboutObjectiveCard(objective)
                    Spacer(Modifier.height(16.dp))
                }

                // Faculty Team
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 48.dp)
                    ) {
                        Text(
                            text = "Faculty Team",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Box(modifier = Modifier.width(60.dp).height(4.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(32.dp))
                    }
                }

                items(aboutFaculty) { faculty ->
                    AboutFacultyCard(faculty)
                    Spacer(Modifier.height(16.dp))
                }

                // Contact Us
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 48.dp)
                    ) {
                        Text(
                            text = "Contact Us",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.height(8.dp))
                        Box(modifier = Modifier.width(60.dp).height(4.dp).background(Color(0xFF3B82F6)))
                        
                        Spacer(Modifier.height(32.dp))
                        
                        ContactCard()
                    }
                }

                // Footer
                item { Footer() }
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
fun AboutStatCard(icon: ImageVector, value: String, label: String, color: Color, modifier: Modifier) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
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

@Composable
fun AboutFeatureCard(feature: AboutFeature) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Surface(
                color = Color(0xFF1E293B).copy(alpha = 0.5f),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.size(44.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(feature.icon, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(24.dp))
                }
            }
            Spacer(Modifier.height(20.dp))
            Text(feature.title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(8.dp))
            Text(feature.desc, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)
        }
    }
}

@Composable
fun AboutObjectiveCard(obj: AboutObjective) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Row(
            modifier = Modifier.padding(24.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = Color(0xFF1E293B),
                shape = CircleShape,
                modifier = Modifier.size(40.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(obj.number, color = Color(0xFF60A5FA), fontWeight = FontWeight.ExtraBold)
                }
            }
            Spacer(Modifier.width(20.dp))
            Text(obj.text, color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 22.sp)
        }
    }
}

@Composable
fun AboutFacultyCard(faculty: AboutFaculty) {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.6f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
    ) {
        Row(modifier = Modifier.padding(20.dp), verticalAlignment = Alignment.CenterVertically) {
            Surface(
                color = Color(0xFF3B82F6),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(faculty.initial, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.width(20.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(faculty.name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                Text(faculty.role, color = Color(0xFF3B82F6), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Text(faculty.dept, color = Color(0xFF64748B), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Email, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(8.dp))
                    Text(faculty.email, color = Color(0xFF60A5FA), fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun ContactCard() {
    Surface(
        color = Color(0xFF0F172A).copy(alpha = 0.8f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(28.dp)) {
            Surface(
                color = Color(0xFF3B82F6).copy(alpha = 0.1f),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.border(1.dp, Color(0xFF3B82F6).copy(alpha = 0.2f), RoundedCornerShape(20.dp))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(Icons.Default.Bolt, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("GET IN TOUCH", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
            
            Spacer(Modifier.height(24.dp))
            Text("Department of Electrical and Electronics Engineering", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(12.dp))
            Text("SRM Institute of Science and Technology\nKattankulathur 603 203, Tamil Nadu", color = Color(0xFF94A3B8), fontSize = 15.sp, lineHeight = 24.sp)
            
            Spacer(Modifier.height(32.dp))
            
            Surface(
                color = Color(0xFF1E293B).copy(alpha = 0.5f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 16.dp)) {
                    Icon(Icons.Default.Email, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(12.dp))
                    Text("eee@srm.edu.in", color = Color(0xFF60A5FA), fontSize = 15.sp)
                }
            }
            
            Spacer(Modifier.height(12.dp))
            
            Surface(
                color = Color(0xFF1E293B).copy(alpha = 0.5f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 16.dp)) {
                    Icon(Icons.Default.Launch, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(12.dp))
                    Text("www.srmist.edu.in", color = Color(0xFF60A5FA), fontSize = 15.sp)
                }
            }
        }
    }
}

data class AboutFeature(val title: String, val desc: String, val icon: ImageVector)
data class AboutObjective(val number: String, val text: String)
data class AboutFaculty(val name: String, val role: String, val dept: String, val email: String, val initial: String)

val aboutFeatures = listOf(
    AboutFeature("Interactive Simulations", "Run circuit simulations and observe real-time behavior of electrical systems without physical hardware.", Icons.Outlined.Devices),
    AboutFeature("Hands-On Learning", "Step-by-step guided experiments reinforce theoretical knowledge and develop essential technical skills.", Icons.Outlined.Science),
    AboutFeature("Comprehensive Coverage", "Covers the full 26EEE1001T Basic Electrical Engineering curriculum — from DC circuits to AC theory.", Icons.Outlined.MenuBook),
    AboutFeature("Expert Guidance", "Content designed and reviewed by faculty from the Department of EEE, SRM IST Kattankulathur.", Icons.Outlined.People),
    AboutFeature("Modern Stack", "Built with Next.js, real-time data, and interactive UI so the learning experience stays current and accessible.", Icons.Outlined.AutoAwesome),
    AboutFeature("Self-Paced Quizzes", "Test your understanding with quizzes mapped to each experiment, with instant feedback and scoring.", Icons.Outlined.Lightbulb)
)

val aboutObjectives = listOf(
    AboutObjective("1", "Provide hands-on experience with fundamental electrical and electronics experiments in a safe virtual environment."),
    AboutObjective("2", "Strengthen theoretical knowledge through interactive simulations and practical applications."),
    AboutObjective("3", "Cultivate critical thinking, data analysis, and problem-solving skills essential for an engineer."),
    AboutObjective("4", "Establish a strong foundation for advanced studies in power systems, electronics, and control engineering.")
)

val aboutFaculty = listOf(
    AboutFaculty("Dr. K. Saravanan", "Associate Professor", "Dept. of Electrical & Electronics Engineering", "saravanan@srm.edu.in", "S"),
    AboutFaculty("Dr. S. Vidyasagar", "Assistant Professor", "Dept. of Electrical & Electronics Engineering", "vidyasagar@srm.edu.in", "V"),
    AboutFaculty("Dr. D. Sattianandan", "Associate Professor", "Dept. of Electrical & Electronics Engineering", "sattianandan@srm.edu.in", "S"),
    AboutFaculty("Dr. V. Kalyanasundaram", "Assistant Professor", "Dept. of Electrical & Electronics Engineering", "kalyanasundaram@srm.edu.in", "K")
)
