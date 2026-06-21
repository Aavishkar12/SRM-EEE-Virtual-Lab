package com.example.srmeeelabfrontend.network

data class ScheduleApiModel(
    val id: Int,
    val title: String,
    val date: String,
    val time: String,
    val syllabus: String,
    val status: String,
    val type: String
)