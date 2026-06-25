import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const idNum = Number(id)

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()
    const experimentsCol = db.collection("experiments")
    const experiment = await experimentsCol.findOne({ id: idNum })

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error("Failed to fetch experiment from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "experiments.json")
      const content = await fs.readFile(filePath, "utf-8")
      const experiments = JSON.parse(content)
      const experiment = experiments.find((e: any) => e.id === idNum)

      if (!experiment) {
        return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
      }

      return NextResponse.json(experiment)
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch experiment" }, { status: 500 })
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  const { id } = await params
  const idNum = Number(id)

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    // Strip both numeric `id` and MongoDB `_id` so neither lands in $set
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _numId, _id: _mongoId, ...updatedFields } = body

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for PUT experiment:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to update experiment." }, { status: 503 })
    }

    const experimentsCol = db.collection("experiments")
    const existing = await experimentsCol.findOne({ id: idNum })

    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    await experimentsCol.updateOne({ id: idNum }, { $set: updatedFields })
    const updated = await experimentsCol.findOne({ id: idNum })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update experiment in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  const { id } = await params
  const idNum = Number(id)

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for DELETE experiment:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to delete experiment." }, { status: 503 })
    }

    const experimentsCol = db.collection("experiments")
    const result = await experimentsCol.deleteOne({ id: idNum })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Experiment deleted successfully" })
  } catch (error) {
    console.error("Failed to delete experiment from MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
