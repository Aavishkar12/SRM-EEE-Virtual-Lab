package com.example.srmeeelabfrontend.network

data class ExperimentApiModel(
    val id: Int,
    val title: String,
    val description: String,
    val category: String,
    val difficulty: String,
    val duration: String
)