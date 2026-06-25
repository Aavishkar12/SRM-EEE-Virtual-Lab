import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const experimentsCol = db.collection("experiments")
    const data = await experimentsCol.find().sort({ id: 1 }).toArray()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch experiments from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "experiments.json")
      const content = await fs.readFile(filePath, "utf-8")
      return NextResponse.json(JSON.parse(content))
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch experiments" }, { status: 500 })
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

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for POST experiments:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to save experiment." }, { status: 503 })
    }

    const experimentsCol = db.collection("experiments")
    const maxIdItem = await experimentsCol.find().sort({ id: -1 }).limit(1).toArray()
    const maxId = maxIdItem.length > 0 ? maxIdItem[0].id : 0
    const newId = maxId + 1

    const newExperiment = {
      id: newId,
      title: body.title || "",
      description: body.description || "",
      category: body.category || "Circuit Analysis",
      difficulty: body.difficulty || "Beginner",
      duration: body.duration || "60 min",
      embedId: body.embedId || "",
      aim: body.aim || "",
      apparatus: body.apparatus || "",
      theory: body.theory || "",
      procedure: body.procedure || "",
      references: body.references || "",
      image: body.image || "/placeholder.svg?height=400&width=600",
    }

    await experimentsCol.insertOne(newExperiment)
    return NextResponse.json(newExperiment, { status: 201 })
  } catch (error) {
    console.error("Failed to insert experiment in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
