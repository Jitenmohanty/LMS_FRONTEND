"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Download, Award, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { certificateAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Certificate } from "@/types/certificate"

export default function CertificatesPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login")
            return
        }

        if (isAuthenticated) {
            const fetchCertificates = async () => {
                try {
                    const { data } = await certificateAPI.getMyCertificates()
                    // Handle various response structures: { data: [...] }, { certificates: [...] }, or just [...]
                    // API response structure: { success: true, data: { certificates: [...] } }
                    // Handle various potential structures for robustness:
                    const responseData = data.data || data
                    const result = Array.isArray(responseData) ? responseData : (responseData.certificates || [])

                    if (Array.isArray(result)) {
                        setCertificates(result)
                    } else {
                        console.warn("API returned non-array data for certificates:", data)
                        setCertificates([])
                    }
                } catch (error) {
                    console.error("Failed to fetch certificates:", error)
                    toast({
                        title: "Error",
                        description: "Failed to load certificates. Please try again.",
                        variant: "destructive",
                    })
                } finally {
                    setLoading(false)
                }
            }
            fetchCertificates()
        }
    }, [authLoading, isAuthenticated, router, toast])

    const handleDownload = (cert: Certificate) => {
        if (cert.pdfUrl) {
            window.open(cert.pdfUrl, "_blank")
        } else {
            window.open(certificateAPI.downloadCertificate(cert.certificateId), "_blank")
        }
    }

    if (authLoading || loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
                <p className="text-muted-foreground">
                    View and download your earned certificates from completed courses.
                </p>
            </div>

            {certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">No Certificates Yet</h2>
                    <p className="text-gray-500 max-w-sm mt-2">
                        Complete courses to earn certificates. Keep learning and tracking your progress!
                    </p>
                    <Button className="mt-6" onClick={() => router.push("/dashboard/courses")}>
                        Go to My Courses
                    </Button>
                </div>
            ) : Array.isArray(certificates) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-video relative bg-slate-100">
                                {cert.course.thumbnail ? (
                                    <Image
                                        src={cert.course.thumbnail}
                                        alt={cert.course.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                                        <Award className="w-16 h-16 text-orange-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleDownload(cert)}
                                        className="gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="line-clamp-1 text-lg" title={cert.course.title}>
                                    {cert.course.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm text-gray-500 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span className="font-mono text-xs">{cert.certificateId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full gap-2" variant="outline" onClick={() => handleDownload(cert)}>
                                    <Download className="w-4 h-4" />
                                    Download Certificate
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
