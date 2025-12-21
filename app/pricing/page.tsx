"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { subscriptionAPI } from "@/lib/api"
import { usePayment } from "@/contexts/payment-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Plan {
  _id: string
  name: string
  price: number
  billingCycle: number
  features: string[]
  isActive: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createOrder, openRazorpayCheckout } = usePayment()
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await subscriptionAPI.getPlans()
        setPlans(data.data.plans.filter((p: Plan) => p.isActive) || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pricing plans",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      router.push("/login?redirect=/pricing")
      return
    }

    setProcessingPlanId(plan._id)
    try {
      const orderId = await createOrder({
        amount: plan.price,
        planId: plan._id,
        // Backend handles logic if user is already subscribed or upgrading
      })

      openRazorpayCheckout(
        orderId,
        plan.price,
        () => {
          toast({
            title: "Subscription Successful!",
            description: `You are now subscribed to ${plan.name}`,
          })
          router.push("/dashboard/billing")
        },
        () => {
          toast({
            title: "Payment Failed",
            description: "Transaction was cancelled or failed",
            variant: "destructive",
          })
          setProcessingPlanId(null)
        }
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate subscription",
        variant: "destructive",
      })
      setProcessingPlanId(null)
    }
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that suits your learning journey
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6 md:p-8 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-extrabold tracking-tight">₹{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      / {plan.billingCycle === 365 ? "year" : `${plan.billingCycle}`}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex">
                        <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200 mt-auto">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!processingPlanId}
                  >
                    {processingPlanId === plan._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
