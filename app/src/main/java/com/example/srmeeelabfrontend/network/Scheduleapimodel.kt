package com.example.srmeeelabfrontend.network

data class QuizQuestionApiModel(
    val id: Int,
    val question: String,
    val options: List<String>,
    val correctAnswer: Int,
    val explanation: String
)

data class QuizApiModel(
    val id: Int,
    val title: String,
    val description: String,
    val difficulty: String,
    val color: String,
    val icon: String,
    val questions: List<QuizQuestionApiModel>
)