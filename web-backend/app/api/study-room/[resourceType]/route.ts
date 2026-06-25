import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

const ALLOWED_RESOURCES = ["books", "notes", "videos", "manual", "schedules", "formulas"]

const COLLECTION_MAP: Record<string, string> = {
  books: "books",
  notes: "notes",
  videos: "videos",
  manual: "manuals",
  schedules: "schedules",
  formulas: "formulas",
}

const FILE_MAP: Record<string, string> = {
  books: "books.json",
  notes: "notes.json",
  videos: "videos.json",
  manual: "manual.json",
  schedules: "schedules.json",
  formulas: "formulas.json",
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resourceType: string }> }
) {
  const { resourceType } = await params

  if (!ALLOWED_RESOURCES.includes(resourceType)) {
    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()
    const colName = COLLECTION_MAP[resourceType]
    const collection = db.collection(colName)
    const data = await collection.find().toArray()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Failed to fetch ${resourceType} from MongoDB, trying fallback JSON:`, error)
    try {
      const fileName = FILE_MAP[resourceType]
      const filePath = path.join(process.cwd(), "lib", "data", fileName)
      const content = await fs.readFile(filePath, "utf-8")
      return NextResponse.json(JSON.parse(content))
    } catch (fallbackError) {
      return NextResponse.json({ error: `Failed to fetch ${resourceType} data` }, { status: 500 })
    }
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resourceType: string }> }
) {
  const { resourceType } = await params

  if (!ALLOWED_RESOURCES.includes(resourceType)) {
    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 })
  }

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
      console.error(`Database connection failed for POST on ${resourceType}:`, dbError)
      return NextResponse.json({ error: `Database offline. Unable to save ${resourceType}.` }, { status: 503 })
    }

    const colName = COLLECTION_MAP[resourceType]
    const collection = db.collection(colName)

    // Calculate new ID
    const maxIdItem = await collection.find().sort({ id: -1 }).limit(1).toArray()
    const maxId = maxIdItem.length > 0 ? maxIdItem[0].id : 0
    const newId = maxId + 1

    const newItem: any = { id: newId, ...body }

    // If size is empty but resource type typically has size, auto-mock it
    if ((resourceType === "books" || resourceType === "notes" || resourceType === "manual") && !newItem.size) {
      newItem.size = `${(Math.random() * 4 + 1).toFixed(1)} MB`
    }

    await collection.insertOne(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error(`Failed to insert ${resourceType} in MongoDB:`, error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ resourceType: string }> }
) {
  const { resourceType } = await params

  if (!ALLOWED_RESOURCES.includes(resourceType)) {
    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 })
  }

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
      console.error(`Database connection failed for PUT on ${resourceType}:`, dbError)
      return NextResponse.json({ error: `Database offline. Unable to update ${resourceType}.` }, { status: 503 })
    }

    const colName = COLLECTION_MAP[resourceType]
    const collection = db.collection(colName)

    const idNum = Number(id)
    const existing = await collection.findOne({ id: idNum })

    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await collection.updateOne({ id: idNum }, { $set: updatedFields })
    const updatedItem = await collection.findOne({ id: idNum })
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error(`Failed to update ${resourceType} in MongoDB:`, error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resourceType: string }> }
) {
  const { resourceType } = await params

  if (!ALLOWED_RESOURCES.includes(resourceType)) {
    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 })
  }

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
      console.error(`Database connection failed for DELETE on ${resourceType}:`, dbError)
      return NextResponse.json({ error: `Database offline. Unable to delete ${resourceType}.` }, { status: 503 })
    }

    const colName = COLLECTION_MAP[resourceType]
    const collection = db.collection(colName)

    const idNum = Number(id)
    const result = await collection.deleteOne({ id: idNum })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error(`Failed to delete ${resourceType} from MongoDB:`, error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
