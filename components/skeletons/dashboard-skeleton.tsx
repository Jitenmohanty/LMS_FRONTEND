
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            {/* Welcome */}
            <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Continue Learning */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                                    <Skeleton className="w-[100px] h-[70px] rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-2 w-full" />
                                    </div>
                                    <Skeleton className="w-24 h-8 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="w-[60px] h-[45px] rounded-lg" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}
