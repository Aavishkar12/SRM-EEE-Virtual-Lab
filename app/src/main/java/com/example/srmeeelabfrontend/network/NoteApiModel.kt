package com.example.srmeeelabfrontend.network

data class NoteApiModel(
    val id: Int,
    val unit: String,
    val title: String,
    val type: String,
    val size: String,
    val date: String,
    val url: String
)