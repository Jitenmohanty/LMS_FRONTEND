"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/ui/course-card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { useCourses } from "@/contexts/course-context"
import { Search, ChevronDown } from "lucide-react"

export function CoursesSection() {
  const { allCourses, getCourses, isLoading } = useCourses()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  useEffect(() => {
    getCourses()
  }, [getCourses])

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["All Categories", "Design", "Development", "Business", "Marketing"]

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Our Courses
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Our Course</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredCourses.slice(0, 6).map((course) => <CourseCard key={course.id || course._id} course={course} />)}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses">
            <Button
              variant="outline"
              className="rounded-full px-8 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
            >
              See All Course
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
