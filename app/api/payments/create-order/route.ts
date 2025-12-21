import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, amount, userId } = body

    if (!courseId || !amount || !userId) {
      return NextResponse.json({ error: "Course ID, amount, and user ID are required" }, { status: 400 })
    }

    // Mock order creation - replace with real payment gateway integration (Razorpay/Stripe)
    const order = {
      id: `order_${Date.now()}`,
      courseId,
      userId,
      amount: amount * 100, // Convert to smallest currency unit
      currency: "INR",
      status: "created",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      order,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
      message: "Order created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
