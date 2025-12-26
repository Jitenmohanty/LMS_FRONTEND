import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params

  // Mock data
  const mockReviews = [
    {
      _id: "r1",
      userId: {
        _id: "u1",
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/150?u=alice"
      },
      rating: 5,
      comment: "This course was absolutely amazing! I learned so much.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      _id: "r2",
      userId: {
        _id: "u2",
        name: "Bob Smith",
        avatar: "https://i.pravatar.cc/150?u=bob"
      },
      rating: 4,
      comment: "Great content, but I wish there were more practical exercises.",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
      _id: "r3",
      userId: {
        _id: "u3",
        name: "Charlie Brown",
        avatar: "" // No avatar
      },
      rating: 5,
      comment: "The instructor explains complex topics very clearly.",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
    }
  ]

  return NextResponse.json({
    success: true,
    data: mockReviews
  })
}
