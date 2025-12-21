import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Mock user creation - replace with real database logic
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "student",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        user: newUser,
        token: `mock-jwt-token-${newUser.id}`,
        message: "Registration successful",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
