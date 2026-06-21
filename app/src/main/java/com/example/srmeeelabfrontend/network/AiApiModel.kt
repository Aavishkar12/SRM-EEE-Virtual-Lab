package com.example.srmeeelabfrontend.network

data class AiChatRequest(
    val messages: List<ChatMessage>
)

data class ChatMessage(
    val role: String,   // "user" or "assistant"
    val content: String
)

data class AiChatResponse(
    val reply: String
)