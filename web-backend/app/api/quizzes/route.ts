import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idStr = searchParams.get("id")

  try {
    const { db } = await connectToDatabase()
    const quizzesCol = db.collection("quizzes")
    
    if (idStr) {
      const idNum = Number(idStr)
      const quiz = await quizzesCol.findOne({ id: idNum })
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
      }
      return NextResponse.json(quiz)
    } else {
      const quizzes = await quizzesCol.find().toArray()
      // Deduplicate by numeric id — keep the last occurrence (most recent)
      const seen = new Map<number, any>()
      for (const q of quizzes) seen.set(Number(q.id), q)
      return NextResponse.json(Array.from(seen.values()))
    }
  } catch (error) {
    console.error("Failed to fetch quizzes from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "quizzes.json")
      const content = await fs.readFile(filePath, "utf-8")
      const quizzes = JSON.parse(content)

      if (idStr) {
        const idNum = Number(idStr)
        const quiz = quizzes.find((q: any) => q.id === idNum)
        if (!quiz) {
          return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
        }
        return NextResponse.json(quiz)
      }

      // Deduplicate fallback JSON by id as well
      const seen = new Map<number, any>()
      for (const q of quizzes) seen.set(Number(q.id), q)
      return NextResponse.json(Array.from(seen.values()))
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch quizzes data" }, { status: 500 })
    }
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  try {
    const body = await request.json()
    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for POST quizzes:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to save quiz." }, { status: 503 })
    }

    const quizzesCol = db.collection("quizzes")
    
    // Find the max ID
    const maxIdItem = await quizzesCol.find().sort({ id: -1 }).limit(1).toArray()
    const maxId = maxIdItem.length > 0 ? maxIdItem[0].id : 0
    const newId = maxId + 1

    const newQuiz = {
      id: newId,
      title: body.title || "New Quiz",
      description: body.description || "",
      difficulty: body.difficulty || "Beginner",
      color: body.color || "blue",
      icon: body.icon || "Zap",
      questions: body.questions || [
        {
          id: 1,
          question: "Sample Question?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "Explanation goes here."
        }
      ]
    }

    await quizzesCol.insertOne(newQuiz)
    return NextResponse.json(newQuiz, { status: 201 })
  } catch (error) {
    console.error("Failed to insert quiz in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, _id: _mongoId, ...updatedFields } = body
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for PUT quizzes:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to update quiz." }, { status: 503 })
    }

    const quizzesCol = db.collection("quizzes")
    const idNum = Number(id)
    const existing = await quizzesCol.findOne({ id: idNum })

    if (!existing) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    await quizzesCol.updateOne({ id: idNum }, { $set: updatedFields })
    const updatedQuiz = await quizzesCol.findOne({ id: idNum })
    return NextResponse.json(updatedQuiz)
  } catch (error) {
    console.error("Failed to update quiz in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for DELETE quizzes:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to delete quiz." }, { status: 503 })
    }

    const quizzesCol = db.collection("quizzes")
    const idNum = Number(id)
    const result = await quizzesCol.deleteOne({ id: idNum })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Quiz deleted successfully" })
  } catch (error) {
    console.error("Failed to delete quiz in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
