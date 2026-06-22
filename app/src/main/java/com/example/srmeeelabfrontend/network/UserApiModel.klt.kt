package com.example.srmeeelabfrontend.network

data class UserApiModel(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val completedExperiments: List<Int> = emptyList(),
    val managedExperiments: List<Int> = emptyList()
)

data class UpdateUserRequest(
    val name: String,
    val email: String
)

data class ProgressApiModel(
    val id: String,
    val userId: String,
    val experimentId: Int,
    val completed: Boolean,
    val score: Int,
    val timeSpent: Int,
    val completedAt: String?
)

// Holds the logged-in user for the rest of the app (passed around screens).
// Carries the full Academia profile so screens don't need to re-fetch it.
data class UserSession(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val registrationNumber: String = "",
    val department: String = "",
    val branch: String = "",
    val year: String = "",
    val semester: String = "",
    val section: String = "",
    val batch: String = "",
    val mobile: String = "",
    val program: String = ""
)

// Request body for POST api/auth/academia
data class AcademiaLoginRequest(
    val email: String,
    val password: String
)

// Response body from POST api/auth/academia
data class AcademiaProfile(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val registrationNumber: String = "",
    val department: String = "",
    val branch: String = "",
    val year: String = "",
    val semester: String = "",
    val section: String = "",
    val batch: String = "",
    val mobile: String = "",
    val program: String = ""
)