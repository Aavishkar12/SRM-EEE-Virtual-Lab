package com.example.srmeeelabfrontend.network

data class ExperimentApiModel(
    val id: Int,
    val title: String,
    val description: String,
    val category: String,
    val difficulty: String,
    val duration: String,
    val embedId: String?,
    val aim: String?,
    val apparatus: String?,
    val theory: String?,
    val procedure: String?,
    val references: String?,
    val image: String?
)