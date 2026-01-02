"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { courseAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash, Layers } from "lucide-react"
import { AdminCourseSkeleton } from "@/components/skeletons/admin-course-skeleton"

// Define Course interface locally or import from context if reliable
export interface Course {
  id?: string;
  _id?: string;
  title: string;
  thumbnail: string;
  price: number;
  instructor: { name: string };
  category: string;
  level: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getAll()
      setCourses(data.data?.courses || data.courses || [])
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    try {
      await courseAPI.delete(id)
      toast({ title: "Success", description: "Course deleted successfully" })
      fetchCourses()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <AdminCourseSkeleton />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-500">Create and manage your courses.</p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id || course._id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="relative w-full md:w-48 h-32 md:h-28 flex-shrink-0">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover rounded-lg bg-gray-100"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {course.category}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {course.level}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By {course.instructor?.name}</p>
              <p className="font-bold text-gray-900">${course.price}</p>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
              <Link href={`/admin/courses/${course.id || course._id}/modules`}>
                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Layers className="w-4 h-4 mr-2" />
                  Modules
                </Button>
              </Link>
              <Link href={`/admin/courses/${course.id || course._id}/edit`}>
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(course.id || course._id || "")}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No courses found. Create your first course!</p>
          </div>
        )}
      </div>
    </div>
  )
}
