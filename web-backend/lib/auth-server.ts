import { connectToDatabase } from "./mongodb"
import { normalizeEmail, fallbackAdminEmails } from "./auth"
import fs from "fs/promises"
import path from "path"

export async function getAdminEmails(): Promise<string[]> {
  const configuredAdminEmails =
    process.env.ADMIN_EMAILS?.split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean) ?? []

  const envAdmins = configuredAdminEmails.length > 0 ? configuredAdminEmails : fallbackAdminEmails

  try {
    const { db } = await connectToDatabase()
    const adminsCol = db.collection("admins")
    const dynamicAdminsDocs = await adminsCol.find().toArray()
    const dynamicAdmins = dynamicAdminsDocs.map(doc => normalizeEmail(doc.email)).filter(Boolean)
    
    return [...new Set([...envAdmins, ...dynamicAdmins])]
  } catch (error) {
    console.error("Failed to read dynamic admins from MongoDB, trying fallback JSON:", error)
    try {
      const filePath = path.join(process.cwd(), "lib", "data", "admins.json")
      const content = await fs.readFile(filePath, "utf-8")
      const parsed = JSON.parse(content)
      const dynamicAdmins = (Array.isArray(parsed) ? parsed : []).map(e => {
        if (typeof e === "string") return normalizeEmail(e)
        if (e && typeof e === "object" && e.email) return normalizeEmail(e.email)
        return ""
      }).filter(Boolean)
      return [...new Set([...envAdmins, ...dynamicAdmins])]
    } catch (fallbackError) {
      console.error("Failed to read fallback admins JSON:", fallbackError)
    }
  }

  return envAdmins
}

export async function isAdminEmail(email?: string | null): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email)
  const allAdmins = await getAdminEmails()
  return allAdmins.includes(normalizedEmail)
}

export async function getUserRole(email?: string | null): Promise<string> {
  const isAdm = await isAdminEmail(email)
  return isAdm ? "admin" : "student"
}
