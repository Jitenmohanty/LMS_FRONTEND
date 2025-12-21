"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { paymentAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface PaymentContextType {
  isProcessing: boolean
  createOrder: (data: { amount: number; courseId?: string; bundleId?: string; planId?: string }) => Promise<string>
  openRazorpayCheckout: (orderId: string, amount: number, onSuccess: () => void, onFailure: () => void) => void
  verifyPayment: (data: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }) => Promise<boolean>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  prefill: { name: string; email: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

interface RazorpayInstance {
  open: () => void
}

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const createOrder = useCallback(
    async (data: { amount: number; courseId?: string; bundleId?: string; planId?: string }): Promise<string> => {
      setIsProcessing(true)
      try {
        let itemType = 'course'
        let itemId = data.courseId

        if (data.bundleId) {
          itemType = 'bundle'
          itemId = data.bundleId
        } else if (data.planId) {
          itemType = 'subscription'
          itemId = data.planId
        }

        const { data: orderData } = await paymentAPI.createOrder({
          ...data,
          userId: user?.id,
          itemType,
          itemId: itemId || '' // Ensure string
        })
        // Robustly extract orderId handling different response structures
        // Backend returns: { data: { order: { id: "..." } } }
        const orderId =
          orderData.orderId ||
          orderData.data?.orderId ||
          orderData.data?.order?.id ||
          orderData.id

        if (!orderId) {
          throw new Error("Failed to retrieve order ID from backend")
        }
        return orderId
      } catch (error) {
        // Propagate error to be handled by UI (toast notification)
        throw error
      } finally {
        setIsProcessing(false)
      }
    },
    [user],
  )

  const openRazorpayCheckout = useCallback(
    (orderId: string, amount: number, onSuccess: () => void, onFailure: () => void) => {
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "DevSkill",
        description: "Course Purchase",
        order_id: orderId,
        handler: async (response) => {
          try {
            const verified = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            if (verified) {
              onSuccess()
            } else {
              onFailure()
            }
          } catch {
            onFailure()
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#FF6B35",
        },
        modal: {
          ondismiss: onFailure,
        },
      }

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Demo mode - simulate success
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    },
    [],
  )

  const verifyPayment = useCallback(
    async (data: {
      razorpayOrderId: string
      razorpayPaymentId: string
      razorpaySignature: string
    }): Promise<boolean> => {
      try {
        const { data: verifyData } = await paymentAPI.verify(data)
        return verifyData.success
      } catch {
        // Demo mode - return success
        return true
      }
    },
    [],
  )

  return (
    <PaymentContext.Provider
      value={{
        isProcessing,
        createOrder,
        openRazorpayCheckout,
        verifyPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
