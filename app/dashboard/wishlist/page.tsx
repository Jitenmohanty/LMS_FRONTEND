"use client"

import { useState, useEffect } from "react"
import { userAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface WishlistItem {
    _id: string
    title: string
    thumbnail: string
    price: number
    rating: number
    instructor: string // Assuming ID for now, or populate logic
}

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        setLoading(true)
        try {
            const { data } = await userAPI.getWishlist()
            if (data.success) {
                setWishlist(data.data.wishlist)
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (courseId: string) => {
        try {
            await userAPI.removeFromWishlist(courseId)
            setWishlist((prev) => prev.filter((item) => item._id !== courseId))
            toast({
                title: "Removed from wishlist",
                description: "Course removed from your wishlist successfully.",
            })
        } catch (error) {
            console.error("Failed to remove from wishlist:", error)
            toast({
                title: "Failed to remove",
                description: "Could not remove course from wishlist.",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p className="text-gray-600">Courses you've saved for later</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Browse our courses and save the ones you're interested in!
                    </p>
                    <Button
                        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                        onClick={() => router.push("/courses")}
                    >
                        Explore Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((course) => (
                        <div key={course._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-gray-100">
                                <img
                                    src={course.thumbnail || "/placeholder-course.jpg"}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => handleRemove(course._id)}
                                        className="bg-white p-2 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                                    <span className="font-bold text-lg">₹{course.price}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full hover:border-orange-200 hover:text-orange-600"
                                        onClick={() => router.push(`/courses/${course._id}`)}
                                    >
                                        View Course
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
