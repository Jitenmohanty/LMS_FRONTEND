
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CourseModulesSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* Main Form Area Skeleton */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                {/* Module Title Input */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Videos Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-9 w-28" />
                    </div>

                    {/* Video Item Skeletons */}
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-4 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 flex justify-end gap-3">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Existing Modules List Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
}
