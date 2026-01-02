"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { CourseCard } from "@/components/ui/course-card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { useCourses } from "@/contexts/course-context"
import { Search, Filter, ChevronDown, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

function CoursesContent() {
  const searchParams = useSearchParams()
  const { allCourses, getCourses, isLoading } = useCourses()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categoryParam = searchParams.get("category")

  useEffect(() => {
    getCourses()
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [getCourses, categoryParam])

  const categories = ["All", "Design", "Development", "Business", "Marketing", "IT & Software"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = allCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || course.category.toLowerCase().includes(selectedCategory.toLowerCase())
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
      return matchesSearch && matchesCategory && matchesLevel
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.students - a.students
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "price-low") return (a.discountPrice || a.price) - (b.discountPrice || b.price)
      if (sortBy === "price-high") return (b.discountPrice || b.price) - (a.discountPrice || a.price)
      return 0
    })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-teal-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Explore Courses
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Your Perfect <span className="text-orange-500">Course</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Browse through our extensive collection of courses designed to help you achieve your goals.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Courses */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-500"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full ${viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-500"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-600 mb-6">
            Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </p>

          {/* Course Grid */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>

          {/* Empty State */}
          {!isLoading && filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedLevel("All")
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredCourses.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="rounded-full px-8 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent cursor-pointer"
              >
                Load More Courses
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <main className="min-h-screen bg-muted/30">
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        }
      >
        <CoursesContent />
      </Suspense>
      <Footer />
    </div>
  )
}
