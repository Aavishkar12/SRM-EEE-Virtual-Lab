import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import fs from "fs/promises"
import path from "path"

const SEED_COLLECTIONS = [
  { name: "experiments", file: "experiments.json" },
  { name: "quizzes", file: "quizzes.json" },
  { name: "books", file: "books.json" },
  { name: "notes", file: "notes.json" },
  { name: "videos", file: "videos.json" },
  { name: "manuals", file: "manual.json" },
  { name: "formulas", file: "formulas.json" },
  { name: "schedules", file: "schedules.json" },
  { name: "pyqs", file: "pyqs.json" },
  { name: "academic_resources", file: "academic_resources.json" },
]

export async function POST(request: Request) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const force = searchParams.get("force") === "true"

  const results: Record<string, string> = {}

  let db
  try {
    const connection = await connectToDatabase()
    db = connection.db
  } catch (dbError) {
    return NextResponse.json({ error: "Database offline. Cannot seed." }, { status: 503 })
  }

  for (const col of SEED_COLLECTIONS) {
    try {
      const collection = db.collection(col.name)
      const count = await collection.countDocuments()

      if (count > 0 && !force) {
        results[col.name] = `skipped (${count} documents already exist)`
        continue
      }

      const filePath = path.join(process.cwd(), "lib", "data", col.file)
      let content: string
      try {
        content = await fs.readFile(filePath, "utf-8")
      } catch {
        results[col.name] = `skipped (data file not found: ${col.file})`
        continue
      }

      const parsed = JSON.parse(content)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        results[col.name] = "skipped (empty or invalid data file)"
        continue
      }

      if (force && count > 0) {
        await collection.deleteMany({})
      }

      let documents = parsed
      if (col.name === "admins" && typeof parsed[0] === "string") {
        documents = parsed.map((email: string) => ({ email: String(email).trim().toLowerCase() }))
      }

      await collection.insertMany(documents)
      results[col.name] = `seeded ${documents.length} documents`
    } catch (err: any) {
      results[col.name] = `error: ${err.message}`
    }
  }

  return NextResponse.json({ message: "Seed completed", results })
}

// PATCH — non-destructive patch: updates specific fields on existing docs
// Currently handles: action=update-videos (adds videoUrl to all experiments)
//                    action=init-gallery  (creates experiment_gallery index)
export async function PATCH(request: Request) {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "update-videos"

  let db
  try {
    const connection = await connectToDatabase()
    db = connection.db
  } catch {
    return NextResponse.json({ error: "Database offline." }, { status: 503 })
  }

  if (action === "update-videos" || action === "all") {
    const videoUrls: Record<number, string> = {
      1:  "https://www.youtube.com/embed/jdgr56G6bIs",
      2:  "https://www.youtube.com/embed/QJQS_5wYDGw",
      3:  "https://www.youtube.com/embed/3RL0dDghkYw",
      4:  "https://www.youtube.com/embed/sI_7GkbcKBo",
      5:  "https://www.youtube.com/embed/nkxgGg3PCGE",
      6:  "https://www.youtube.com/embed/kqeqTJnEp1g",
      7:  "https://www.youtube.com/embed/9EL2XTCFqaE",
      8:  "https://www.youtube.com/embed/W7B0DIsBz_g",
      9:  "https://www.youtube.com/embed/V4P9tHM5XJ4",
      10: "https://www.youtube.com/embed/3RL0dDghkYw",
      11: "https://www.youtube.com/embed/nkxgGg3PCGE",
      12: "https://www.youtube.com/embed/0MqYkiKFxJA",
    }
    const col = db.collection("experiments")
    const updateResults: Record<string, string> = {}
    for (const [id, videoUrl] of Object.entries(videoUrls)) {
      const idNum = parseInt(id)
      const res = await col.updateOne({ id: idNum }, { $set: { videoUrl } })
      if (res.matchedCount > 0) {
        updateResults[`exp_${id}`] = res.modifiedCount > 0 ? "updated" : "already set"
      } else {
        // Upsert-style: insert minimal doc if not found
        updateResults[`exp_${id}`] = "not found in DB — skipped"
      }
    }
    if (action === "update-videos") {
      return NextResponse.json({ message: "videoUrl patch complete", results: updateResults })
    }
  }

  if (action === "init-gallery" || action === "all") {
    const colNames = (await db.listCollections().toArray()).map((c: any) => c.name)
    if (!colNames.includes("experiment_gallery")) {
      await db.createCollection("experiment_gallery")
    }
    await db.collection("experiment_gallery").createIndex({ experimentId: 1 })
    if (action === "init-gallery") {
      return NextResponse.json({ message: "experiment_gallery collection and index ready" })
    }
  }

  if (action === "all") {
    return NextResponse.json({ message: "All patch actions completed" })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}

export async function GET() {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  let db
  try {
    const connection = await connectToDatabase()
    db = connection.db
  } catch (dbError) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 })
  }

  const counts: Record<string, number> = {}
  for (const col of SEED_COLLECTIONS) {
    try {
      counts[col.name] = await db.collection(col.name).countDocuments()
    } catch {
      counts[col.name] = -1
    }
  }

  return NextResponse.json({ collections: counts })
}
