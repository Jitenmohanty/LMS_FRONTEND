"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { courseAPI } from "@/lib/api"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { CourseModulesSkeleton } from "@/components/skeletons/course-modules-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Plus, Video, Trash } from "lucide-react"
import type { Course } from "@/contexts/course-context"

interface PendingVideo {
    title: string
    file: File | null
    description: string
}

export default function CourseModulesPage() {
    const { id } = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const [course, setCourse] = useState<Course | null>(null)
    const [moduleTitle, setModuleTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Manage videos for the new module
    const [videos, setVideos] = useState<PendingVideo[]>([])

    useEffect(() => {
        if (typeof id === 'string') {
            courseAPI.getById(id).then(({ data }) => {
                // Handle nested response structure: { success: true, data: { course: {...} } }
                const courseData = data.data?.course || data.course || data
                console.log('Loaded course data:', courseData)
                setCourse(courseData)
            }).catch(err => console.error("Failed to load course", err))
        }
    }, [id])

    const addVideoField = () => {
        setVideos([...videos, { title: "", file: null, description: "" }])
    }

    const removeVideoField = (index: number) => {
        const newVideos = [...videos]
        newVideos.splice(index, 1)
        setVideos(newVideos)
    }

    const updateVideoField = (index: number, field: keyof PendingVideo, value: any) => {
        const newVideos = [...videos]
        newVideos[index] = { ...newVideos[index], [field]: value }
        setVideos(newVideos)
    }

    const handleSubmitModule = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!moduleTitle) return
        if (videos.length === 0) {
            toast({ title: "Error", description: "Please add at least one video", variant: "destructive" })
            return
        }
        if (videos.some(v => !v.title.trim())) {
            toast({ title: "Error", description: "All videos must have a title", variant: "destructive" })
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Upload all videos
            const uploadedVideos = await Promise.all(videos.map(async (v, index) => {
                if (!v.file) throw new Error(`File missing for video: ${v.title}`)

                const videoUrl = await uploadToCloudinary(v.file, 'video', 'learning-platform/videos')
                const publicId = videoUrl.split('/').pop()?.split('.')[0] || "temp-id"

                if (!videoUrl) {
                    throw new Error(`Failed to upload video ${v.title}: Missing url`)
                }

                return {
                    title: v.title,
                    description: v.description || "",
                    videoUrl: videoUrl,
                    publicId: publicId,
                    duration: 0, // Backend requires Number. Default to 0 as upload doesn't return duration.
                    order: index + 1
                }
            }))

            // 2. Submit Module
            // Calculate next module order based on existing modules
            const nextOrder = (course?.modules?.length || 0) + 1

            await courseAPI.addModule(id as string, {
                title: moduleTitle,
                order: nextOrder,
                videos: uploadedVideos
            })

            toast({ title: "Success", description: "Module added successfully!" })
            router.push(`/admin/courses`)
            router.refresh()
        } catch (error) {
            console.error("Failed to add module:", error)
            toast({ title: "Error", description: "Failed to upload videos or create module", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!course) return <CourseModulesSkeleton />

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Module & Videos</h2>
                <p className="text-gray-500">Adding content to: <span className="font-semibold">{course.title}</span></p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                    <Label>Module Title</Label>
                    <Input
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                        placeholder="e.g. Getting Started"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Videos</Label>
                        <Button type="button" onClick={addVideoField} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Video
                        </Button>
                    </div>

                    {videos.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm">No videos added yet. Click "Add Video" to start.</p>
                        </div>
                    )}

                    {videos.map((video, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-4 relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                onClick={() => removeVideoField(idx)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                <div className="space-y-2">
                                    <Label>Video Title</Label>
                                    <Input
                                        value={video.title}
                                        onChange={(e) => updateVideoField(idx, "title", e.target.value)}
                                        placeholder="Video title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Video File</Label>
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => updateVideoField(idx, "file", e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmitModule} disabled={isSubmitting || videos.length === 0} className="bg-orange-500 hover:bg-orange-600">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Module
                    </Button>
                </div>
            </div>

            {/* Existing Modules List (Read-only view for reference) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Existing Modules</h3>
                {course.modules && course.modules.length > 0 ? (
                    course.modules.map((mod: any, modIndex: number) => (
                        <div key={mod.id || mod._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                    Module {modIndex + 1}: {mod.title}
                                </h4>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {mod.videos?.length || 0} video{mod.videos?.length !== 1 ? 's' : ''}
                                </span>
                            </div>


                            {/* Display videos in this module */}
                            {mod.videos && mod.videos.length > 0 ? (
                                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                    {mod.videos.map((video: any, vidIndex: number) => {
                                        // Generate thumbnail URL from Cloudinary video URL
                                        const getThumbnailUrl = (videoUrl: string) => {
                                            if (!videoUrl) return null
                                            // Convert video URL to thumbnail by replacing /upload/ with /upload/so_0/
                                            // This gets the first frame of the video as thumbnail
                                            return videoUrl.replace('/upload/', '/upload/so_0,w_200,h_112,c_fill/')
                                                .replace('.mp4', '.jpg')
                                        }

                                        const thumbnailUrl = getThumbnailUrl(video.videoUrl)

                                        return (
                                            <div
                                                key={video._id || vidIndex}
                                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                {/* Video Thumbnail */}
                                                <div className="flex-shrink-0 w-28 h-16 bg-gray-200 rounded overflow-hidden relative">
                                                    {thumbnailUrl ? (
                                                        <Image
                                                            src={thumbnailUrl}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                                                            <Video className="w-8 h-8 text-orange-300" />
                                                        </div>
                                                    )}
                                                    {/* Play icon overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-orange-500 border-b-4 border-b-transparent ml-0.5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Video Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-gray-900 truncate">
                                                        {vidIndex + 1}. {video.title}
                                                    </p>
                                                    {video.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                            {video.description}
                                                        </p>
                                                    )}
                                                    {video.publicId && (
                                                        <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                                                            ID: {video.publicId}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic pl-4">No videos in this module</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">No modules yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
