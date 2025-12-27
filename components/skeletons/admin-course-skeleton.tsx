
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AdminCourseSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4"
                    >
                        {/* Thumbnail Skeleton */}
                        <Skeleton className="relative w-full md:w-48 h-32 md:h-28 flex-shrink-0 rounded-lg" />

                        {/* Content Skeleton */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex gap-2 mb-1">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-5 w-16" />
                        </div>

                        {/* Actions Skeleton */}
                        <div className="flex items-center gap-2 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-9" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
