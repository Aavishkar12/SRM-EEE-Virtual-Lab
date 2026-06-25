import { NextResponse } from "next/server"

// Mock progress database
const progressRecords = [
  {
    id: "1",
    userId: "1",
    experimentId: 1,
    completed: true,
    score: 85,
    timeSpent: 45, // minutes
    completedAt: "2023-04-15T14:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    experimentId: 2,
    completed: true,
    score: 92,
    timeSpent: 38, // minutes
    completedAt: "2023-04-16T10:15:00Z",
  },
]

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const experimentId = searchParams.get("experimentId")

  let filteredRecords = [...progressRecords]

  // Filter by userId if provided
  if (userId) {
    filteredRecords = filteredRecords.filter((record) => record.userId === userId)
  }

  // Filter by experimentId if provided
  if (experimentId) {
    filteredRecords = filteredRecords.filter((record) => record.experimentId === Number.parseInt(experimentId))
  }

  return NextResponse.json(filteredRecords)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.userId || !data.experimentId) {
      return NextResponse.json({ error: "User ID and experiment ID are required" }, { status: 400 })
    }

    // Check if a record already exists
    const existingRecord = progressRecords.find(
      (record) => record.userId === data.userId && record.experimentId === data.experimentId,
    )

    if (existingRecord) {
      // Update existing record
      const updatedRecord = {
        ...existingRecord,
        ...data,
        id: existingRecord.id, // Ensure ID doesn't change
      }

      const index = progressRecords.findIndex((record) => record.id === existingRecord.id)
      progressRecords[index] = updatedRecord

      return NextResponse.json(updatedRecord)
    } else {
      // Create a new record
      const newRecord = {
        id: (progressRecords.length + 1).toString(),
        userId: data.userId,
        experimentId: data.experimentId,
        completed: data.completed || false,
        score: data.score || 0,
        timeSpent: data.timeSpent || 0,
        completedAt: data.completed ? new Date().toISOString() : null,
      }

      progressRecords.push(newRecord)

      return NextResponse.json(newRecord, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

