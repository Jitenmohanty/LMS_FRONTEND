import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, subject, message } = body

    // Mock validation
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Since this is "Proceed only frontend", we will just return success.
    // In a real implementation, this is where the email sending logic (Nodemailer) would go.
    
    return NextResponse.json({
      success: true,
      message: "Message sent successfully (Mock)",
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
