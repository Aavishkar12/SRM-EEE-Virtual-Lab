import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { normalizeEmail } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"
import fs from "fs/promises"
import path from "path"

const supabase = getSupabaseAdmin()

export async function GET() {
  const session = await auth()
  
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
  }

  const configuredAdminEmails =
    process.env.ADMIN_EMAILS?.split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean) ?? []
  const envAdmins = configuredAdminEmails.length > 0 ? configuredAdminEmails : ["admin@srmist.edu.in"]

  try {
    const { db } = await connectToDatabase()
    const adminsCol = db.collection("admins")
    const docs = await adminsCol.find().toArray()
    const emails = docs.map(doc => normalizeEmail(doc.email)).filter(Boolean)
    return NextResponse.json([...new Set([...envAdmins, ...emails])])
  } catch (error) {
    console.error("Failed to fetch admins from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "admins.json")
      const content = await fs.readFile(filePath, "utf-8")
      const parsed = JSON.parse(content)
      const emails = (Array.isArray(parsed) ? parsed : []).map(e => {
        if (typeof e === "string") return normalizeEmail(e)
        if (e && typeof e === "object" && e.email) return normalizeEmail(e.email)
        return ""
      }).filter(Boolean)
      return NextResponse.json([...new Set([...envAdmins, ...emails])])
    } catch (fallbackError) {
      return NextResponse.json(envAdmins)
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
    const email = normalizeEmail(body.email)

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for POST admins:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to save admin." }, { status: 503 })
    }

    const adminsCol = db.collection("admins")
    const existing = await adminsCol.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email is already an admin" }, { status: 400 })
    }

    // Insert new admin to MongoDB database
    await adminsCol.insertOne({ email })

    // Trigger Supabase Invite
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/signin`
        })
        if (error) {
          console.error("Supabase invite failed:", error.message)
        } else {
          console.log(`Supabase invitation sent successfully to: ${email}`)
        }
      } catch (inviteError) {
        console.error("Error triggering Supabase invitation:", inviteError)
      }
    } else {
      console.warn("Supabase client not initialized. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are added to your .env file.")
    }

    return NextResponse.json({ email, message: "Admin account added successfully and invited" }, { status: 201 })
  } catch (error) {
    console.error("Failed to insert admin in MongoDB:", error)
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
    const emailToDelete = normalizeEmail(searchParams.get("email") || "")

    if (!emailToDelete) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Protect root admin from deleting themselves
    if (emailToDelete === normalizeEmail(session.user?.email)) {
      return NextResponse.json({ error: "Cannot delete your own active admin account" }, { status: 400 })
    }

    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
    } catch (dbError) {
      console.error("Database connection failed for DELETE admins:", dbError)
      return NextResponse.json({ error: "Database offline. Unable to delete admin." }, { status: 503 })
    }

    const adminsCol = db.collection("admins")
    
    const result = await adminsCol.deleteOne({ email: emailToDelete })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Admin email not found in dynamic database" }, { status: 404 })
    }

    return NextResponse.json({ message: "Admin account deleted successfully" })
  } catch (error) {
    console.error("Failed to delete admin in MongoDB:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
