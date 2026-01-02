
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function AdminUserDetailSkeleton() {
    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" disabled>
                    <ArrowLeft className="w-5 h-5 text-gray-300" />
                </Button>
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="ml-auto flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full">
                <div className="grid w-full grid-cols-2 lg:w-[400px] mb-6 gap-2">
                    <Skeleton className="h-10 rounded-md" />
                    <Skeleton className="h-10 rounded-md" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Enrolled Courses Card Skeleton */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grant Access Card Skeleton */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            <div className="relative">
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-2">
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
