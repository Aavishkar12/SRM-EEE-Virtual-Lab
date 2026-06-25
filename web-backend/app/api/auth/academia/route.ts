import { NextResponse } from "next/server"
import { authenticateWithAcademia } from "@/lib/academia-auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const profile = await authenticateWithAcademia(email, password)

    if (!profile) {
      return NextResponse.json(
        { error: "Invalid credentials or scrap failed." },
        { status: 401 }
      )
    }

    // Return the profile details matching what the Android app expects
    return NextResponse.json({
      id: profile.email,
      name: profile.name,
      email: profile.email,
      role: "student", // Default role
      registrationNumber: profile.registrationNumber || "",
      department: profile.department || "",
      branch: profile.branch || "",
      year: profile.year || "",
      semester: profile.semester || "",
      section: profile.section || "",
      batch: profile.batch || "",
      mobile: profile.mobile || "",
      program: profile.program || ""
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "An internal server error occurred.", details: error.message },
      { status: 500 }
    )
  }
}
