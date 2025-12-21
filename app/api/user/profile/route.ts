import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Mock user profile - replace with real database query
  const profile = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/user-avatar.jpg",
    bio: "Passionate learner and developer",
    enrolledCourses: 5,
    completedCourses: 2,
    certificates: 2,
    joinedAt: "2024-01-15",
    preferences: {
      notifications: true,
      newsletter: true,
      darkMode: false,
    },
  }

  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, bio, avatar, preferences } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock profile update - replace with real database update
    const updatedProfile = {
      id: userId,
      name,
      bio,
      avatar,
      preferences,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      profile: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
