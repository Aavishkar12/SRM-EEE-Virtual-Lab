/**
 * MongoDB update script — run with:
 *   node scripts/update-mongodb.mjs
 *
 * What it does:
 *  1. Patches all 12 existing experiments with their videoUrl field
 *  2. Ensures experiment_gallery collection exists with an index on experimentId
 *  3. Prints a summary of the changes
 */
import { MongoClient } from "mongodb"
import { resolve } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
// Manually parse .env.local without dotenv dependency
try {
  const envContent = readFileSync(resolve(__dirname, "../.env.local"), "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set in .env.local")
  process.exit(1)
}

const videoUrls = {
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

async function main() {
  console.log("🔗  Connecting to MongoDB Atlas…")
  const client = new MongoClient(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })

  try {
    await client.connect()
    console.log("✅  Connected.\n")
    const db = client.db()

    // ── 1. Update experiments with videoUrl ──────────────────────────────────
    console.log("📝  Patching experiments with videoUrl…")
    const experimentsCol = db.collection("experiments")
    let updated = 0
    for (const [idStr, videoUrl] of Object.entries(videoUrls)) {
      const id = parseInt(idStr)
      const result = await experimentsCol.updateOne(
        { id },
        { $set: { videoUrl } },
        { upsert: false }
      )
      if (result.matchedCount > 0) {
        console.log(`  ✔  Exp ${id}: set videoUrl`)
        updated++
      } else {
        console.log(`  ⚠  Exp ${id}: document not found in MongoDB`)
      }
    }
    console.log(`\n   ${updated}/12 experiments updated with videoUrl.\n`)

    // ── 2. Ensure experiment_gallery collection + index ──────────────────────
    console.log("🗂   Setting up experiment_gallery collection…")
    const colNames = (await db.listCollections().toArray()).map((c) => c.name)
    if (!colNames.includes("experiment_gallery")) {
      await db.createCollection("experiment_gallery")
      console.log("  ✔  Created experiment_gallery collection.")
    } else {
      console.log("  ✔  experiment_gallery already exists.")
    }
    const galleryCol = db.collection("experiment_gallery")
    await galleryCol.createIndex({ experimentId: 1 })
    console.log("  ✔  Index on experimentId ensured.\n")

    // ── 3. List all collections with doc counts ───────────────────────────────
    console.log("📊  Collection summary:")
    const allCols = await db.listCollections().toArray()
    for (const col of allCols.sort((a, b) => a.name.localeCompare(b.name))) {
      const count = await db.collection(col.name).countDocuments()
      console.log(`  ${col.name.padEnd(28)} ${count} docs`)
    }

    console.log("\n🎉  All done!")
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error("❌  Error:", e.message || e)
  process.exit(1)
})
