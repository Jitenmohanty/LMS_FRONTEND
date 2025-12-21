import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Mock progress data - replace with real database logic
  const progress = {
    courseId: id,
    userId,
    completedLessons: ["l1", "l2", "l3"],
    totalLessons: 18,
    progressPercentage: 17,
    lastAccessedLesson: "l3",
    lastAccessedAt: new Date().toISOString(),
  }

  return NextResponse.json(progress)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, lessonId, completed } = body

    if (!userId || !lessonId) {
      return NextResponse.json({ error: "User ID and Lesson ID are required" }, { status: 400 })
    }

    // Mock progress update - replace with real database logic
    const updatedProgress = {
      courseId: id,
      lessonId,
      userId,
      completed,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      progress: updatedProgress,
      message: "Progress updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
