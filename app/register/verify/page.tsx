"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MailCheck } from "lucide-react"

function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { toast } = useToast()

    // Get email from query or allow manual input if missing
    // Since this is a critical flow, we'll error if email is missing or ask to register
    const emailParam = searchParams.get("email")

    const [email, setEmail] = useState(emailParam || "")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)

    if (!emailParam && !email) {
        return <div className="p-8 text-center">Missing email parameter. <Button onClick={() => router.push('/register')}>Register</Button></div>
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast({ title: "Error", description: "OTP must be 6 digits", variant: "destructive" })
            return
        }
        setIsLoading(true)
        try {
            await authAPI.verifyEmail({ email, otp })
            toast({ title: "Success", description: "Email verified! Please login." })
            router.push("/login")
        } catch (error: any) {
            toast({
                title: "Verification Failed",
                description: error.response?.data?.message || "Invalid OTP",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        try {
            await authAPI.resendOtp({ email })
            toast({ title: "OTP Sent", description: "A new OTP has been sent to your email." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" })
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailCheck className="w-8 h-8 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
                <p className="text-gray-500 mt-2">
                    We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span>
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Verification Code</label>
                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="text-center text-2xl tracking-widest h-14"
                        maxLength={6}
                        autoFocus
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-lg"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Email"}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Didn't receive the code? </span>
                <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-orange-600 font-medium hover:underline disabled:opacity-50"
                >
                    {isResending ? "Sending..." : "Click to resend"}
                </button>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
