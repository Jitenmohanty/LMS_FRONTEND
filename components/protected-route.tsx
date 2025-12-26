"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (adminOnly && user?.role !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, adminOnly, user, router, mounted])

  // Don't render anything until mounted on client to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (adminOnly && user?.role !== "admin") {
    return null
  }

  return <>{children}</>
}
