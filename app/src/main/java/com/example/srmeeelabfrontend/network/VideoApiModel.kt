package com.example.srmeeelabfrontend.network

data class VideoApiModel(
    val id: Int,
    val expNumber: String,
    val title: String,
    val duration: String,
    val views: String,
    val thumbnail: String,
    val url: String
)