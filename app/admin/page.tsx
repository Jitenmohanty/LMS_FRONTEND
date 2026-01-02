"use client"

import { useEffect, useState } from "react"
import { adminAPI } from "@/lib/api"
import { Users, BookOpen, DollarSign, CheckCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardData {
  stats: {
    totalUsers: number
    totalCourses: number
    publishedCourses: number
    totalRevenue: number
  }
  recentUsers: {
    _id: string
    email: string
    name: string
    createdAt: string
  }[]
  topCourses: {
    _id: string
    title: string
    rating: number
    enrollmentCount: number
  }[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: responseData } = await adminAPI.getDashboardStats()
        // Handle nested data structure: response.data.data
        const backendData = responseData.data || responseData
        setData(backendData)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    )
  }

  // Safe defaults
  const stats = data?.stats || { totalUsers: 0, totalCourses: 0, publishedCourses: 0, totalRevenue: 0 }
  const recentUsers = data?.recentUsers || []
  const topCourses = data?.topCourses || []

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      desc: "Registered learners"
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-100",
      desc: "All courses created"
    },
    {
      label: "Published Courses",
      value: stats.publishedCourses,
      icon: CheckCircle,
      color: "text-purple-600",
      bg: "bg-purple-100",
      desc: "Live for students"
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
      desc: "Lifetime earnings"
    },
  ]

  return (
    <div className="p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome to your admin control center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <CardDescription>Newest members joining the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent users found.</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 pl-14 sm:pl-0">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Courses</CardTitle>
            <CardDescription>Courses with the highest enrollment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topCourses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No course data available.</p>
              ) : (
                topCourses.map((course) => (
                  <div key={course._id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none truncate pr-4">{course.title}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-medium text-gray-900 mr-1">{course.enrollmentCount}</span> students enrolled
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 border px-2 py-1 rounded bg-gray-50">
                      {course.enrollmentCount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
