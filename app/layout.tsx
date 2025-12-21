import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { CourseProvider } from "@/contexts/course-context"
import { PaymentProvider } from "@/contexts/payment-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "DevSkill - Smart Learning Platform",
  description:
    "Empowering learners worldwide with high-quality, accessible & engaging education. Explore diverse courses and accelerate your career.",
  keywords: "online learning, courses, education, skills, development, design",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CourseProvider>
            <PaymentProvider>
              {children}
              <Toaster />
            </PaymentProvider>
          </CourseProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
