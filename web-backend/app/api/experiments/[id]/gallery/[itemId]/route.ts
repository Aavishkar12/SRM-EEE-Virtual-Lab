import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

async function getCollection() {
  const { db } = await connectToDatabase()
  return db.collection("experiment_gallery")
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth()
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { itemId } = await params
    const col = await getCollection()
    const result = await col.deleteOne({ _id: new ObjectId(itemId) })
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth()
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { itemId } = await params
    const body = await request.json()
    const { name, imageUrl } = body
    const col = await getCollection()
    const update: Record<string, string> = {}
    if (name?.trim()) update.name = name.trim()
    if (imageUrl?.trim()) update.imageUrl = imageUrl.trim()
    await col.updateOne({ _id: new ObjectId(itemId) }, { $set: update })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
