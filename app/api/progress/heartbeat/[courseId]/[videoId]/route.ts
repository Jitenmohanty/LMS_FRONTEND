import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string; videoId: string }> }
) {
  const resolvedParams = await params
  const { courseId, videoId } = resolvedParams
  const body = await request.json()
  const { timestamp } = body

  // Logic to update heartbeat/timestamp in DB
  console.log(`Heartbeat for ${videoId} in ${courseId} at ${timestamp}`)

  return NextResponse.json({
    success: true,
    message: "Heartbeat received",
  })
}
