import Link from "next/link"
import Image from "next/image"
import { Star, Clock, Users, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Course } from "@/contexts/course-context"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {course.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-medium text-white flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {course.rating}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.students}
          </span>
          <span className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            {course.level}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={course.instructor.avatar || "/placeholder.svg"}
            alt={course.instructor.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm text-gray-600">{course.instructor.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.discountPrice ? (
              <>
                <span className="text-lg font-bold text-orange-500">${course.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through">${course.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-orange-500">${course.price}</span>
            )}
          </div>
          <Link href={`/courses/${course.id || course._id}`}>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
              Enroll Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
