package com.example.srmeeelabfrontend.network

data class BookApiModel(
    val id: Int,
    val title: String,
    val author: String,
    val edition: String,
    val type: String,
    val size: String,
    val color: String? = null,
    val url: String? = null
)