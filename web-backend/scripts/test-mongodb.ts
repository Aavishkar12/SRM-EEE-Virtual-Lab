import { MongoClient } from "mongodb"
import * as path from "path"

// Load .env.local manually (tsx doesn't auto-load it)
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local")
  try {
    const content = require("fs").readFileSync(envPath, "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // ignore if file not found
  }
}

loadEnv()

async function testMongoDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("❌ MONGODB_URI is not set in environment variables")
    process.exit(1)
  }

  console.log("🔌 Connecting to MongoDB Atlas...")
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
  })

  try {
    await client.connect()
    console.log("✅ Connected successfully to MongoDB Atlas!\n")

    const db = client.db()
    const dbName = db.databaseName
    console.log(`📦 Database: ${dbName}`)

    const collections = await db.listCollections().toArray()
    if (collections.length === 0) {
      console.log("ℹ️  No collections found (database is empty — run seed script)")
    } else {
      console.log(`\n📋 Collections in '${dbName}' (${collections.length} total):`)
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments()
        console.log(`   • ${col.name.padEnd(30)} ${count} documents`)
      }
    }

    console.log("\n✅ MongoDB connection test PASSED")
  } catch (err: any) {
    console.error("❌ MongoDB connection FAILED:", err.message || err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

testMongoDB()
