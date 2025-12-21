"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { reviewAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Review {
    _id: string
    userId: {
        _id: string
        name: string
        avatar?: string
    }
    rating: number
    comment: string
    createdAt: string
}

export function CourseReviews({ courseId }: { courseId: string }) {
    const { isAuthenticated, user } = useAuth()
    const { toast } = useToast()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await reviewAPI.getReviews(courseId)
                // Assuming API returns { data: Review[] } or just Review[]
                // Adjust based on actual API response structure
                const reviewsData = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : data.data?.reviews || data.reviews || []
                setReviews(reviewsData)
            } catch (error) {
                console.error("Failed to fetch reviews", error)
            } finally {
                setLoading(false)
            }
        }

        if (courseId) {
            fetchReviews()
        }
    }, [courseId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating.",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)
        try {
            await reviewAPI.addReview({ courseId, rating, comment })
            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            })
            setComment("")
            setRating(0)
            // Refresh reviews
            const { data } = await reviewAPI.getReviews(courseId)
            const reviewsData = Array.isArray(data)
                ? data
                : Array.isArray(data.data)
                    ? data.data
                    : data.data?.reviews || data.reviews || []
            setReviews(reviewsData)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Student Reviews</h2>

            {/* Add Review Form */}
            {isAuthenticated ? (
                <div className="bg-muted/30 p-6 rounded-xl border space-y-4">
                    <h3 className="font-semibold text-lg">Write a Review</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating} stars` : "Select rating"}</span>
                        </div>
                        <Textarea
                            placeholder="Share your experience with this course..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none min-h-[100px]"
                        />
                        <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
                            {submitting ? "Submitting..." : "Post Review"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-muted/30 p-6 rounded-xl border text-center">
                    <p className="text-muted-foreground mb-4">Please log in to leave a review.</p>
                    <Button variant="outline" asChild>
                        <a href={`/login?redirect=/courses/${courseId}`}>Log In</a>
                    </Button>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <p className="text-muted-foreground text-center py-8">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={review.userId?.avatar} alt={review.userId?.name || "User"} />
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{review.userId?.name || "Anonymous User"}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : "Recent"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
