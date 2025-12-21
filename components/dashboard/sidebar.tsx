"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    BookOpen,
    PlayCircle,
    CreditCard,
    Settings,
    Award,
    Heart,
    Bell,
    LogOut,
    Home,
    Menu,
    ChevronLeft,
    ChevronRight,
    User
} from "lucide-react"

const sidebarItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Continue Learning", href: "/dashboard/continue", icon: PlayCircle },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Certificates", href: "/dashboard/certificates", icon: Award },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardSidebarProps {
    className?: string
    isCollapsed?: boolean // For desktop
    onClose?: () => void // For mobile when clicking a link
}

export function DashboardSidebar({ className, isCollapsed = false, onClose }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <div className={cn("flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300", className)}>
            {/* Profile Section */}
            <div className={cn("p-6 border-b border-gray-200", isCollapsed ? "p-4" : "")}>
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-orange-600 font-bold text-lg">{user?.name?.charAt(0) || "U"}</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-orange-50 text-orange-600 font-medium"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        isCollapsed ? "justify-center px-2" : ""
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "stroke-[2.5px]" : "")} />
                                    {!isCollapsed && <span>{item.name}</span>}

                                    {/* Active Indicator Strip */}
                                    {isActive && !isCollapsed && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-l-full" />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-3 px-3 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors",
                        isCollapsed ? "justify-center px-2" : ""
                    )}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    )
}
