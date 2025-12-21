"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCourses, type Course } from "@/contexts/course-context"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Clock, CheckCircle } from "lucide-react"

export default function MyCoursesPage() {
  const { getCourses, allCourses } = useCourses()
  const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([])

  useEffect(() => {
    getCourses()
  }, [getCourses])

  useEffect(() => {
    // Simulate enrolled courses with progress
    setEnrolledCourses(
      allCourses.map((course, i) => ({
        ...course,
        progress: [100, 65, 40, 85, 20, 0][i % 6],
      })),
    )
  }, [allCourses])

  const inProgressCourses = enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100)
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100)
  const notStartedCourses = enrolledCourses.filter((c) => c.progress === 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">Track your progress and continue learning</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full">
            All ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="rounded-full">
            In Progress ({inProgressCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full">
            Completed ({completedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="not-started" className="rounded-full">
            Not Started ({notStartedCourses.length})
          </TabsTrigger>
        </TabsList>

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
          <div className="flex gap-4">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              width={120}
              height={80}
              className="rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{course.instructor.name}</p>

              <div className="flex items-center gap-3 mb-3">
                <Progress value={course.progress} className="flex-1 h-2" />
                <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
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
