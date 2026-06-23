package com.example.srmeeelabfrontend.data

import android.content.Context
import android.content.SharedPreferences
import com.example.srmeeelabfrontend.network.UserSession
import com.google.gson.Gson

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("user_session_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveSession(session: UserSession) {
        val json = gson.toJson(session)
        prefs.edit().putString("key_user_session", json).apply()
    }

    fun getSession(): UserSession? {
        val json = prefs.getString("key_user_session", null) ?: return null
        return try {
            gson.fromJson(json, UserSession::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun clearSession() {
        prefs.edit().remove("key_user_session").apply()
    }

    fun isLoggedIn(): Boolean {
        return prefs.contains("key_user_session")
    }
}
