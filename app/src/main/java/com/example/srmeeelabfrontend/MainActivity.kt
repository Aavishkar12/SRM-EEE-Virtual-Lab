package com.example.srmeeelabfrontend

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.srmeeelabfrontend.ui.theme.SrmEEELabFrontendTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SrmEEELabFrontendTheme(darkTheme = true, dynamicColor = false) {
                AppNavigation()
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    // Global Auth State
    var isLoggedIn by remember { mutableStateOf(false) }

    NavHost(navController = navController, startDestination = "home") {
        composable("login") {
            LoginScreen(onLoginSuccess = {
                isLoggedIn = true
                navController.navigate("home") {
                    popUpTo("home") { inclusive = true }
                }
            })
        }
        composable("home") {
            HomeScreen(
                isLoggedIn = isLoggedIn,
                onExploreExperiments = { navController.navigate("experiments") },
                onNavigate = { route ->
                    if (route == "logout") {
                        isLoggedIn = false
                        navController.navigate("login")
                    } else {
                        navController.navigate(route)
                    }
                }
            )
        }
        composable("experiments") {
            ExperimentsScreen(
                isLoggedIn = isLoggedIn,
                onBack = { navController.popBackStack() },
                onNavigate = { route ->
                    if (route == "logout") {
                        isLoggedIn = false
                        navController.navigate("login")
                    } else {
                        navController.navigate(route)
                    }
                }
            )
        }
        composable("study") {
            StudyRoomScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = { route ->
                    if (route == "logout") {
                        isLoggedIn = false
                        navController.navigate("login")
                    } else {
                        navController.navigate(route)
                    }
                }
            )
        }
        composable("quizzes") {
            QuizScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = { route ->
                    if (route == "logout") {
                        isLoggedIn = false
                        navController.navigate("login")
                    } else {
                        navController.navigate(route)
                    }
                }
            )
        }
        composable("team") {
            TeamScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = { route ->
                    if (route == "logout") {
                        isLoggedIn = false
                        navController.navigate("login")
                    } else {
                        navController.navigate(route)
                    }
                }
            )
        }
    }
}
