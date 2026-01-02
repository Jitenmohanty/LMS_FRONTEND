
"use client"

import { useState, useEffect } from "react"
import { courseAPI, reviewAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Star, Trash, Reply, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Review {
    _id: string
    user: {
        _id: string
        name: string
        avatar?: string
    }
    rating: number
    comment: string
    createdAt: string
    reply?: string
    replyAt?: string
}

interface Course {
    _id: string
    title: string
}

export default function AdminReviewsPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState<string>("")
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoadingCourses, setIsLoadingCourses] = useState(true)
    const [isLoadingReviews, setIsLoadingReviews] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchCourses()
    }, [])

    useEffect(() => {
        if (selectedCourseId) {
            fetchReviews(selectedCourseId)
        }
    }, [selectedCourseId])

    const fetchCourses = async () => {
        try {
            const { data } = await courseAPI.getAll()
            // Handle different API response structures
            const courseList = data.data?.courses || data.courses || []
            setCourses(courseList)

            if (courseList.length > 0) {
                setSelectedCourseId(courseList[0]._id || courseList[0].id)
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error)
            toast({
                title: "Error",
                description: "Failed to load courses",
                variant: "destructive",
            })
        } finally {
            setIsLoadingCourses(false)
        }
    }

    const fetchReviews = async (courseId: string) => {
        setIsLoadingReviews(true)
        try {
            const { data } = await reviewAPI.getReviews(courseId)
            // Extract reviews array safely handling partial/different response structures
            const reviewsData = data.data?.reviews || data.data || data.reviews || []

            if (Array.isArray(reviewsData)) {
                setReviews(reviewsData)
            } else {
                console.error("Unexpected reviews data structure:", reviewsData)
                setReviews([])
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
            toast({
                title: "Error",
                description: "Failed to load reviews",
                variant: "destructive",
            })
            setReviews([])
        } finally {
            setIsLoadingReviews(false)
        }
    }

    const handleReply = async (reviewId: string) => {
        if (!replyText.trim()) return

        try {
            await reviewAPI.addReply(reviewId, replyText)
            toast({
                title: "Success",
                description: "Reply added successfully",
            })
            setReplyingTo(null)
            setReplyText("")
            fetchReviews(selectedCourseId)
        } catch (error) {
            console.error("Failed to add reply:", error)
            toast({
                title: "Error",
                description: "Failed to add reply",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return

        try {
            await reviewAPI.deleteReview(reviewId)
            toast({
                title: "Success",
                description: "Review deleted successfully",
            })
            fetchReviews(selectedCourseId)
        } catch (error) {
            console.error("Failed to delete review:", error)
            toast({
                title: "Error",
                description: "Failed to delete review",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-orange-500" />
                        Review Management
                    </h2>
                    <p className="text-gray-500">Manage reviews and replies for your courses.</p>
                </div>

                <div className="w-full md:w-72">
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map((course) => (
                                <SelectItem key={course._id} value={course._id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoadingReviews ? (
                    <div className="p-8 text-center text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Reviews Yet</h3>
                        <p className="text-gray-500">This course hasn't received any reviews yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            {review.user?.avatar ? (
                                                <img
                                                    src={review.user.avatar}
                                                    alt={review.user.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-orange-600 font-bold text-lg">
                                                    {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{review.user?.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-6">{review.comment}</p>

                                {review.reply ? (
                                    <div className="ml-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-orange-700 bg-orange-200 px-2 py-0.5 rounded-full">
                                                Admin Reply
                                            </span>
                                            <span className="text-xs text-orange-600/70">
                                                {review.replyAt && !isNaN(new Date(review.replyAt).getTime())
                                                    ? formatDistanceToNow(new Date(review.replyAt), { addSuffix: true })
                                                    : "Just now"}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 text-sm">{review.reply}</p>
                                    </div>
                                ) : (
                                    <div className="ml-8">
                                        {replyingTo === review._id ? (
                                            <div className="space-y-3">
                                                <Textarea
                                                    placeholder="Write your reply..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="min-h-[100px]"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="bg-orange-500 hover:bg-orange-600 text-white"
                                                        size="sm"
                                                        onClick={() => handleReply(review._id)}
                                                    >
                                                        Send Reply
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setReplyingTo(null)
                                                            setReplyText("")
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => {
                                                    setReplyingTo(review._id)
                                                    setReplyText("")
                                                }}
                                            >
                                                <Reply className="w-4 h-4 mr-2" />
                                                Reply to this review
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
