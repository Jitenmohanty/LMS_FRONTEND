"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Camera, Loader2, Plus, Trash, MapPin, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    website: user?.website || "",
    addresses: user?.addresses || [] as any[],
  })

  // Update profile state when user data is available
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        addresses: user.addresses || [],
      }))
    }
  }, [user])

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    courseUpdates: true,
    newCourses: true,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addAddress = () => {
    setProfile({
      ...profile,
      addresses: [...profile.addresses, { street: "", city: "", state: "", zipCode: "", country: "" }],
    })
  }

  const removeAddress = (index: number) => {
    const newAddresses = [...profile.addresses]
    newAddresses.splice(index, 1)
    setProfile({ ...profile, addresses: newAddresses })
  }

  const handleAddressChange = (index: number, field: string, value: string) => {
    const newAddresses = [...profile.addresses]
    newAddresses[index] = { ...newAddresses[index], [field]: value }
    setProfile({ ...profile, addresses: newAddresses })
  }

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", profile.name)
      formData.append("bio", profile.bio)

      // Serialize addresses as nested FormData fields for backend parsing
      profile.addresses.forEach((address, index) => {
        formData.append(`addresses[${index}][street]`, address.street)
        formData.append(`addresses[${index}][city]`, address.city)
        formData.append(`addresses[${index}][state]`, address.state)
        formData.append(`addresses[${index}][zipCode]`, address.zipCode)
        formData.append(`addresses[${index}][country]`, address.country)
      })

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const { userAPI } = await import("@/lib/api")
      await userAPI.updateProfile(formData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Reload to update global user state (avatar in navbar, etc.)
      window.location.reload()
    } catch (error) {
      console.error("Profile update failed:", error)
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const { authAPI } = await import("@/lib/api")
      await authAPI.changePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new
      })
      toast({ title: "Success", description: "Password updated successfully" })
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-full w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto">
          <TabsTrigger value="profile" className="rounded-full">
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-full">
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full">
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 text-center md:text-left">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                  {avatarPreview || user?.avatar ? (
                    <img
                      src={avatarPreview || user?.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-orange-600">{profile.name.charAt(0) || "U"}</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-900">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="h-12 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Addresses Section */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
                <Button variant="outline" size="sm" onClick={addAddress} className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>

              <div className="space-y-6">
                {profile.addresses.map((address: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl relative bg-gray-50">
                    <button
                      onClick={() => removeAddress(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <div className="grid md:grid-cols-2 gap-4 pr-8">
                      <div className="space-y-2">
                        <Label>Street</Label>
                        <Input
                          value={address.street}
                          onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                          placeholder="123 Main St"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Zip Code</Label>
                        <Input
                          value={address.zipCode}
                          onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                          placeholder="Zip Code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={address.country}
                          onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
              <Button
                onClick={handleProfileSave}
                disabled={isLoading}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    className="h-12 rounded-xl pr-10"
                    required
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className="h-12 rounded-xl pr-10"
                    required
                    minLength={8}
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-12 rounded-xl pr-10"
                    required
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

            <div className="space-y-6">
              {[
                {
                  key: "email",
                  label: "Email Notifications",
                  description: "Receive important updates via email",
                },
                {
                  key: "marketing",
                  label: "Marketing Emails",
                  description: "Receive promotions and special offers",
                },
                {
                  key: "courseUpdates",
                  label: "Course Updates",
                  description: "Get notified when courses you're enrolled in are updated",
                },
                {
                  key: "newCourses",
                  label: "New Course Alerts",
                  description: "Be the first to know about new courses",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
