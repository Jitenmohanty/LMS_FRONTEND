import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get("lessonId")
  const userId = searchParams.get("userId")

  if (!lessonId) {
    return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
  }

  // Mock video data - replace with real video service (Mux, Cloudflare Stream, etc.)
  // In production, generate signed URLs for secure video delivery
  const videoData = {
    lessonId,
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    hlsUrl: null, // For adaptive streaming
    thumbnailUrl: "/video-thumbnail.png",
    duration: 180, // seconds
    quality: [
      { label: "1080p", src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
      { label: "720p", src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
      { label: "480p", src: "https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4" },
    ],
    subtitles: [{ label: "English", src: "/subtitles/en.vtt", lang: "en" }],
    resumeAt: 45, // Resume position for user
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // URL expires in 1 hour
  }

  return NextResponse.json(videoData)
}
