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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Plus, Video, Trash, Edit, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

    // Edit/Delete Module states
    const [editModuleDialog, setEditModuleDialog] = useState<{ open: boolean, module: any | null }>({ open: false, module: null })
    const [editModuleTitle, setEditModuleTitle] = useState("")
    const [editModuleDesc, setEditModuleDesc] = useState("")
    const [deleteModuleDialog, setDeleteModuleDialog] = useState<{ open: boolean, moduleId: string | null }>({ open: false, moduleId: null })

    // Edit/Delete Video states
    const [editVideoDialog, setEditVideoDialog] = useState<{ open: boolean, video: any | null, moduleId: string | null }>({ open: false, video: null, moduleId: null })
    const [editVideoTitle, setEditVideoTitle] = useState("")
    const [editVideoDesc, setEditVideoDesc] = useState("")
    const [editVideoFreePreview, setEditVideoFreePreview] = useState(false)
    const [editVideoFile, setEditVideoFile] = useState<File | null>(null)
    const [deleteVideoDialog, setDeleteVideoDialog] = useState<{ open: boolean, videoId: string | null, moduleId: string | null }>({ open: false, videoId: null, moduleId: null })

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

    // Module Edit/Delete Handlers
    const handleEditModule = (module: any) => {
        setEditModuleTitle(module.title || "")
        setEditModuleDesc(module.description || "")
        setEditModuleDialog({ open: true, module })
    }

    const handleSaveModuleEdit = async () => {
        if (!editModuleDialog.module || !id) return

        setIsSubmitting(true)
        try {
            await courseAPI.updateModule(id as string, editModuleDialog.module._id, {
                title: editModuleTitle,
                description: editModuleDesc
            })

            // Refresh course data
            const { data } = await courseAPI.getById(id as string)
            const courseData = data.data?.course || data.course || data
            setCourse(courseData)

            setEditModuleDialog({ open: false, module: null })
            toast({ title: "Success", description: "Module updated successfully!" })
        } catch (error) {
            console.error("Failed to update module:", error)
            toast({ title: "Error", description: "Failed to update module", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteModule = async () => {
        if (!deleteModuleDialog.moduleId || !id) return

        setIsSubmitting(true)
        try {
            await courseAPI.deleteModule(id as string, deleteModuleDialog.moduleId)

            // Refresh course data
            const { data } = await courseAPI.getById(id as string)
            const courseData = data.data?.course || data.course || data
            setCourse(courseData)

            setDeleteModuleDialog({ open: false, moduleId: null })
            toast({ title: "Success", description: "Module deleted successfully!" })
        } catch (error) {
            console.error("Failed to delete module:", error)
            toast({ title: "Error", description: "Failed to delete module", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Video Edit/Delete Handlers
    const handleEditVideo = (video: any, moduleId: string) => {
        setEditVideoTitle(video.title || "")
        setEditVideoDesc(video.description || "")
        setEditVideoFreePreview(video.isFreePreview || false)
        setEditVideoFile(null) // Reset file
        setEditVideoDialog({ open: true, video, moduleId })
    }

    const handleSaveVideoEdit = async () => {
        if (!editVideoDialog.video || !editVideoDialog.moduleId || !id) return

        setIsSubmitting(true)
        try {
            let updateData: any = {
                title: editVideoTitle,
                description: editVideoDesc,
                isFreePreview: editVideoFreePreview
            }

            // If a new video file is provided, upload it first
            if (editVideoFile) {
                toast({ title: "Uploading", description: "Uploading new video file..." })

                const videoUrl = await uploadToCloudinary(editVideoFile, 'video', 'learning-platform/videos')
                const publicId = videoUrl.split('/').pop()?.split('.')[0] || "temp-id"

                if (!videoUrl) {
                    throw new Error('Failed to upload video file')
                }

                // Add video URL and publicId to update data
                updateData.videoUrl = videoUrl
                updateData.publicId = publicId
            }

            await courseAPI.updateVideo(
                id as string,
                editVideoDialog.moduleId,
                editVideoDialog.video._id,
                updateData
            )

            // Refresh course data
            const { data } = await courseAPI.getById(id as string)
            const courseData = data.data?.course || data.course || data
            setCourse(courseData)

            setEditVideoDialog({ open: false, video: null, moduleId: null })
            setEditVideoFile(null)
            toast({ title: "Success", description: "Video updated successfully!" })
        } catch (error) {
            console.error("Failed to update video:", error)
            toast({ title: "Error", description: "Failed to update video", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteVideo = async () => {
        if (!deleteVideoDialog.videoId || !deleteVideoDialog.moduleId || !id) return

        setIsSubmitting(true)
        try {
            await courseAPI.deleteVideo(
                id as string,
                deleteVideoDialog.moduleId,
                deleteVideoDialog.videoId
            )

            // Refresh course data
            const { data } = await courseAPI.getById(id as string)
            const courseData = data.data?.course || data.course || data
            setCourse(courseData)

            setDeleteVideoDialog({ open: false, videoId: null, moduleId: null })
            toast({ title: "Success", description: "Video deleted successfully!" })
        } catch (error) {
            console.error("Failed to delete video:", error)
            toast({ title: "Error", description: "Failed to delete video", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!course) return <CourseModulesSkeleton />

    return (
        <>
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
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Module {modIndex + 1}: {mod.title}
                                        </h4>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {mod.videos?.length || 0} video{mod.videos?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditModule(mod)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteModuleDialog({ open: true, moduleId: mod._id })}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
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

                                                    {/* Video Actions */}
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditVideo(video, mod._id)}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeleteVideoDialog({ open: true, videoId: video._id, moduleId: mod._id })}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash className="w-3.5 h-3.5" />
                                                        </Button>
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

            {/* Edit Module Dialog */}
            <Dialog open={editModuleDialog.open} onOpenChange={(open) => !isSubmitting && setEditModuleDialog({ open, module: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Module</DialogTitle>
                        <DialogDescription>Update the module title and description</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-module-title">Module Title</Label>
                            <Input
                                id="edit-module-title"
                                value={editModuleTitle}
                                onChange={(e) => setEditModuleTitle(e.target.value)}
                                placeholder="Enter module title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-module-desc">Description (Optional)</Label>
                            <Textarea
                                id="edit-module-desc"
                                value={editModuleDesc}
                                onChange={(e) => setEditModuleDesc(e.target.value)}
                                placeholder="Enter module description"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModuleDialog({ open: false, module: null })} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveModuleEdit} disabled={isSubmitting || !editModuleTitle.trim()}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Module Confirmation */}
            <AlertDialog open={deleteModuleDialog.open} onOpenChange={(open) => !isSubmitting && setDeleteModuleDialog({ open, moduleId: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Module?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this module and all its videos. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteModule} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Video Dialog */}
            <Dialog open={editVideoDialog.open} onOpenChange={(open) => !isSubmitting && setEditVideoDialog({ open, video: null, moduleId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Video</DialogTitle>
                        <DialogDescription>Update the video details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-video-title">Video Title</Label>
                            <Input
                                id="edit-video-title"
                                value={editVideoTitle}
                                onChange={(e) => setEditVideoTitle(e.target.value)}
                                placeholder="Enter video title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-video-desc">Description (Optional)</Label>
                            <Textarea
                                id="edit-video-desc"
                                value={editVideoDesc}
                                onChange={(e) => setEditVideoDesc(e.target.value)}
                                placeholder="Enter video description"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-video-file">Replace Video File (Optional)</Label>
                            <Input
                                id="edit-video-file"
                                type="file"
                                accept="video/*"
                                onChange={(e) => setEditVideoFile(e.target.files?.[0] || null)}
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-gray-500">
                                Leave empty to keep the current video. Upload a new file to replace it.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-video-preview"
                                checked={editVideoFreePreview}
                                onChange={(e) => setEditVideoFreePreview(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <Label htmlFor="edit-video-preview" className="cursor-pointer">Free Preview</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditVideoDialog({ open: false, video: null, moduleId: null })} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveVideoEdit} disabled={isSubmitting || !editVideoTitle.trim()}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Video Confirmation */}
            <AlertDialog open={deleteVideoDialog.open} onOpenChange={(open) => !isSubmitting && setDeleteVideoDialog({ open, videoId: null, moduleId: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this video. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteVideo} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
