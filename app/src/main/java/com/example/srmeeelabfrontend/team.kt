package com.example.srmeeelabfrontend

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class FacultyData(
    val name: String,
    val role: String,
    val department: String,
    val bio: String,
    val drawableRes: Int,
    val email: String,
    val linkedin: String,
    val github: String,
)

val facultyList = listOf(
    FacultyData(
        name = "Dr. S. Vidyasagar",
        role = "Assistant Professor",
        department = "Department of Electronics Engineering",
        bio = "Dr. S. Vidyasagar specializes in power electronics and control systems. He has contributed to several research projects in renewable energy applications.",
        drawableRes = R.drawable.vidyasagar,
        email = "vidyasagar@srm.edu.in",
        linkedin = "https://linkedin.com/in/example",
        github = "https://github.com/example",
    ),
    FacultyData(
        name = "Dr. K. Saravanan",
        role = "Associate Professor",
        department = "Department of Electrical Engineering",
        bio = "Dr. K. Saravanan has over 15 years of experience in electrical engineering education and research. He specializes in power systems and renewable energy integration.",
        drawableRes = R.drawable.saravanan,
        email = "saravanan@srm.edu.in",
        linkedin = "https://linkedin.com/in/example",
        github = "https://github.com/example",
    ),
    FacultyData(
        name = "Dr. D. Sattianandan",
        role = "Associate Professor",
        department = "Department of Electrical Engineering",
        bio = "Dr. D. Sattianandan is an expert in power systems and smart grid technologies. He has led multiple projects on grid integration and power quality improvement.",
        drawableRes = R.drawable.sattianandan,
        email = "sattianandan@srm.edu.in",
        linkedin = "https://linkedin.com/in/example",
        github = "https://github.com/example",
    ),
    FacultyData(
        name = "Dr. V. Kalyanasundaram",
        role = "Assistant Professor",
        department = "Department of Electrical Engineering",
        bio = "Dr. V. Kalyanasundaram specializes in electrical machines and drives. His research focuses on efficiency improvement and fault diagnosis in electrical systems.",
        drawableRes = R.drawable.kalyanasundaram,
        email = "kalyanasundaram@srm.edu.in",
        linkedin = "https://linkedin.com/in/example",
        github = "https://github.com/example",
    ),
)

data class ExpertiseData(val title: String, val description: String, val icon: ImageVector, val tint: Color)

val expertiseList = listOf(
    ExpertiseData("Power Systems", "Research in smart grids, renewable energy integration, and power quality improvement", Icons.Default.ElectricBolt, Color(0xFF5EEAD4)),
    ExpertiseData("Power Electronics", "Expertise in converter design, motor drives, and energy-efficient systems", Icons.Default.School, Color(0xFFC4A8FF)),
    ExpertiseData("Control Systems", "Advanced research in automation, industrial controls, and system optimization", Icons.Default.Star, Color(0xFF3DE8B0)),
    ExpertiseData("Electrical Machines", "Design and analysis of motors, generators, and transformers", Icons.Default.MenuBook, Color(0xFFE8954D)),
    ExpertiseData("Renewable Energy", "Solar, wind, and hybrid energy systems research and development", Icons.Default.Info, Color(0xFFFF7AC6)),
    ExpertiseData("Digital Signal Processing", "Signal analysis, filtering techniques, and embedded systems applications", Icons.Default.Settings, Color(0xFF53F1E0)),
)

data class StatData(val label: String, val value: String, val icon: ImageVector, val tint: Color)

val facultyStats = listOf(
    StatData("Faculty Members", "4+", Icons.Default.People, Color(0xFF5EEAD4)),
    StatData("Years Experience", "50+", Icons.Default.School, Color(0xFFC4A8FF)),
    StatData("Research Projects", "25+", Icons.Default.MenuBook, Color(0xFF3DE8B0)),
    StatData("Publications", "100+", Icons.Default.Star, Color(0xFFE8954D)),
)

