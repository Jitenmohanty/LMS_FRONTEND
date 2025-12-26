import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { courseId, rating, comment } = body

    // Validation
    if (!courseId || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    if (comment.length < 5) {
      return NextResponse.json(
        { success: false, message: "Comment must be at least 5 characters long" },
        { status: 400 }
      )
    }

    // Mock User Lookup & Validation (As requested)
    // In a real app, verify the user from the token/session
    // const user = await db.User.findById(req.user.id);
    
    // For MOCK purposes:
    const isAdmin = false; 
    const hasPurchased = true; // Set to true to allow testing, or verify against a mock list if feasible

    if (!isAdmin && !hasPurchased) {
        return NextResponse.json(
            { success: false, message: "You must purchase the course to leave a review" },
            { status: 403 }
        )
    }

    // Mock response - in a real app, this would save to DB
    const newReview = {
      _id: Math.random().toString(36).substring(7),
      userId: {
        _id: "mock_user_id",
        name: "Current User", // In real app, get from auth context/session
        avatar: "/placeholder.svg"
      },
      courseId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: "Review added successfully",
      data: newReview
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
