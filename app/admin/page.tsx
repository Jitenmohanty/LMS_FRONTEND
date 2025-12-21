"use client"

import { useEffect, useState } from "react"
import { adminAPI } from "@/lib/api"
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  activeUsers: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getDashboardStats()
        // Handle different response structures gracefully
        const statsData = data.stats || data.data || data
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalCourses: statsData.totalCourses || 0,
          totalRevenue: statsData.totalRevenue || 0,
          activeUsers: statsData.activeUsers || 0
        })
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

  if (isLoading) {
    return <div>Loading stats...</div>
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome to the admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
