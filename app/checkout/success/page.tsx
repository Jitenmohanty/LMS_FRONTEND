import Link from "next/link"
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your course is now available.</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono">ORD-2024-001234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium">$49.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">Learn Figma to DevSkill</span>
            </div>
          </div>

          <div className="flex gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>A confirmation email has been sent to your inbox</span>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/courses">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Return to Homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
