"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCourses, type Course } from "@/contexts/course-context"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Clock, CheckCircle } from "lucide-react"
import { progressAPI } from "@/lib/api"

import { DashboardCourseSkeleton } from "@/components/skeletons/dashboard-course-skeleton"

export default function MyCoursesPage() {
  const { getCourses, allCourses } = useCourses()
  const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCourses()
  }, [getCourses])

  useEffect(() => {
    const fetchProgress = async () => {
      // If we have courses, we are loading progress. If no courses, we might still be loading initial fetch? 
      // Actually getCourses might differ. Let's set loading true at start.
      // But we can depend on allCourses changing.

      try {
        const enrolled = allCourses.filter((c) => c.isEnrolled)

        const progressPromises = enrolled.map(async (course) => {
          try {
            const { data } = await progressAPI.getCourseProgress(course.id)
            // Handle different potential response structures
            // data.data (axios) -> progress -> progressPercentage
            const progressData = data.data?.progress || data.progress
            return {
              id: course.id,
              progress: progressData?.progressPercentage || 0,
            }
          } catch (err) {
            console.error(`Failed to fetch progress for course ${course.id}`, err)
            return { id: course.id, progress: 0 }
          }
        })

        const progressResults = await Promise.all(progressPromises)
        const progressMap = new Map(progressResults.map((p) => [p.id, p.progress]))

        const enrolledWithProgress = enrolled.map((c) => ({
          ...c,
          progress: progressMap.get(c.id) || 0,
        }))

        setEnrolledCourses(enrolledWithProgress)
      } catch (error) {
        console.error("Failed to fetch progress:", error)
        // Fallback: show enrolled courses with 0 progress if API fails
        const enrolled = allCourses.filter((c) => c.isEnrolled).map((c) => ({ ...c, progress: 0 }))
        setEnrolledCourses(enrolled)
      } finally {
        setIsLoading(false)
      }
    }

    if (allCourses.length > 0) {
      fetchProgress()
    } else {
      // If allCourses is empty, we might be loading or user has no courses. 
      // We can check if getCourses is done by checking a loading flag from context, 
      // but here we just simulate. 
      // For now let's just turn off loading after a short timeout if no courses found to avoid infinite load
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [allCourses])

  if (isLoading) return <DashboardCourseSkeleton />

  const inProgressCourses = enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100)
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100)
  const notStartedCourses = enrolledCourses.filter((c) => c.progress === 0)

  return (
    <div className="p-6 lg:p-12">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">Track your progress and continue learning</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-6 px-6 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 scrollbar-hide">
          <TabsList className="bg-gray-100 p-1 rounded-full w-max flex h-auto">
            <TabsTrigger value="all" className="rounded-full px-4 py-2">
              All ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="rounded-full px-4 py-2">
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-full px-4 py-2">
              Completed ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="not-started" className="rounded-full px-4 py-2">
              Not Started ({notStartedCourses.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <CourseList courses={enrolledCourses} />
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <CourseList courses={inProgressCourses} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <CourseList courses={completedCourses} />
        </TabsContent>

        <TabsContent value="not-started" className="space-y-4">
          <CourseList courses={notStartedCourses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseList({ courses }: { courses: (Course & { progress: number })[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-500">No courses in this category</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              width={120}
              height={80}
              className="rounded-xl w-full sm:w-[120px] h-40 sm:h-20 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{course.instructor.name}</p>

              <div className="flex items-center gap-3 mb-3">
                <Progress value={course.progress} className="flex-1 h-2" />
                <span className="text-sm font-medium text-gray-600">{course?.progress?.toFixed(2)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {course.progress === 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </>
                  )}
                </div>
                <Link href={`/courses/${course.id}/learn`}>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    {course.progress === 0 ? "Start" : course.progress === 100 ? "Review" : "Continue"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
