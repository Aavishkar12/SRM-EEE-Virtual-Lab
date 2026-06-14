package com.example.srmeeelabfrontend

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
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

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(onLoginSuccess = {
                navController.navigate("home") {
                    popUpTo("login") { inclusive = true }
                }
            })
        }
        composable("home") {
            HomeScreen(onExploreExperiments = {
                navController.navigate("experiments")
            }, onNavigate = { route ->
                navController.navigate(route)
            })
        }
        composable("experiments") {
            ExperimentsScreen(
                onBack = { navController.popBackStack() },
                onNavigate = { route ->
                    navController.navigate(route)
                }
            )
        }
        composable("study") {
            StudyRoomScreen(
                onNavigate = { route ->
                    navController.navigate(route)
                }
            )
        }
    }
}
