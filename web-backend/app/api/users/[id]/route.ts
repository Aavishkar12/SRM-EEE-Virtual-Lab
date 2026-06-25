import { NextResponse } from "next/server"

// Mock user database (same as in the main route)
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the user by ID
  const user = users.find((user) => user.id === id)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Return user without sensitive information
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    completedExperiments: user.completedExperiments || [],
    managedExperiments: user.managedExperiments || [],
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find the user by ID
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update the user (in a real app, this would update a database)
    const updatedUser = {
      ...users[userIndex],
      ...data,
      id, // Ensure ID doesn't change
    }

    users[userIndex] = updatedUser

    // Return user without sensitive information
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      completedExperiments: updatedUser.completedExperiments || [],
      managedExperiments: updatedUser.managedExperiments || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the user by ID
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Remove the user (in a real app, this would update a database)
  const deletedUser = users[userIndex]
  users.splice(userIndex, 1)

  // Return user without sensitive information
  return NextResponse.json({
    id: deletedUser.id,
    name: deletedUser.name,
    email: deletedUser.email,
    role: deletedUser.role,
  })
}

