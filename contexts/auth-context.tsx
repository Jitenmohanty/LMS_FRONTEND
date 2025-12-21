"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authAPI } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "instructor"
  avatar?: string
  purchasedCourses?: string[]
  subscriptionPlan?: string
  bio?: string
  website?: string
  addresses?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  googleLoginRedirect: () => void
  reloadUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        const { data } = await authAPI.me()
        // Handle both direct and nested response structures
        if (data.success && data.data?.user) {
          setUser(data.data.user)
        } else if (data.user) {
          setUser(data.user)
        }
      }
    } catch {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password })
    const accessToken = data.data?.accessToken || data.token
    const user = data.data?.user || data.user

    if (accessToken) {
      localStorage.setItem("token", accessToken)
      setToken(accessToken)
    }
    if (user) {
      setUser(user)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authAPI.register({ name, email, password })
    const accessToken = data.data?.accessToken || data.token
    const user = data.data?.user || data.user

    if (accessToken) {
      localStorage.setItem("token", accessToken)
      setToken(accessToken)
    }
    if (user) {
      setUser(user)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } finally {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    }
  }

  const refreshToken = async () => {
    const { data } = await authAPI.refresh()
    const accessToken = data.data?.accessToken || data.token
    if (accessToken) {
      localStorage.setItem("token", accessToken)
      setToken(accessToken)
    }
  }

  const googleLoginRedirect = () => {
    window.location.href = authAPI.googleLogin()
  }

  const reloadUser = fetchUser

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        googleLoginRedirect,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
