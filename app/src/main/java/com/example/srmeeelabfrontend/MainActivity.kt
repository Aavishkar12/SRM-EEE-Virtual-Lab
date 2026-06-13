package com.example.srmeeelabfrontend

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.srmeeelabfrontend.ui.theme.SrmEEELabFrontendTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SrmEEELabFrontendTheme(darkTheme = true, dynamicColor = false) {
                LoginScreen()
            }
        }
    }
}
