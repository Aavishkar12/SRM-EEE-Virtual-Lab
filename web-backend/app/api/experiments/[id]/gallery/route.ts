import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB_TIMEOUT")), ms)
    ),
  ])
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const experimentId = parseInt(id)
    if (isNaN(experimentId)) return NextResponse.json([])
    // 3-second hard timeout so the gallery tab never hangs for 30s
    const { db } = await withTimeout(connectToDatabase(), 3000)
    const col = db.collection("experiment_gallery")
    const items = await col.find({ experimentId }).sort({ createdAt: 1 }).toArray()
    return NextResponse.json(items.map((item) => ({ ...item, _id: item._id.toString() })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const experimentId = parseInt(id)
    if (isNaN(experimentId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    const body = await request.json()
    const { name, imageUrl } = body
    if (!name?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: "name and imageUrl are required" }, { status: 400 })
    }
    const { db } = await withTimeout(connectToDatabase(), 5000)
    const col = db.collection("experiment_gallery")
    const result = await col.insertOne({
      experimentId,
      name: name.trim(),
      imageUrl: imageUrl.trim(),
      createdAt: new Date(),
    })
    return NextResponse.json(
      { _id: result.insertedId.toString(), experimentId, name: name.trim(), imageUrl: imageUrl.trim() },
      { status: 201 }
    )
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
