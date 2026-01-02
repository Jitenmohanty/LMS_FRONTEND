"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { subscriptionAPI, paymentAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, CheckCircle, Loader2 } from "lucide-react"

export default function BillingPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, paymentsRes] = await Promise.all([
          subscriptionAPI.getMySubscription(),
          paymentAPI.getMyPayments()
        ])

        if (subRes.data.success) {
          setSubscription(subRes.data.data.subscription)
        }

        if (paymentsRes.data.success) {
          setPayments(paymentsRes.data.data.payments)
        }

      } catch (error) {
        console.error("Failed to fetch billing data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-12">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
        <p className="text-gray-600">Manage your subscription and view payment history</p>
      </div>

      {/* Current Plan */}
      <div className={`rounded-2xl p-6 mb-8 text-white ${subscription ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-gray-800"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
              {subscription ? "Current Plan" : "Free Plan"}
            </span>
            <h2 className="text-2xl font-bold mb-1">
              {subscription ? subscription.name : "Basic Access"}
            </h2>
            <p className="text-white/80">
              {subscription
                ? `Valid until ${new Date(subscription.validUntil).toLocaleDateString()}`
                : "Upgrade to unlock full course access"}
            </p>
          </div>
          <div className="text-right">
            {subscription && (
              <p className="text-3xl font-bold mb-2">
                ₹{subscription.price}<span className="text-lg font-normal">/{subscription.duration}d</span>
              </p>
            )}
            <Button
              className="mt-3 bg-white text-orange-600 hover:bg-gray-100 rounded-full"
              onClick={() => router.push("/pricing")}
            >
              {subscription ? "Change Plan" : "Upgrade Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Method - Only show if subscribed or needed */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Razorpay Secure Payment</p>
              <p className="text-sm text-gray-500">Payments are processed securely via Razorpay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No payment history found</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-4 text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      {payment.itemType === 'course' ? (payment.course?.title || "Course Purchase") : "Subscription"}
                    </td>
                    <td className="py-4 px-4 text-gray-900">₹{payment.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-sm ${payment.status === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {payment.status === 'success' && <CheckCircle className="w-4 h-4" />}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {payment.status === 'success' && (
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
