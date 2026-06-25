import { NextResponse } from "next/server"

// Updated experiments with all Tinkercad embed IDs
const experiments = [
  {
    id: 1,
    title: "Kirchhoff's Voltage Law",
    description: "Understand the relationship between voltages in a closed loop circuit",
    embedId: "hNWAhAfShmV",
    aim: "To verify Kirchhoff's Voltage Law in a closed loop circuit.",
    completed: 0,
    totalStudents: 0,
  },
  {
    id: 2,
    title: "Thevenin's Theorem",
    description: "Learn about equivalent circuit simplification techniques",
    embedId: "lAusQJ3m4bF",
    aim: "To verify Thevenin's Theorem by constructing an equivalent circuit and comparing its behavior with the original circuit.",
    completed: 0,
    totalStudents: 0,
  },
  {
    id: 3,
    title: "House Wiring",
    description: "Explore residential electrical wiring systems and safety",
    embedId: "2rTQ63Z8SdD",
    aim: "To understand and implement basic residential electrical wiring systems with proper safety measures.",
    completed: 0,
    totalStudents: 0,
  },
  {
    id: 4,
    title: "Fluorescent Lamp Wiring",
    description: "Study the wiring and operation of fluorescent lighting systems",
    embedId: "hnFoQc772H0",
    aim: "To understand and implement the wiring of fluorescent lighting systems with different types of ballasts.",
    completed: 0,
    totalStudents: 0,
  },
  {
    id: 5,
    title: "Staircase Wiring",
    description: "Understand multi-way switching for staircase lighting control",
    embedId: "94YWeHFB9oN",
    aim: "To implement and understand multi-way switching circuits for controlling lights from multiple locations.",
    completed: 0,
    totalStudents: 0,
  },
  {
    id: 6,
    title: "Full Wave Rectifier",
    description: "Learn about AC to DC conversion using full wave rectification",
    embedId: "jbRQbeSnAzj",
    aim: "To construct and analyze the operation of a full wave bridge rectifier circuit with and without filtering.",
    completed: 0,
    totalStudents: 0,
  },
]

export async function GET() {
  return NextResponse.json(experiments)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Create a new experiment (in a real app, this would be saved to a database)
    const newExperiment = {
      id: experiments.length + 1,
      title: data.title,
      description: data.description,
      embedId: data.embedId || "",
      aim: data.aim || "",
      completed: 0,
      totalStudents: 0,
    }

    // Add to our mock database
    experiments.push(newExperiment)

    return NextResponse.json(newExperiment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

