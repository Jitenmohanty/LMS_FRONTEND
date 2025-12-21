"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useCourses, type Course } from "@/contexts/course-context"
import { userAPI, progressAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Trophy, TrendingUp, PlayCircle, ArrowRight, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ContinueLearningCourse } from "@/types/progress"

export default function DashboardPage() {
  const { user } = useAuth()
  const { getCourses, allCourses } = useCourses()
  const [continueLearningCourses, setContinueLearningCourses] = useState<ContinueLearningCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState({
    enrolledCourses: 0,
    hoursLearned: 0,
    certificates: 0,
    completionRate: 0,
    recentActivity: [] as { type: string; courseTitle: string; date: string }[]
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await getCourses()
        const [statsResponse, continueResponse] = await Promise.all([
          userAPI.getDashboardStats(),
          progressAPI.getContinueLearning()
        ])

        if (statsResponse.data && statsResponse.data.success) {
          setStatsData(statsResponse.data.data)
        }

        const coursesData = continueResponse.data.data?.courses || continueResponse.data.courses || []
        if (Array.isArray(coursesData)) {
          const mappedCourses: ContinueLearningCourse[] = coursesData.map((item: any) => ({
            courseId: item.course?._id || item.course?.id,
            title: item.course?.title || "Untitled Course",
            thumbnail: item.course?.thumbnail || "",
            progressPercentage: item.progressPercentage || 0,
            lastWatchedVideo: item.lastWatchedVideo,
            lastVideoTimestamp: item.lastVideoTimestamp,
            totalVideos: item.totalVideos || 0,
            completedVideos: Array.isArray(item.completedVideos) ? item.completedVideos.length : (item.completedVideos || 0)
          })).filter(c => c.courseId)
          setContinueLearningCourses(mappedCourses)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getCourses])
  const stats = [
    { label: "Enrolled Courses", value: statsData.enrolledCourses, icon: BookOpen, color: "bg-blue-500" },
    { label: "Hours Learned", value: statsData.hoursLearned, icon: Clock, color: "bg-green-500" },
    { label: "Certificates", value: statsData.certificates, icon: Trophy, color: "bg-yellow-500" },
    { label: "Completion Rate", value: `${Math.round(statsData.completionRate)}%`, icon: TrendingUp, color: "bg-purple-500" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Learner"}!
        </h1>
        <p className="text-gray-600">Continue your learning journey. You're making great progress!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
              <Link href="/dashboard/continue" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                View All
              </Link>
            </div>

            {continueLearningCourses.length > 0 ? (
              <div className="space-y-4">
                {continueLearningCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      width={100}
                      height={70}
                      className="rounded-lg object-cover aspect-video"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{course.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Progress value={course.progressPercentage} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-gray-600">{course.progressPercentage}%</span>
                      </div>
                    </div>
                    <Link href={`/courses/${course.courseId}/learn`}>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <Link href="/courses">
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {statsData.recentActivity && statsData.recentActivity.length > 0 ? (
                statsData.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        {activity.type}: <span className="font-medium">{activity.courseTitle}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Pro Subscription</h3>
            <p className="text-sm text-white/80 mb-4">Access all 250+ courses</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/80">Renews in 25 days</span>
              <span className="text-2xl font-bold">$29/mo</span>
            </div>
            <Link href="/pricing">
              <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 rounded-full">
                Manage Subscription
              </Button>
            </Link>
          </div>


          {/* Recommended Courses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Recommended for You</h3>
            <div className="space-y-4">
              {allCourses
                .filter(course => !user?.purchasedCourses?.includes(course.id || (course as any)._id))
                .slice(0, 3)
                .map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`} className="flex items-center gap-3 group">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      width={60}
                      height={45}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-500 transition-colors">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.isFree ? "Free" : `$${course.price}`}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </Link>
                ))}
              {allCourses.filter(course => !user?.purchasedCourses?.includes(course.id || (course as any)._id)).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No new recommendations available.</p>
              )}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Weekly Goal</h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(5 / 7) * 351.86} 351.86`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">5</p>
                    <p className="text-sm text-gray-500">of 7 days</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">Great job! Keep the streak going!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
