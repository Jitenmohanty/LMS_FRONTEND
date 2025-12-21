"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useCourses } from "@/contexts/course-context"
import { Button } from "@/components/ui/button"
import { Star, Users, BookOpen, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function BundlesPage() {
  const { bundles, getBundles, isLoading } = useCourses()

  useEffect(() => {
    getBundles()
  }, [getBundles])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-screen bg-muted/30">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Course Bundles
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Save More with <span className="text-primary">Bundles</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get multiple courses at a discounted price and accelerate your learning journey.
            </p>
          </div>
        </section>

        {/* Bundles Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-6">
                    <Skeleton className="h-48 w-full rounded-xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {bundles.map((bundle) => {
                  const savings = bundle.price - bundle.discountPrice
                  const savingsPercent = Math.round((savings / bundle.price) * 100)

                  return (
                    <div
                      key={bundle.id}
                      className="bg-card rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-56">
                        <Image
                          src={bundle.thumbnail || "/placeholder.svg"}
                          alt={bundle.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Save {savingsPercent}%
                        </div>
                      </div>

                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{bundle.title}</h2>
                        <p className="text-muted-foreground mb-4">{bundle.description}</p>

                        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {bundle.courses.length} Courses
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {bundle.courses.reduce((acc, c) => acc + c.students, 0).toLocaleString()} Students
                          </span>
                        </div>

                        {/* Courses in bundle */}
                        <div className="space-y-3 mb-6">
                          <p className="text-sm font-medium">Courses included:</p>
                          {bundle.courses.map((course) => (
                            <div key={course.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                              <Image
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                width={60}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{course.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  {course.rating}
                                  <span>•</span>
                                  {course.duration}
                                </div>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">${bundle.discountPrice}</span>
                              <span className="text-lg text-muted-foreground line-through">${bundle.price}</span>
                            </div>
                            <p className="text-sm text-green-600">You save ${savings.toFixed(2)}</p>
                          </div>
                          <Link href={`/bundles/${bundle.id}`}>
                            <Button className="rounded-full px-6">Get Bundle</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
