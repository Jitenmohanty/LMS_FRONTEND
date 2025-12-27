
"use client"

import { Bell, FileText, PlayCircle, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotificationsPage() {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500">Stay updated with your courses and achievements.</p>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse" />
                        <div className="absolute inset-2 bg-orange-200 rounded-full animate-pulse delay-75" />
                        <div className="relative bg-white p-4 rounded-full shadow-sm border border-orange-100 flex items-center justify-center h-full w-full">
                            <Bell className="w-10 h-10 text-orange-500" />
                        </div>

                        {/* Floating Icons Animation */}
                        <div className="absolute -top-2 -right-2 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 animate-bounce delay-100">
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 animate-bounce delay-300">
                            <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="absolute top-1/2 -right-8 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 animate-bounce delay-700">
                            <FileText className="w-4 h-4 text-green-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900">Notifications Are Coming Soon!</h2>
                        <p className="text-gray-500 leading-relaxed">
                            We're building a new notification system to help you track:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-2 inline-block text-left bg-gray-50 p-4 rounded-xl border border-gray-100 w-full">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> New course announcements
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Certificate availabilities
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Course updates and new content
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Instructor replies and feedback
                            </li>
                        </ul>
                    </div>

                    <Link href="/dashboard">
                        <Button className="bg-orange-500 hover:bg-orange-600 min-w-[200px]">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
