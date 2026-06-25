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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.srmeeelabfrontend.network.RetrofitClient
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ReferencesScreen(onBack: () -> Unit, onNavigate: (String) -> Unit) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())) }
    var isMenuOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }

    // --- API state ---
    var books by remember { mutableStateOf<List<BookData>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

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

    // Fetch reference books from the backend
    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getBooks()
            if (response.isSuccessful) {
                books = (response.body() ?: emptyList()).map { b ->
                    BookData(
                        title = b.title,
                        author = b.author,
                        edition = b.edition,
                        size = b.size,
                        type = b.type,
                        url = b.url ?: ""
                    )
                }
            } else {
                errorMessage = "Couldn't load reference books (code ${response.code()})"
            }
        } catch (e: Exception) {
            errorMessage = e.localizedMessage ?: "Couldn't reach the server"
        } finally {
            isLoading = false
        }
    }

    val filteredBooks = remember(books, searchQuery) {
        if (searchQuery.isBlank()) {
            books
        } else {
            books.filter {
                it.title.contains(searchQuery, ignoreCase = true) ||
                        it.author.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF05080D))) {
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

                // Breadcrumb
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp)
                            .clickable { onBack() },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFFC97A1F).copy(alpha = 0.7f), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Back to Study Room", color = Color(0xFFC97A1F).copy(alpha = 0.7f), fontSize = 14.sp)
                    }
                }

                // Title Section
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 8.dp)
                    ) {
                        Text(
                            "Digital Library",
                            color = Color(0xFFD9842E),
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            lineHeight = 44.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Access recommended textbooks and reference materials for your coursework. Read online or download for offline studying.",
                            color = Color(0xFF94ACBA),
                            fontSize = 16.sp,
                            lineHeight = 24.sp
                        )

                        Spacer(Modifier.height(32.dp))

                        // Search Bar
                        Surface(
                            color = Color(0xFF0A131F).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF142233), RoundedCornerShape(12.dp))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF3D5468), modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(12.dp))
                                BasicTextField(
                                    value = searchQuery,
                                    onValueChange = { searchQuery = it },
                                    textStyle = TextStyle(color = Color.White, fontSize = 15.sp),
                                    cursorBrush = SolidColor(Color(0xFFC97A1F)),
                                    modifier = Modifier.weight(1f),
                                    decorationBox = { innerTextField ->
                                        if (searchQuery.isEmpty()) {
                                            Text("Search title or author...", color = Color(0xFF3D5468), fontSize = 15.sp)
                                        }
                                        innerTextField()
                                    }
                                )
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        // User Info Card
                        Surface(
                            color = Color(0xFF0D1318).copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color(0xFF1A2533).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        ) {
                            Text(
                                text = buildAnnotatedString {
                                    append("Signed in as ")
                                    withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                                        append("as9261@srmist.edu.in")
                                    }
                                    append(". You can read and download reference materials, but only admins can manage them.")
                                },
                                color = Color(0xFF7A8C99),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(16.dp),
                                lineHeight = 20.sp
                            )
                        }

                        Spacer(Modifier.height(32.dp))
                    }
                }

                // Books List (loading / error / empty / data)
                when {
                    isLoading -> item {
                        Box(modifier = Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = Color(0xFFC97A1F))
                        }
                    }
                    errorMessage != null -> item {
                        Text(
                            errorMessage ?: "Something went wrong",
                            color = Color(0xFFFF6B6B),
                            fontSize = 14.sp,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 24.dp)
                        )
                    }
                    filteredBooks.isEmpty() -> item {
                        Text(
                            if (searchQuery.isBlank()) "No reference books added yet." else "No books match \"$searchQuery\".",
                            color = Color(0xFF6E8699),
                            fontSize = 14.sp,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 24.dp)
                        )
                    }
                    else -> items(filteredBooks) { book ->
                        BookCard(book)
                        Spacer(Modifier.height(24.dp))
                    }
                }

                item { Footer(onNavigate) }
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
                    HamburgerMenu(
                        isLoggedIn = true,
                        currentRoute = "references",
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
fun BookCard(book: BookData) {
    val uriHandler = LocalUriHandler.current

    Surface(
        color = Color(0xFF0A131F).copy(alpha = 0.85f),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .border(1.dp, Color(0xFF142233), RoundedCornerShape(24.dp))
    ) {
        Column {
            // Book Thumbnail area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color(0xFFC2620E), Color(0xFF54200D))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.Book, contentDescription = null, tint = Color.White.copy(alpha = 0.8f), modifier = Modifier.size(64.dp))
                    Spacer(Modifier.height(16.dp))
                    Text(
                        book.title,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.ExtraBold,
                        modifier = Modifier.padding(horizontal = 24.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(24.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = Color(0xFFC97A1F).copy(alpha = 0.1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(book.type, color = Color(0xFFC97A1F), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                    }
                    Spacer(Modifier.weight(1f))
                    Text(book.size, color = Color(0xFF3D5468), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }

                Spacer(Modifier.height(16.dp))
                Text(book.title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("By ${book.author}", color = Color(0xFF94ACBA), fontSize = 15.sp, modifier = Modifier.padding(top = 4.dp))
                Text(book.edition, color = Color(0xFF6E8699), fontSize = 14.sp, modifier = Modifier.padding(top = 4.dp))

                Spacer(Modifier.height(24.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = { if (book.url.isNotBlank()) uriHandler.openUri(book.url) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D1318)),
                        shape = RoundedCornerShape(12.dp),
                        border = borderStroke(1.dp, Color(0xFF1A2533))
                    ) {
                        Icon(Icons.Default.Visibility, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Read", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                    Button(
                        onClick = { if (book.url.isNotBlank()) uriHandler.openUri(book.url) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3D2412)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.FileDownload, contentDescription = null, tint = Color(0xFFF6C28B), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("PDF", color = Color(0xFFF6C28B), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun borderStroke(width: androidx.compose.ui.unit.Dp, color: Color) = androidx.compose.foundation.BorderStroke(width, color)

data class BookData(
    val title: String,
    val author: String,
    val edition: String,
    val size: String,
    val type: String = "Reference Book",
    val url: String = ""
)