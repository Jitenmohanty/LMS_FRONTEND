
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardCourseSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="space-y-6">
                {/* Tabs Skeleton */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
                    ))}
                </div>

                {/* Course Grid Skeleton */}
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Skeleton className="w-full sm:w-[120px] h-40 sm:h-20 rounded-xl flex-shrink-0" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/3" />

                                    <div className="flex items-center gap-3 my-3">
                                        <Skeleton className="flex-1 h-2" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
