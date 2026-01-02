"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, Clock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { progressAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { ContinueLearningCourse } from "@/types/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function ContinueLearningPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const [courses, setCourses] = useState<ContinueLearningCourse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const fetchCourses = async () => {
                try {
                    const { data } = await progressAPI.getContinueLearning()
                    // The API response is nested: data.data.courses -> array of progress objects
                    const coursesData = data.data?.courses || data.courses || []

                    if (Array.isArray(coursesData)) {
                        // Map the API response to the ContinueLearningCourse interface
                        const mappedCourses: ContinueLearningCourse[] = coursesData.map((item: any) => ({
                            courseId: item.course?._id || item.course?.id,
                            title: item.course?.title || "Untitled Course",
                            thumbnail: item.course?.thumbnail || "",
                            progressPercentage: item.progressPercentage || 0,
                            lastWatchedVideo: item.lastWatchedVideo,
                            lastVideoTimestamp: item.lastVideoTimestamp,
                            // The API may not return totalVideos directly, defaulting to 0 or handling it in UI if needed. 
                            // If user needs totalVideos, we might need to fetch course details or rely on updated API.
                            // For now, map what we have or deduce. Use completedVideos length as a robust fallback base.
                            totalVideos: item.totalVideos || 0,
                            completedVideos: Array.isArray(item.completedVideos) ? item.completedVideos.length : (item.completedVideos || 0)
                        })).filter(c => c.courseId) // Filter out items without a valid course ID

                        setCourses(mappedCourses)
                    } else {
                        console.warn("Invalid data format for continue learning:", data)
                        setCourses([])
                    }
                } catch (error) {
                    console.error("Failed to fetch continue learning courses:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchCourses()
        } else if (!authLoading && !isAuthenticated) {
            // redirect handled by protection wrappers usually, but good to be safe
            setLoading(false)
        }
    }, [isAuthenticated, authLoading])

    if (authLoading || loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-80 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-12 space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Continue Learning</h1>
                <p className="text-muted-foreground">Resume where you left off.</p>
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <PlayCircle className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">No Active Courses</h2>
                    <p className="text-gray-500 max-w-sm mt-2">
                        You don't have any in-progress courses. Start a new course from the library!
                    </p>
                    <Button className="mt-6 bg-orange-600 hover:bg-orange-700" asChild>
                        <Link href="/dashboard/courses">Go to My Courses</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.courseId} className="overflow-hidden hover:shadow-lg transition-all group">
                            <div className="aspect-video relative bg-slate-100">
                                <Image
                                    src={course.thumbnail || "/placeholder.svg"}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <Link
                                        href={`/courses/${course.courseId}/learn`}
                                        className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100"
                                    >
                                        <PlayCircle className="w-6 h-6 text-orange-600 fill-current ml-0.5" />
                                    </Link>
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-4">
                                <h3 className="font-semibold text-lg line-clamp-1" title={course.title}>
                                    {course.title}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {course.totalVideos > 0
                                                ? `${course.completedVideos} / ${course.totalVideos} Videos`
                                                : `${course.completedVideos} Videos Completed`
                                            }
                                        </span>
                                        <span className="font-medium text-orange-600">{course.progressPercentage}%</span>
                                    </div>
                                    <Progress value={course.progressPercentage} className="h-2" />
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700" asChild>
                                    <Link href={`/courses/${course.courseId}/learn`}>
                                        Resume Learning
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
