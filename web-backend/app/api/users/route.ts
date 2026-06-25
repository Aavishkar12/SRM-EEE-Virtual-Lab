import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    name: "Demo Student",
    email: "student@example.com",
    role: "student",
    completedExperiments: [1, 2],
  },
  {
    id: "2",
    name: "Demo Teacher",
    email: "teacher@example.com",
    role: "teacher",
    managedExperiments: [1, 2, 3, 4, 5, 6],
  },
]

export async function GET() {
  // In a real app, you would authenticate and authorize this request
  // For demo purposes, we're returning all users
  return NextResponse.json(
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })),
  )
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === data.email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create a new user (in a real app, you would hash the password)
    const newUser = {
      id: (users.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: data.role || "student",
      completedExperiments: [],
    }

    // Add to our mock database
    users.push(newUser)

    // Return user without sensitive information
    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

