package com.example.srmeeelabfrontend

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.srmeeelabfrontend.network.RetrofitClient
import com.example.srmeeelabfrontend.ui.theme.SrmEEELabFrontendTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            SrmEEELabFrontendTheme(
                darkTheme = true,
                dynamicColor = false
            ) {
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

    // TEMPORARY API TEST
    LaunchedEffect(Unit) {
        try {
            val response = withContext(Dispatchers.IO) {
                RetrofitClient.apiService.getExperiments()
            }

            println("API_TEST Success = ${response.isSuccessful}")
            println("API_TEST Body = ${response.body()}")
        } catch (e: Exception) {
            Log.e("API_TEST", "Error", e)
        }
    }

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {

        composable("login") {
            LoginScreen(
                onLoginSuccess = {
                    isLoggedIn = true

                    navController.navigate("home") {
                        popUpTo("home") {
                            inclusive = true
                        }
                    }
                }
            )
        }

        val navigateHandler: (String) -> Unit = { route ->

            if (route == "logout") {

                isLoggedIn = false

                navController.navigate("login") {
                    popUpTo(0)
                }

            } else {

                navController.navigate(route)

            }
        }

        composable("home") {
            HomeScreen(
                isLoggedIn = isLoggedIn,
                onExploreExperiments = {
                    navController.navigate("experiments")
                },
                onNavigate = navigateHandler
            )
        }

        composable("experiments") {
            ExperimentsScreen(
                isLoggedIn = isLoggedIn,
                onBack = {
                    navController.popBackStack()
                },
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

        composable(
            route = "experiment_detail/{id}",
            arguments = listOf(navArgument("id") { type = NavType.IntType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getInt("id") ?: 1
            ExperimentDetailScreen(
                experimentId = id,
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("ai_assistant") {
            AiAssistantScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable(
            route = "quiz_attempt/{id}",
            arguments = listOf(navArgument("id") { type = NavType.IntType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getInt("id") ?: 1
            QuizAttemptScreen(
                quizId = id,
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }
    }
}
