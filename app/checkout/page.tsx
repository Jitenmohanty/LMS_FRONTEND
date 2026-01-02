"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      window.location.href = "/checkout/success"
    }, 2000)
  }

  const course = {
    title: "Learn Figma to DevSkill Cms Beginner to Advanced",
    instructor: "John Doe",
    price: 49.0,
    originalPrice: 99.0,
    image: "/figma-course-thumbnail.jpg",
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-6xl py-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Payment Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase securely</p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Credit / Debit Card</span>
                          <div className="flex gap-2">
                            <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs">
                              Visa
                            </div>
                            <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs">MC</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                          <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                    <p className="text-xs text-muted-foreground">Receipt will be sent to this email</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="coupon">Coupon Code (Optional)</Label>
                    <div className="flex gap-2">
                      <Input id="coupon" placeholder="Enter code" />
                      <Button type="button" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay ₹{course.price.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">Your payment is secure and encrypted</p>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={100}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Original Price</span>
                    <span className="line-through text-muted-foreground">₹{course.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span className="text-green-500">-₹{(course.originalPrice - course.price).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{course.price.toFixed(2)}</span>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium">What you get:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {[
                      "Lifetime access to course",
                      "Access on mobile and desktop",
                      "Certificate of completion",
                      "30-day money-back guarantee",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
