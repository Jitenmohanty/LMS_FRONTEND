"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { userAPI } from "@/lib/api"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useCourses, type Course } from "@/contexts/course-context"
import { useAuth } from "@/contexts/auth-context"
import { usePayment } from "@/contexts/payment-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Star,
  Clock,
  Users,
  BarChart,
  PlayCircle,
  CheckCircle,
  Globe,
  Award,
  FileText,
  Download,
  Share2,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CourseReviews } from "@/components/courses/course-reviews"
import { canAccessCourse } from "@/lib/course-helper"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { getCourseDetails, isLoading } = useCourses()
  const { isAuthenticated, user, reloadUser } = useAuth()
  const { createOrder, openRazorpayCheckout, isProcessing } = usePayment()
  const [course, setCourse] = useState<Course | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Check if course is in wishlist on load
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated && user) {
        try {
          // This assumes we might need to fetch the wishlist to check status, 
          // or we can rely on user details if they contained wishlist IDs.
          // For now, let's fetch the wishlist to be sure or check a specific endpoint if available.
          // Since we don't have a "check wishlist" endpoint, we get all wishlist items.
          const { data } = await userAPI.getWishlist()
          const wishlist = data.data?.wishlist || data.wishlist || []
          // Check if current course id is in wishlist
          // Adjust based on whether wishlist returns full objects or IDs
          const inWishlist = wishlist.some((item: any) =>
            (typeof item === 'string' && item === id) ||
            (item._id === id) ||
            (item.course === id) ||
            (item.course?._id === id)
          )
          setIsWishlisted(inWishlist)
        } catch (error) {
          console.error("Failed to check wishlist status", error)
        }
      }
    }
    checkWishlistStatus()
  }, [id, isAuthenticated, user])

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add to wishlist.",
        variant: "default",
      })
      return
    }

    setWishlistLoading(true)
    try {
      if (isWishlisted) {
        await userAPI.removeFromWishlist(id)
        setIsWishlisted(false)
        toast({ title: "Removed from Wishlist" })
      } else {
        await userAPI.addToWishlist(id)
        setIsWishlisted(true)
        toast({ title: "Added to Wishlist" })
      }
    } catch (error) {
      console.error("Wishlist action failed", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      })
    } finally {
      setWishlistLoading(false)
    }
  }

  useEffect(() => {
    const loadCourse = async () => {
      const courseData = await getCourseDetails(id)
      setCourse(courseData)
    }
    loadCourse()
  }, [id, getCourseDetails])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/courses/" + id)
      return
    }

    try {
      const price = course?.discountPrice || course?.price || 0
      const orderId = await createOrder({ amount: price, courseId: id })
      openRazorpayCheckout(
        orderId,
        price,
        async () => {
          // Add a small delay to ensure backend has processed the webhook/verification completely
          await new Promise(resolve => setTimeout(resolve, 500))
          await reloadUser() // Refresh user state
          toast({
            title: "Enrollment Successful!",
            description: "You have successfully enrolled in this course.",
          })
          router.refresh()
          router.push(`/courses/${id}/learn`)
        },
        () => {
          toast({
            title: "Payment Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          })
        },
      )
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="min-h-screen bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalVideos = course.modules?.reduce((acc, mod) => acc + mod.videos.length, 0) || 12
  const totalDuration = course.duration || "12h 30m"
  const isEnrolled = canAccessCourse(user, course)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-screen bg-muted/30">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 text-sm">
                  <Link href="/courses" className="text-gray-400 hover:text-white">
                    Courses
                  </Link>
                  <span className="text-gray-500">/</span>
                  <span className="text-orange-400">{course.category}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>

                <p className="text-gray-300 text-lg">{course.description}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-400 font-bold">{course.rating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i <= Math.floor(course.rating) ? "text-yellow-400 fill-current" : "text-gray-500"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">({(course.students || 0).toLocaleString()} students)</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Image
                    src={course.instructor.avatar || "/placeholder.svg"}
                    alt={course.instructor.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="font-medium">{course.instructor.name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last updated 2024
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    English
                  </span>
                  <span className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    {course.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* What you'll learn */}
                <div className="bg-card rounded-2xl p-6 border">
                  <h2 className="text-xl font-bold mb-4">What you&apos;ll learn</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Build professional websites from scratch",
                      "Master modern design principles",
                      "Create responsive layouts",
                      "Work with industry-standard tools",
                      "Build a professional portfolio",
                      "Get job-ready skills",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Content */}
                <div className="bg-card rounded-2xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Course Content</h2>
                    <span className="text-sm text-muted-foreground">
                      {course.modules?.length || 5} sections • {totalVideos} lectures • {totalDuration} total
                    </span>
                  </div>

                  <Accordion type="multiple" className="space-y-2">
                    {(
                      course.modules || [
                        {
                          id: "1",
                          title: "Introduction",
                          videos: [
                            { id: "v1", title: "Welcome to the Course", duration: "5:30", key: "intro" },
                            { id: "v2", title: "Course Overview", duration: "10:15", key: "overview" },
                          ],
                        },
                        {
                          id: "2",
                          title: "Getting Started",
                          videos: [
                            { id: "v3", title: "Setting Up Your Environment", duration: "15:20", key: "setup" },
                            { id: "v4", title: "Understanding the Basics", duration: "20:45", key: "basics" },
                          ],
                        },
                        {
                          id: "3",
                          title: "Core Concepts",
                          videos: [
                            { id: "v5", title: "Deep Dive into Features", duration: "25:30", key: "features" },
                            { id: "v6", title: "Best Practices", duration: "18:45", key: "practices" },
                          ],
                        },
                      ]
                    ).map((module, i) => (
                      <AccordionItem key={module.id} value={module.id} className="border rounded-xl overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-3 text-left">
                            <span className="font-medium">
                              Section {i + 1}: {module.title}
                            </span>
                            <span className="text-sm text-muted-foreground">{module.videos.length} lectures</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="space-y-2">
                            {module.videos.map((video) => (
                              <div
                                key={video.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{video.title}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{video.duration}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Requirements */}
                <div className="bg-card rounded-2xl p-6 border">
                  <h2 className="text-xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {[
                      "Basic computer skills",
                      "A computer with internet access",
                      "Willingness to learn and practice",
                    ].map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div className="bg-card rounded-2xl p-6 border">
                  <h2 className="text-xl font-bold mb-4">Instructor</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <Image
                      src={course.instructor.avatar || "/placeholder.svg"}
                      alt={course.instructor.name}
                      width={80}
                      height={80}
                      className="rounded-full w-20 h-20 md:w-16 md:h-16 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{course.instructor.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">Senior Instructor at DevSkill</p>

                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          4.8 Rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          12,500 Students
                        </span>
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          15 Courses
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Passionate educator with 10+ years of industry experience. Committed to helping students achieve
                        your goals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-card rounded-2xl p-6 border">
                  <CourseReviews courseId={id} />
                </div>
              </div>

              {/* Right Sidebar - Sticky Card */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl shadow-lg border sticky top-24 overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <PlayCircle className="w-8 h-8 text-primary ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      {course.discountPrice ? (
                        <>
                          <span className="text-3xl font-bold">${course.discountPrice}</span>
                          <span className="text-xl text-muted-foreground line-through">${course.price}</span>
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                            {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% off
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">${course.price}</span>
                      )}
                    </div>

                    {isEnrolled ? (
                      <Button
                        onClick={() => {
                          const hasContent = course.modules?.some(m => m.videos?.length > 0)
                          if (!hasContent) {
                            toast({
                              title: "No videos added yet",
                              description: "Please check back later.",
                              variant: "default",
                            })
                            return
                          }
                          router.push(`/courses/${id}/learn`)
                        }}
                        className="w-full h-12 text-lg rounded-xl"
                      >
                        Start Learning
                      </Button>
                    ) : (
                      <Button onClick={handleEnroll} disabled={isProcessing} className="w-full h-12 text-lg rounded-xl">
                        {isProcessing ? "Processing..." : "Enroll Now"}
                      </Button>
                    )}

                    <Button variant="outline" className="w-full h-12 text-lg rounded-xl bg-transparent">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">30-Day Money-Back Guarantee</p>

                    <div className="border-t pt-6 space-y-4">
                      <h4 className="font-semibold">This course includes:</h4>
                      <ul className="space-y-3">
                        {[
                          { icon: PlayCircle, text: `${totalVideos} hours on-demand video` },
                          { icon: FileText, text: "15 articles" },
                          { icon: Download, text: "25 downloadable resources" },
                          { icon: Globe, text: "Full lifetime access" },
                          { icon: Award, text: "Certificate of completion" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground">
                            <item.icon className="w-5 h-5" />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4 border-t">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                      <button
                        onClick={toggleWishlist}
                        disabled={wishlistLoading}
                        className={`flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors ${isWishlisted ? "text-red-500 font-medium" : ""}`}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        {isWishlisted ? "Wishlisted" : "Wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
