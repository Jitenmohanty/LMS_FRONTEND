"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Shield, ShieldAlert, ShieldCheck, MoreVertical } from "lucide-react"
import { AdminUsersSkeleton } from "@/components/skeletons/admin-users-skeleton"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  isBlocked: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers()
      setUsers(data.data?.users || data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleBlockToggle = async (user: User) => {
    try {
      if (user.isBlocked) {
        await adminAPI.unblockUser(user._id)
        toast({ title: "Success", description: "User unblocked successfully" })
      } else {
        await adminAPI.blockUser(user._id)
        toast({ title: "Success", description: "User blocked successfully" })
      }
      fetchUsers() // Refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const handleRoleChange = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;

    try {
      await adminAPI.changeUserRole(user._id, newRole)
      toast({ title: "Success", description: `User role updated to ${newRole}` })
      fetchUsers()
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to change role" })
    }
  }

  if (isLoading) return <AdminUsersSkeleton />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500">Manage user access and roles.</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/users/${user._id}`} className="font-medium text-gray-900 hover:text-orange-600 hover:underline">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRoleChange(user)}
                        title="Toggle Admin Role"
                      >
                        <Shield className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlockToggle(user)}
                        className={user.isBlocked ? "text-green-600 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
