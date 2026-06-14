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
        
        val navigateHandler: (String) -> Unit = { route ->
            if (route == "logout") {
                isLoggedIn = false
                navController.navigate("login") {
                    popUpTo(0) // Clear backstack
                }
            } else {
                navController.navigate(route)
            }
        }

        composable("home") {
            HomeScreen(
                isLoggedIn = isLoggedIn,
                onExploreExperiments = { navController.navigate("experiments") },
                onNavigate = navigateHandler
            )
        }
        composable("experiments") {
            ExperimentsScreen(
                isLoggedIn = isLoggedIn,
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }
        composable("study") {
            StudyRoomScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
        composable("quizzes") {
            QuizScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
        composable("team") {
            TeamScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
        composable("about") {
            AboutScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
        composable("profile") {
            ProfileScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
        composable("settings") {
            SettingsScreen(
                isLoggedIn = isLoggedIn,
                onNavigate = navigateHandler
            )
        }
    }
}
