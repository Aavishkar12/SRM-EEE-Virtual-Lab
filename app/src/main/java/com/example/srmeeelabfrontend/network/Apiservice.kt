package com.example.srmeeelabfrontend.network

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path


interface ApiService {

    @GET("api/experiments")
    suspend fun getExperiments(): Response<List<ExperimentApiModel>>

    @GET("api/quizzes")
    suspend fun getQuizzes(): Response<List<QuizApiModel>>

    @GET("api/users")
    suspend fun getUsers(): Response<List<Map<String, Any>>>

    @GET("api/experiments/{id}")
    suspend fun getExperimentById(
        @Path("id") id: Int
    ): Response<ExperimentApiModel>
}