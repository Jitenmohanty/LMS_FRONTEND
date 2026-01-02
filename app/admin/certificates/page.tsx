"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { certificateAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Certificate } from "@/types/certificate"

export default function AdminCertificatesPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
            router.push("/login")
            return
        }

        const fetchCertificates = async () => {
            try {
                const { data } = await certificateAPI.getAllCertificates()
                const result = data.data || data.certificates || data
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

        if (isAuthenticated && user?.role === "admin") {
            fetchCertificates()
        }
    }, [authLoading, isAuthenticated, user, router, toast])

    const handleDownload = (cert: Certificate) => {
        window.open(certificateAPI.downloadCertificate(cert.certificateId), "_blank")
    }

    const filteredCertificates = certificates.filter(
        (cert) =>
            (cert.user as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cert.user as any).email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cert.course as any).title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cert.certificateId as any)?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
                    <p className="text-muted-foreground">Manage and view all issued certificates.</p>
                </div>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Issued Certificates ({certificates.length})</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search certificates..."
                                className="pl-8 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCertificates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No certificates found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCertificates.map((cert) => (
                                    <TableRow key={cert._id}>
                                        <TableCell className="font-mono text-xs">{cert.certificateId}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{(cert.user as any).name || 'Unknown'}</span>
                                                <span className="text-xs text-muted-foreground">{(cert.user as any).email || ''}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={cert.course.title}>
                                            {cert.course.title}
                                        </TableCell>
                                        <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownload(cert)}
                                                title="Download PDF"
                                            >
                                                <Download className="w-4 h-4 text-gray-500 hover:text-orange-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
