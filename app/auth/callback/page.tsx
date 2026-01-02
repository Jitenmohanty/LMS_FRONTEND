"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // We need to access setToken/setUser directly or trigger a reload
    // But context mainly exposes login/register. 
    // We can use a custom method if available or manual storage + reload.
    // Looking at useAuth, it has `refreshToken` and `fetchUser` (via useEffect).
    // If we set token in localStorage, the context shoud pick it up on mount/reload.
    const { reloadUser } = useAuth()

    useEffect(() => {
        const token = searchParams.get("token")
        if (token) {
            localStorage.setItem("token", token)
            // Trigger user fetch
            reloadUser().then(() => {
                router.push("/dashboard")
            }).catch(() => {
                router.push("/login?error=auth_failed")
            })
        } else {
            router.push("/login?error=no_token")
        }
    }, [searchParams, router, reloadUser])

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Authenticating...</p>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <AuthCallback />
        </Suspense>
    )
}
