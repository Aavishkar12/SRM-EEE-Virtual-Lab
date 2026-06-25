import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { getSupabaseAdmin } from "@/lib/supabase"
import fs from "fs/promises"
import path from "path"

function formatFileSize(bytes: number): string {
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(bytes / 1024).toFixed(1)} KB`
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedName}`
    const sizeStr = formatFileSize(buffer.length)

    const supabase = getSupabaseAdmin()
    if (supabase) {
      // Ensure the bucket exists (creates it as public if missing; safe to call repeatedly)
      await supabase.storage.createBucket("uploads", { public: true }).catch(() => {})

      const { error } = await supabase.storage
        .from("uploads")
        .upload(filename, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        })

      if (error) {
        console.error("Supabase upload failed:", error.message)
        return NextResponse.json(
          { error: `Storage error: ${error.message}` },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filename)

      return NextResponse.json(
        {
          url: publicUrlData.publicUrl,
          name: file.name,
          size: sizeStr,
          message: "File uploaded successfully",
        },
        { status: 201 }
      )
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "File storage is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
        },
        { status: 503 }
      )
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json(
      {
        url: `/uploads/${filename}`,
        name: file.name,
        size: sizeStr,
        message: "File uploaded successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to upload file:", error)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}
