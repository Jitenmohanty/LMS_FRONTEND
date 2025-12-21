"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { courseAPI, uploadAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Upload, Plus, Video, Trash, ChevronDown, ChevronUp, Save, ArrowLeft } from "lucide-react"

interface VideoType {
    _id?: string
    id?: string
    title: string
    videoUrl: string
    duration: number
    isFreePreview: boolean
    order: number
}

interface ModuleType {
    _id?: string
    id?: string
    title: string
    order: number
    videos: VideoType[]
}

interface CourseData {
    _id: string
    title: string
    description: string
    price: string
    discountPrice?: string
    category: string
    level: string
    status: "draft" | "published" | "archived"
    thumbnail: string
    banner?: string
    modules: ModuleType[]
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [course, setCourse] = useState<CourseData | null>(null)

    // Details Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        level: "Beginner",
        status: "draft",
    })
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    // Curriculum State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
    const [newModuleTitle, setNewModuleTitle] = useState("")
    const [isAddingModule, setIsAddingModule] = useState(false)

    // Video Upload State
    const [selectedModuleForVideo, setSelectedModuleForVideo] = useState<string | null>(null)
    const [videoForm, setVideoForm] = useState({ title: "", description: "", isFreePreview: false })
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await courseAPI.getById(id)
                const c = data.course || data.data?.course || data
                setCourse(c)
                setFormData({
                    title: c.title,
                    description: c.description,
                    price: c.price.toString(),
                    discountPrice: c.discountPrice?.toString() || "",
                    category: c.category,
                    level: c.level.charAt(0).toUpperCase() + c.level.slice(1), // Capitalize
                    status: c.status || "published" // Default to published if missing
                })
            } catch (error) {
                console.error("Failed to fetch course", error)
                toast({ title: "Error", description: "Failed to load course", variant: "destructive" })
            } finally {
                setIsLoading(false)
            }
        }
        fetchCourse()
    }, [id])

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            let thumbnailUrl = course?.thumbnail
            let bannerUrl = course?.banner

            // Upload new images if selected
            if (thumbnailFile) {
                const fd = new FormData()
                fd.append("file", thumbnailFile)
                const { data } = await uploadAPI.uploadImage(fd)
                thumbnailUrl = data.url || data.fileUrl || data.data?.url
            }
            if (bannerFile) {
                const fd = new FormData()
                fd.append("file", bannerFile)
                const { data } = await uploadAPI.uploadImage(fd)
                bannerUrl = data.url || data.fileUrl || data.data?.url
            }

            const updatePayload = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
                level: formData.level.toLowerCase(),
                thumbnail: thumbnailUrl,
                banner: bannerUrl
            }

            await courseAPI.update(id, updatePayload)
            toast({ title: "Success", description: "Course updated successfully" })
            router.refresh()
        } catch (error) {
            toast({ title: "Error", description: "Failed to update course", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return
        setIsAddingModule(true)
        try {
            // Calculate order
            const order = (course?.modules?.length || 0) + 1
            await courseAPI.addModule(id, { title: newModuleTitle, order })

            toast({ title: "Success", description: "Module added" })
            setNewModuleTitle("")

            // Refresh course data
            const { data } = await courseAPI.getById(id)
            setCourse(data.course || data.data?.course || data)
        } catch (error) {
            toast({ title: "Error", description: "Failed to add module", variant: "destructive" })
        } finally {
            setIsAddingModule(false)
        }
    }

    const handleAddVideo = async () => {
        if (!selectedModuleForVideo || !videoFile || !videoForm.title) return

        setIsUploadingVideo(true)
        try {
            // 1. Upload Video
            const fd = new FormData()
            fd.append("file", videoFile)
            const { data: uploadData } = await uploadAPI.uploadVideo(fd)

            const videoUrl = uploadData.url || uploadData.secure_url || uploadData.data?.url
            const publicId = uploadData.publicId || uploadData.public_id || uploadData.data?.publicId

            if (!videoUrl || !publicId) throw new Error("Video upload failed")

            // 2. Add Video to Module
            // Default order: append to end
            const module = course?.modules.find(m => (m.id || m._id) === selectedModuleForVideo)
            const order = (module?.videos?.length || 0) + 1

            await courseAPI.addVideo(id, selectedModuleForVideo, {
                title: videoForm.title,
                description: videoForm.description,
                videoUrl,
                publicId,
                duration: 0, // Backend might calculate/update later
                isFreePreview: videoForm.isFreePreview,
                order
            })

            toast({ title: "Success", description: "Video added successfully" })
            setVideoForm({ title: "", description: "", isFreePreview: false })
            setVideoFile(null)
            setSelectedModuleForVideo(null)

            // Refresh
            const { data } = await courseAPI.getById(id)
            setCourse(data.course || data.data?.course || data)

        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Failed to upload video", variant: "destructive" })
        } finally {
            setIsUploadingVideo(false)
        }
    }

    if (isLoading || !course) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/courses')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Course: {course.title}</h1>
                    <p className="text-gray-500 text-sm">Manage details, curriculum, and settings.</p>
                </div>
            </div>

            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">Details & Status</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                </TabsList>

                {/* --- DETAILS TAB --- */}
                <TabsContent value="details" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-4">
                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-gray-900">Course Status</h3>
                                <p className="text-sm text-gray-500">Control visibility of your course</p>
                            </div>
                            <Select
                                value={formData.status}
                                onValueChange={(val: any) => setFormData(prev => ({ ...prev, status: val }))}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={val => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Development">Development</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Business">Business</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="h-32"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Level</Label>
                                <Select value={formData.level} onValueChange={val => setFormData({ ...formData, level: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label>Thumbnail</Label>
                                <div className="mt-2 text-sm text-gray-500">Current: {course.thumbnail ? "Set" : "None"}</div>
                                <Input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} className="mt-2" />
                            </div>
                            <div>
                                <Label>Banner</Label>
                                <div className="mt-2 text-sm text-gray-500">Current: {course.banner ? "Set" : "None"}</div>
                                <Input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex justify-end border-t pt-4">
                            <Button type="submit" disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                {/* --- CURRICULUM TAB --- */}
                <TabsContent value="curriculum" className="space-y-6 mt-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Course Curriculum</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Module</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Add New Module</DialogTitle></DialogHeader>
                                <div className="py-4">
                                    <Label>Module Title</Label>
                                    <Input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} placeholder="e.g. Introduction" />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddModule} disabled={isAddingModule}>
                                        {isAddingModule ? "Adding..." : "Add Module"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-4">
                        {course.modules?.length === 0 ? (
                            <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed">No modules yet. Start by adding one.</p>
                        ) : (
                            course.modules?.map((module, mIdx) => (
                                <div key={module._id || module.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    <div
                                        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setActiveModuleId(activeModuleId === (module._id || module.id) ? null : (module._id || module.id || null))}
                                    >
                                        <div className="flex items-center gap-3">
                                            {activeModuleId === (module._id || module.id) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                            <h3 className="font-semibold text-gray-900">{mIdx + 1}. {module.title}</h3>
                                            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">{module.videos?.length || 0} videos</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Add Video Button */}
                                            <Dialog open={selectedModuleForVideo === (module._id || module.id)} onOpenChange={(open) => {
                                                if (!open) setSelectedModuleForVideo(null)
                                                else setSelectedModuleForVideo(module._id || module.id || null)
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedModuleForVideo(module._id || module.id || null) }}>
                                                        <Video className="w-4 h-4 mr-2" /> Add Lesson
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader><DialogTitle>Add Lesson to "{module.title}"</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label>Lesson Title</Label>
                                                            <Input value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Description</Label>
                                                            <Textarea value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Video File</Label>
                                                            <Input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" id="free" checked={videoForm.isFreePreview} onChange={e => setVideoForm({ ...videoForm, isFreePreview: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                            <Label htmlFor="free">Available for Free Preview?</Label>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleAddVideo} disabled={isUploadingVideo} className="bg-orange-500 hover:bg-orange-600">
                                                            {isUploadingVideo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Upload & Save"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>

                                    {/* Video List */}
                                    {activeModuleId === (module._id || module.id) && (
                                        <div className="divide-y divide-gray-100">
                                            {module.videos?.length === 0 ? (
                                                <p className="p-4 text-center text-sm text-gray-500">No videos in this module yet.</p>
                                            ) : (
                                                module.videos?.map((video, vIdx) => (
                                                    <div key={video._id || video.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                                                                {vIdx + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">{video.title}</p>
                                                                <p className="text-xs text-gray-500">Video • {video.isFreePreview ? "Free Preview" : "Locked"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
