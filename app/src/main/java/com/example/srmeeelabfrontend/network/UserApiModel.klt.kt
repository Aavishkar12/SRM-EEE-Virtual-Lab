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

data class UserSession(
    val id: String,
    val name: String,
    val email: String,
    val role: String
)