import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock authentication - replace with real auth logic
    const mockUsers = [
      { id: "1", email: "user@example.com", password: "password123", name: "John Doe", role: "student" },
      { id: "2", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" },
      { id: "3", email: "instructor@example.com", password: "instructor123", name: "Jane Smith", role: "instructor" },
    ]

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Return user data (in production, return a JWT token)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
