"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { courseAPI } from "@/lib/api"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

export default function CreateCoursePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        level: "Beginner",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!thumbnailFile) {
            toast({ title: "Error", description: "Please upload a thumbnail image", variant: "destructive" })
            return
        }
        if (!bannerFile) {
            toast({ title: "Error", description: "Please upload a banner image", variant: "destructive" })
            return
        }

        if (formData.description.length < 20) {
            toast({ title: "Error", description: "Description must be at least 20 characters", variant: "destructive" })
            return
        }

        setIsLoading(true)

        try {
            // 1. Upload Thumbnail
            const thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image', 'learning-platform/courses/thumbnails')

            // 2. Upload Banner
            const bannerUrl = await uploadToCloudinary(bannerFile, 'image', 'learning-platform/courses/banners')

            if (!thumbnailUrl || !bannerUrl) {
                throw new Error("Failed to get image URLs from upload response")
            }

            // 3. Create Course
            const coursePayload = {
                ...formData,
                description: formData.description,
                level: formData.level.toLowerCase(), // Fix: Backend expects lowercase enum
                price: parseFloat(formData.price),
                discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
                thumbnail: thumbnailUrl,
                banner: bannerUrl,
                duration: 1, // Default duration > 0 required by backend validation
                enrollmentCount: 0,
                tags: [] // Add tags logic if needed later
            }

            await courseAPI.create(coursePayload)

            toast({ title: "Success", description: "Course created successfully!" })
            router.push("/admin/courses")

        } catch (error) {
            console.error("Failed to create course:", error)
            toast({
                title: "Error",
                description: "Failed to create course. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto lg:p-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                <p className="text-gray-500">Add a new course to your catalog.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Complete React Guide"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of the course..."
                        className="h-32"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                        <Input
                            id="discountPrice"
                            type="number"
                            step="0.01"
                            value={formData.discountPrice}
                            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            onValueChange={(val) => setFormData({ ...formData, category: val })}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Development">Development</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                            defaultValue="Beginner"
                            onValueChange={(val) => setFormData({ ...formData, level: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Thumbnail Image</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        />
                        {thumbnailFile ? (
                            <div className="text-center">
                                <p className="font-medium text-orange-600">{thumbnailFile.name}</p>
                                <p className="text-xs text-gray-400">Click to change</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>Click to upload thumbnail</p>
                                <p className="text-xs">PNG, JPG, GIF max 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Banner Image</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                        />
                        {bannerFile ? (
                            <div className="text-center">
                                <p className="font-medium text-orange-600">{bannerFile.name}</p>
                                <p className="text-xs text-gray-400">Click to change</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>Click to upload banner</p>
                                <p className="text-xs">PNG, JPG, GIF max 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white w-32">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Course"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
