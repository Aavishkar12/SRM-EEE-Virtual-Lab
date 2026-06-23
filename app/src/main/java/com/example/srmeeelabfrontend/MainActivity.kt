package com.example.srmeeelabfrontend

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.srmeeelabfrontend.network.UserSession
import com.example.srmeeelabfrontend.ui.theme.SrmEEELabFrontendTheme
import androidx.compose.ui.platform.LocalContext
import com.example.srmeeelabfrontend.data.SessionManager

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }

    var userSession by remember { mutableStateOf(sessionManager.getSession()) }
    val isLoggedIn = userSession != null

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {

        composable("login") {
            LoginScreen(
                onLoginSuccess = { session ->
                    sessionManager.saveSession(session)
                    userSession = session
                    navController.navigate("home") {
                        popUpTo("home") { inclusive = true }
                    }
                }
            )
        }

        val navigateHandler: (String) -> Unit = { route ->
            if (route == "logout") {
                sessionManager.clearSession()
                userSession = null
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
                onBack = { navController.popBackStack() },
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
                userSession = userSession,
                onNavigate = navigateHandler
            )
        }

        composable("settings") {
            SettingsScreen(
                userSession = userSession,
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

        composable("pyq") {
            PyqScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("ct") {
            CtScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("lecturenotes") {
            LectureNotesScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("references") {
            ReferencesScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("components") {
            ComponentsScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("tutorials") {
            TutorialsScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("formula") {
            FormulaScreen(
                userSession = userSession,
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("labmanual") {
            LabManualScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }

        composable("developers") {
            DevelopersScreen(
                onBack = { navController.popBackStack() },
                onNavigate = navigateHandler
            )
        }
    }
}