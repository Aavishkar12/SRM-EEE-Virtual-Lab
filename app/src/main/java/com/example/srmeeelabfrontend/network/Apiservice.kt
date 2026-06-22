package com.example.srmeeelabfrontend.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    @GET("api/experiments")
    suspend fun getExperiments(): Response<List<ExperimentApiModel>>

    @GET("api/quizzes")
    suspend fun getQuizzes(): Response<List<QuizApiModel>>

    @GET("api/users")
    suspend fun getUsers(): Response<List<Map<String, Any>>>

    @GET("api/users/{id}")
    suspend fun getUser(
        @Path("id") id: String
    ): Response<UserApiModel>

    @PUT("api/users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body request: UpdateUserRequest
    ): Response<UserApiModel>

    @GET("api/progress")
    suspend fun getProgress(
        @Query("userId") userId: String
    ): Response<List<ProgressApiModel>>

    @GET("api/experiments/{id}")
    suspend fun getExperimentById(
        @Path("id") id: Int
    ): Response<ExperimentApiModel>

    @GET("api/quizzes")
    suspend fun getQuizById(
        @Query("id") id: Int
    ): Response<QuizApiModel>

    @POST("api/ai/chat")
    suspend fun sendAiMessage(@Body request: AiChatRequest): AiChatResponse

    @GET("api/pyqs")
    suspend fun getPyqs(): Response<List<PyqApiModel>>

    @GET("api/study-room/manual")
    suspend fun getManualChapters(): Response<List<ManualApiModel>>

    @GET("api/study-room/formulas")
    suspend fun getFormulas(): Response<List<FormulaApiModel>>

    @GET("api/study-room/schedules")
    suspend fun getSchedules(): Response<List<ScheduleApiModel>>

    @GET("api/study-room/notes")
    suspend fun getNotes(): Response<List<NoteApiModel>>

    @GET("api/study-room/videos")
    suspend fun getVideos(): Response<List<VideoApiModel>>

    @GET("api/study-room/books")
    suspend fun getBooks(): Response<List<BookApiModel>>
}