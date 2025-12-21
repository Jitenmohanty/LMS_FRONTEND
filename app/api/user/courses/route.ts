import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Mock enrolled courses - replace with real database query
  const enrolledCourses = [
    {
      id: "1",
      title: "Learn Figma to DevSkill Cms Beginner to Advanced",
      thumbnail: "/figma-course.png",
      instructor: "John Doe",
      progress: 45,
      lastAccessed: "2024-12-10",
      enrolledAt: "2024-11-15",
    },
    {
      id: "6",
      title: "Web Development Bootcamp 2024",
      thumbnail: "/web-development-course.png",
      instructor: "Tom Brown",
      progress: 78,
      lastAccessed: "2024-12-09",
      enrolledAt: "2024-10-20",
    },
    {
      id: "3",
      title: "Create a perfect career with UI Design Right Place",
      thumbnail: "/ui-design-course.png",
      instructor: "Mike Johnson",
      progress: 100,
      completedAt: "2024-12-01",
      enrolledAt: "2024-09-15",
    },
  ]

  return NextResponse.json({
    courses: enrolledCourses,
    total: enrolledCourses.length,
  })
}
