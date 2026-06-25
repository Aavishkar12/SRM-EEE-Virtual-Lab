import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const resourcesCol = db.collection("academic_resources")
    const data = await resourcesCol.find().toArray()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch academic resources from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "academic_resources.json")
      const content = await fs.readFile(filePath, "utf-8")
      return NextResponse.json(JSON.parse(content))
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch academic resources" }, { status: 500 })
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
      return NextResponse.json({ error: "Database offline. Unable to save resource." }, { status: 503 })
    }

    const resourcesCol = db.collection("academic_resources")
    
    const maxIdItem = await resourcesCol.find().sort({ id: -1 }).limit(1).toArray()
    const maxId = maxIdItem.length > 0 ? maxIdItem[0].id : 0
    const newId = maxId + 1
    
    const newResource = {
      id: newId,
      title: body.title || "",
      description: body.description || "",
      icon: body.icon || "FileText",
      href: body.href || "/study-room",
      color: body.color || "bg-blue-500/8 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/40",
      tag: body.tag || "Explore",
    }

    await resourcesCol.insertOne(newResource)
    return NextResponse.json(newResource, { status: 201 })
  } catch (error) {
    console.error("Failed to insert academic resource in MongoDB:", error)
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
    const { id, ...updatedFields } = body
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for PUT:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to update resource." }, { status: 503 })
    }

    const resourcesCol = db.collection("academic_resources")
    
    const idNum = Number(id)
    const existing = await resourcesCol.findOne({ id: idNum })
    
    if (!existing) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    await resourcesCol.updateOne({ id: idNum }, { $set: updatedFields })
    const updatedItem = await resourcesCol.findOne({ id: idNum })
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Failed to update academic resource in MongoDB:", error)
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
      return NextResponse.json({ error: "Database offline. Unable to delete resource." }, { status: 503 })
    }

    const resourcesCol = db.collection("academic_resources")
    
    const idNum = Number(id)
    const result = await resourcesCol.deleteOne({ id: idNum })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Failed to delete academic resource in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
