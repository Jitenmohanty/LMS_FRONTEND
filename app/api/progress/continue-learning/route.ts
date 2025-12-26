import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real app, you would verify the auth token here to get the userId
  // const userId = getUserIdFromToken(request)

  const courses = [
    {
      course: {
        _id: "1",
        title: "Learn Figma to DevSkill Cms Beginner to Advanced",
        thumbnail: "/figma-course.png",
      },
      progressPercentage: 45,
      lastWatchedVideo: "v1",
      lastVideoTimestamp: 120,
      totalVideos: 20,
      completedVideos: ["v1", "v2"],
    },
    {
      course: {
        _id: "6",
        title: "Web Development Bootcamp 2024",
        thumbnail: "/web-development-course.png",
      },
      progressPercentage: 10,
      lastWatchedVideo: "v5",
      lastVideoTimestamp: 60,
      totalVideos: 50,
      completedVideos: ["v1"],
    },
  ]

  return NextResponse.json({
    success: true,
    data: {
      courses,
    },
  })
}
