
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { userAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Heart, PlayCircle, ShoppingCart, Trash2, AlertCircle } from "lucide-react"

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchWishlist = async () => {
        try {
            const { data } = await userAPI.getWishlist()
            const items = data.data?.wishlist || data.wishlist || []
            setWishlist(items)
        } catch (error) {
            console.error("Failed to load wishlist", error)
            toast({
                title: "Error",
                description: "Failed to load wishlist",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    const handleRemove = async (courseId: string) => {
        try {
            await userAPI.removeFromWishlist(courseId)
            toast({ title: "Removed from wishlist" })
            // Optimistically remove from state
            setWishlist(prev => prev.filter(item => {
                const id = item.course?._id || item._id
                return id !== courseId
            }))
        } catch (error) {
            console.error("Failed to remove from wishlist", error)
            toast({ title: "Error", description: "Failed to remove course", variant: "destructive" })
        }
    }

    if (loading) return <WishlistSkeleton />

    return (
        <div className="p-6 lg:p-12 space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p className="text-gray-500">Courses you've saved for later.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Explore courses and save them to your wishlist.</p>
                    <Link href="/courses">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                            Browse Courses
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => {
                        const course = item.course || item
                        const courseId = course._id || course.id

                        return (
                            <div key={courseId} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                <Link href={`/courses/${courseId}`} className="relative h-48 block overflow-hidden">
                                    <Image
                                        src={course.thumbnail || "/placeholder.svg"}
                                        alt={course.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </Link>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                            {course.category || "Course"}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-orange-500 font-medium ml-auto">
                                            <span>★ {course.rating || 4.5}</span>
                                        </div>
                                    </div>

                                    <Link href={`/courses/${courseId}`} className="flex-1">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            By {course.instructor?.name || "Instructor"}
                                        </p>
                                    </Link>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                        <div>
                                            {course.discountPrice ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-lg">₹{course.discountPrice}</span>
                                                    <span className="text-sm text-gray-400 line-through">₹{course.price}</span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-lg">₹{course.price}</span>
                                            )}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => handleRemove(courseId)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function WishlistSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
