"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { adminAPI, courseAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Shield, Ban, CheckCircle, Search, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUserDetailSkeleton } from "@/components/skeletons/admin-user-detail-skeleton"

interface User {
    _id: string
    name: string
    email: string
    role: "user" | "admin"
    isBlocked: boolean
    createdAt: string
    purchasedCourses: string[] // Array of course IDs
}

interface Course {
    _id: string
    title: string
    price: number
}

export default function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params)
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
    const [allCourses, setAllCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isGranting, setIsGranting] = useState(false)

    // Fetch User Details & All Courses
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, coursesRes] = await Promise.all([
                    adminAPI.getUser(userId),
                    courseAPI.getAll()
                ])

                const userData = userRes.data.data?.user || userRes.data.user || userRes.data
                const coursesData = coursesRes.data.data?.courses || coursesRes.data.courses || []

                setUser(userData)
                setAllCourses(coursesData)

                // Derive enrolled courses from user.purchasedCourses IDs
                // Note: Backend might populate purchasedCourses, but assuming it returns IDs for now based on typical schema
                // If userData.purchasedCourses contains objects, we map differently.
                // Let's handle both.
                const userCourseIds = new Set(
                    Array.isArray(userData.purchasedCourses)
                        ? userData.purchasedCourses.map((c: any) => typeof c === 'string' ? c : c._id)
                        : []
                )

                const enrolled = coursesData.filter((c: Course) => userCourseIds.has(c._id))
                setEnrolledCourses(enrolled)

            } catch (error) {
                console.error("Failed to load data", error)
                toast({
                    title: "Error",
                    description: "Failed to load user details",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [userId])

    const handleGrantAccess = async (courseId: string) => {
        setIsGranting(true)
        try {
            await adminAPI.grantCourseAccess(userId, courseId)
            toast({ title: "Success", description: "Access granted successfully" })

            // Update local state
            const course = allCourses.find(c => c._id === courseId)
            if (course) {
                setEnrolledCourses(prev => [...prev, course])
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to grant access", variant: "destructive" })
        } finally {
            setIsGranting(false)
        }
    }

    const handleRevokeAccess = async (courseId: string) => {
        if (!confirm("Are you sure you want to revoke access to this course?")) return;

        try {
            await adminAPI.revokeCourseAccess(userId, courseId)
            toast({ title: "Success", description: "Access revoked successfully" })

            setEnrolledCourses(prev => prev.filter(c => c._id !== courseId))
        } catch (error) {
            toast({ title: "Error", description: "Failed to revoke access", variant: "destructive" })
        }
    }

    if (isLoading) return <AdminUserDetailSkeleton />
    if (!user) return <div className="p-6">User not found</div>

    const filteredAvailableCourses = allCourses.filter(
        course => !enrolledCourses.find(ec => ec._id === course._id) &&
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto lg:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{user.name}</h1>
                        <p className="text-gray-500 line-clamp-1">{user.email}</p>
                    </div>
                </div>
                <div className="flex gap-2 pl-14 md:pl-0 md:ml-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                </div>
            </div>

            <Tabs defaultValue="courses" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="courses">Course Management</TabsTrigger>
                    <TabsTrigger value="details">Details & Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="courses" className="space-y-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Enrolled Courses */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Enrolled Courses</CardTitle>
                                <CardDescription>Courses this user currently has access to.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {enrolledCourses.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No enrolled courses.</p>
                                ) : (
                                    enrolledCourses.map(course => (
                                        <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                            <span className="font-medium text-sm truncate max-w-[200px]" title={course.title}>{course.title}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRevokeAccess(course._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Grant Access */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Grant Access</CardTitle>
                                <CardDescription>Manually enroll user in a course.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search courses..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                    {filteredAvailableCourses.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No matching courses found.</p>
                                    ) : (
                                        filteredAvailableCourses.map(course => (
                                            <div key={course._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex-1 min-w-0 mr-2">
                                                    <p className="font-medium text-sm truncate">{course.title}</p>
                                                    <p className="text-xs text-gray-500">${course.price}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleGrantAccess(course._id)}
                                                    disabled={isGranting}
                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Grant
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-mono">{user._id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Joined On</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
