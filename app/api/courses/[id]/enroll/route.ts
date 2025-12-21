import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, paymentId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock enrollment - replace with real database logic
    const enrollment = {
      id: `enroll-${Date.now()}`,
      userId,
      courseId: id,
      paymentId: paymentId || null,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: "active",
    }

    return NextResponse.json(
      {
        enrollment,
        message: "Successfully enrolled in course",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