@Composable
fun TeamScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    val uriHandler = LocalUriHandler.current

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

                // Breadcrumb
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                            .clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF6E8699), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back", color = Color(0xFF6E8699), fontSize = 14.sp)
                    }
                }

                // Hero title
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            "Meet Our Expert Faculty Team",
                            color = Color.White,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center,
                            lineHeight = 42.sp
                        )
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "Meet the dedicated faculty and staff behind the EEE Learning Platform. Our team brings decades of experience in electrical engineering education and research.",
                            color = Color(0xFF94ACBA),
                            fontSize = 15.sp,
                            lineHeight = 24.sp,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Faculty cards
                items(facultyList.size) { index ->
                    FacultyCard(
                        faculty = facultyList[index],
                        onEmail = { uriHandler.openUri("mailto:${facultyList[index].email}") },
                        onLinkedIn = { uriHandler.openUri(facultyList[index].linkedin) },
                        onGithub = { uriHandler.openUri(facultyList[index].github) }
                    )
                    Spacer(Modifier.height(20.dp))
                }

                // Faculty Expertise section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                    ) {
                        Text("Faculty Expertise", color = Color(0xFF5EEAD4), fontSize = 26.sp, fontWeight = FontWeight.ExtraBold)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Our faculty members specialize in various domains of electrical engineering, bringing their expertise to the classroom and research.",
                            color = Color(0xFF94ACBA),
                            fontSize = 14.sp,
                            lineHeight = 22.sp
                        )
                        Spacer(Modifier.height(20.dp))
                        expertiseList.chunked(2).forEach { pair ->
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                pair.forEach { expertise ->
                                    ExpertiseCard(expertise = expertise, modifier = Modifier.weight(1f))
                                }
                                if (pair.size == 1) Spacer(Modifier.weight(1f))
                            }
                            Spacer(Modifier.height(12.dp))
                        }
                        Spacer(Modifier.height(16.dp))
                    }
                }

                // Faculty Achievements / Stats
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                    ) {
                        Text("Faculty Achievements", color = Color(0xFFC4A8FF), fontSize = 26.sp, fontWeight = FontWeight.ExtraBold)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Our team's collective accomplishments in research, teaching, and industry collaboration.",
                            color = Color(0xFF94ACBA),
                            fontSize = 14.sp,
                            lineHeight = 22.sp
                        )
                        Spacer(Modifier.height(20.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            facultyStats.take(2).forEach { stat ->
                                StatCard(stat = stat, modifier = Modifier.weight(1f))
                            }
                        }
                        Spacer(Modifier.height(12.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            facultyStats.drop(2).forEach { stat ->
                                StatCard(stat = stat, modifier = Modifier.weight(1f))
                            }
                        }
                        Spacer(Modifier.height(32.dp))
                    }
                }

                item { Footer(onNavigate) }
            }
        }

        if (isMenuOpen) {
            Box(
                modifier = Modifier.fillMaxSize().clickable(
                    interactionSource = remember { MutableInteractionSource() }, indication = null
                ) { isMenuOpen = false }
            ) {
                AnimatedVisibility(
                    visible = isMenuOpen,
                    enter = scaleIn(initialScale = 0.8f) + fadeIn(),
                    exit = scaleOut(targetScale = 0.8f) + fadeOut(),
                    modifier = Modifier.align(Alignment.TopEnd).padding(top = 75.dp, end = 16.dp)
                ) {
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "team",
                        onClose = { isMenuOpen = false },
                        onNavigate = { route -> onNavigate(route); isMenuOpen = false }
                    )
                }
            }
        }
    }
}

@Composable
fun FacultyCard(faculty: FacultyData, onEmail: () -> Unit, onLinkedIn: () -> Unit, onGithub: () -> Unit) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.9f),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF142233), RoundedCornerShape(20.dp))
    ) {
        Column {
            // Photo
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .background(Color(0xFF142233))
            ) {
                androidx.compose.foundation.Image(
                    painter = painterResource(id = faculty.drawableRes),
                    contentDescription = faculty.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Info
            Column(modifier = Modifier.padding(20.dp)) {
                Text(faculty.name, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(4.dp))
                Text(faculty.role, color = Color(0xFF5EEAD4), fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Text(faculty.department, color = Color(0xFF6E8699), fontSize = 12.sp)
                Spacer(Modifier.height(12.dp))
                Text(faculty.bio, color = Color(0xFF94ACBA), fontSize = 13.sp, lineHeight = 20.sp)
                Spacer(Modifier.height(16.dp))

                // Action buttons
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    SocialButton("Email", Color(0xFF142233), Color(0xFF5EEAD4)) { onEmail() }
                    SocialButton("LinkedIn", Color(0xFF153449), Color(0xFF5EEAD4)) { onLinkedIn() }
                    SocialButton("GitHub", Color(0xFF142233), Color(0xFF94ACBA)) { onGithub() }
                }
            }
        }
    }
}

@Composable
fun ExpertiseCard(expertise: ExpertiseData, modifier: Modifier = Modifier) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(16.dp),
        modifier = modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(expertise.icon, contentDescription = null, tint = expertise.tint, modifier = Modifier.size(28.dp))
            Spacer(Modifier.height(10.dp))
            Text(expertise.title, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(6.dp))
            Text(expertise.description, color = Color(0xFF6E8699), fontSize = 12.sp, lineHeight = 18.sp)
        }
    }
}

@Composable
fun StatCard(stat: StatData, modifier: Modifier = Modifier) {
    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(16.dp),
        modifier = modifier.border(1.dp, Color(0xFF142233), RoundedCornerShape(16.dp))
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(stat.icon, contentDescription = null, tint = stat.tint, modifier = Modifier.size(32.dp))
            Spacer(Modifier.height(8.dp))
            Text(stat.value, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
            Text(stat.label, color = Color(0xFF6E8699), fontSize = 12.sp, textAlign = TextAlign.Center)
        }
    }
}