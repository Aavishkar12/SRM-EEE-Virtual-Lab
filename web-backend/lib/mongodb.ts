import { MongoClient, Db } from "mongodb"
import fs from "fs/promises"
import path from "path"

const options = {
  // Fast fail for local dev: give up quickly so the app falls back to JSON.
  // Production (Vercel/Render on Linux) will connect fine regardless.
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
  socketTimeoutMS: 30000,
  // Force IPv4 to skip IPv6 probing
  family: 4,
  // Disable TLS validation — bypasses OpenSSL 3 strictness on Windows Node.js 22
  tlsInsecure: true,
}

const MONGO_RETRY_COOLDOWN_MS = 60_000

function getMongoUri(): string | null {
  const uri = process.env.MONGODB_URI?.trim()
  return uri || null
}

export function isMongoConfigured(): boolean {
  return Boolean(getMongoUri())
}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

// Use global cache in development to preserve connection across HMR reloads.
// Also store the circuit breaker timestamp here so it survives module re-evaluations.
interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>
  _mongoClient?: MongoClient
  _mongoFailedAt?: number | null
}

const globalWithMongo = global as typeof globalThis & GlobalWithMongo
if (globalWithMongo._mongoFailedAt === undefined) {
  globalWithMongo._mongoFailedAt = null
}

async function seedDatabaseIfNeeded(db: Db) {
  const collectionsToSeed = [
    { name: "academic_resources", file: "academic_resources.json" },
    { name: "admins", file: "admins.json" },
    { name: "books", file: "books.json" },
    { name: "experiments", file: "experiments.json" },
    { name: "formulas", file: "formulas.json" },
    { name: "manuals", file: "manual.json" },
    { name: "notes", file: "notes.json" },
    { name: "pyqs", file: "pyqs.json" },
    { name: "schedules", file: "schedules.json" },
    { name: "videos", file: "videos.json" },
    { name: "quizzes", file: "quizzes.json" },
  ]

  for (const col of collectionsToSeed) {
    try {
      const collection = db.collection(col.name)
      const count = await collection.countDocuments()
      if (count === 0) {
        console.log(`Collection "${col.name}" is empty. Seeding data from "${col.file}"...`)
        const filePath = path.join(process.cwd(), "lib", "data", col.file)
        
        try {
          const content = await fs.readFile(filePath, "utf-8")
          const parsed = JSON.parse(content)

          if (Array.isArray(parsed) && parsed.length > 0) {
            let documents = parsed
            if (col.name === "admins" && typeof parsed[0] === "string") {
              documents = parsed.map(email => ({ email: String(email).trim().toLowerCase() }))
            }
            await collection.insertMany(documents)
            console.log(`Successfully seeded ${parsed.length} items into "${col.name}".`)
          } else {
            console.log(`No items or invalid format in "${col.file}", skipping seed.`)
          }
        } catch (fileError: any) {
          if (fileError.code === "ENOENT") {
            console.log(`Local file "${col.file}" not found, skipping seeding.`)
          } else {
            throw fileError;
          }
        }
      }
    } catch (err) {
      console.error(`Error seeding collection "${col.name}":`, err)
    }
  }
}

export async function connectToDatabase() {
  const uri = getMongoUri()
  if (!uri) {
    throw new Error("MONGODB_NOT_CONFIGURED")
  }

  // Circuit breaker: skip retrying MongoDB for 60s after a failure to keep the app fast.
  const failedAt = globalWithMongo._mongoFailedAt
  if (failedAt !== null && failedAt !== undefined && Date.now() - failedAt < MONGO_RETRY_COOLDOWN_MS) {
    throw new Error("MONGODB_RECENTLY_FAILED")
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!globalWithMongo._mongoClientPromise) {
        console.log("Connecting to MongoDB Atlas (development)...")
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClient = client
        const p = client.connect()
        p.catch((err) => {
          console.error("MongoDB connection failed:", err.message || err)
          globalWithMongo._mongoFailedAt = Date.now()
          globalWithMongo._mongoClientPromise = undefined
        })
        globalWithMongo._mongoClientPromise = p
      }
      clientPromise = globalWithMongo._mongoClientPromise ?? null
    } else {
      if (!clientPromise) {
        console.log("Connecting to MongoDB Atlas (production)...")
        client = new MongoClient(uri, options)
        const p = client.connect()
        p.catch((err) => {
          console.error("MongoDB connection failed:", err.message || err)
          globalWithMongo._mongoFailedAt = Date.now()
          clientPromise = null
        })
        clientPromise = p
      }
    }

    if (!clientPromise) {
      throw new Error("MONGODB_RECENTLY_FAILED")
    }

    const connectedClient = await clientPromise
    globalWithMongo._mongoFailedAt = null
    const db = connectedClient.db()
    await seedDatabaseIfNeeded(db)
    return { client: connectedClient, db }
  } catch (error: any) {
    console.error("Database connection failed in connectToDatabase:", error.message || error)
    globalWithMongo._mongoFailedAt = Date.now()
    throw error
  }
}

// Export a dummy promise for compatibility if anything expects default import
const defaultExportPromise = Promise.resolve({} as MongoClient)
export default defaultExportPromise

