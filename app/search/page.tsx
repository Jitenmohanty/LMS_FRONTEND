"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useCourses, type Course } from "@/contexts/course-context"
import { CourseCard } from "@/components/ui/course-card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { Search } from "lucide-react"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const { searchCourses } = useCourses()
  const [results, setResults] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (query) {
        setIsLoading(true)
        const courses = await searchCourses(query)
        setResults(courses)
        setIsLoading(false)
      }
    }
    search()
  }, [query, searchCourses])

  return (
    <main className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results for &quot;{query}&quot;</h1>
          <p className="text-muted-foreground">
            Found {results.length} course{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try different keywords or browse our categories</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <main className="min-h-screen bg-muted/30 py-12">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </main>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  )
}
