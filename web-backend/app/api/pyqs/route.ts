import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const pyqsCol = db.collection("pyqs")
    const data = await pyqsCol.find().sort({ id: -1 }).toArray()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch PYQs from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "pyqs.json")
      const content = await fs.readFile(filePath, "utf-8")
      const data = JSON.parse(content)
      // Sort by id descending for standard ordering compatibility
      if (Array.isArray(data)) {
        data.sort((a, b) => (b.id || 0) - (a.id || 0))
      }
      return NextResponse.json(data)
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch question papers" }, { status: 500 })
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
      console.error("Database connection failed for POST:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to save question paper." }, { status: 503 })
    }

    const pyqsCol = db.collection("pyqs")
    
    // Find the max ID
    const maxIdItem = await pyqsCol.find().sort({ id: -1 }).limit(1).toArray()
    const maxId = maxIdItem.length > 0 ? maxIdItem[0].id : 0
    const newId = maxId + 1

    const randomSize = `${(Math.random() * 3.5 + 1).toFixed(1)} MB`
    const newPyq = {
      id: newId,
      year: body.year || "",
      semester: body.semester || "",
      type: body.type || "",
      subject: body.subject || "Basic Electrical Engineering",
      unit: body.unit || "",
      size: body.size || randomSize,
      date: body.date || "",
      fileUrl: body.fileUrl || "",
    }

    await pyqsCol.insertOne(newPyq)
    return NextResponse.json(newPyq, { status: 201 })
  } catch (error) {
    console.error("Failed to insert PYQ in MongoDB:", error)
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
      console.error("Database connection failed for PUT:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to update question paper." }, { status: 503 })
    }

    const pyqsCol = db.collection("pyqs")
    
    const idNum = Number(id)
    const existing = await pyqsCol.findOne({ id: idNum })
    if (!existing) {
      return NextResponse.json({ error: "PYQ not found" }, { status: 404 })
    }

    await pyqsCol.updateOne({ id: idNum }, { $set: updatedFields })
    const updatedItem = await pyqsCol.findOne({ id: idNum })
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Failed to update PYQ in MongoDB:", error)
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
      console.error("Database connection failed for DELETE:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to delete question paper." }, { status: 503 })
    }

    const pyqsCol = db.collection("pyqs")
    
    const idNum = Number(id)
    const result = await pyqsCol.deleteOne({ id: idNum })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "PYQ not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "PYQ deleted successfully" })
  } catch (error) {
    console.error("Failed to delete PYQ in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
