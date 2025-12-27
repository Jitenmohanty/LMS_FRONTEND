
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <Skeleton className="h-10 w-full max-w-md" />

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-xl space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                ))}
            </div>
        </div>
    )
}
