"use client"

import { useState, useEffect } from "react"
import { subscriptionAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AdminPlansSkeleton } from "@/components/skeletons/admin-plans-skeleton"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Plan {
    _id: string
    name: string
    price: number
    duration?: number // in days, optional from backend
    billingCycle: string
    description: string
    features: string[]
    isActive: boolean
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

    // Modal State
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "30",
        billingCycle: "monthly",
        description: "",
        features: "",
        isActive: true
    })

    const fetchPlans = async () => {
        setIsLoading(true)
        try {
            const { data } = await subscriptionAPI.getPlans()
            // API response structure: { success: true, data: { plans: [...] } }
            setPlans(data.data.plans || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch plans",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                duration: Number(formData.duration),
                billingCycle: formData.billingCycle,
                description: formData.description,
                features: formData.features.split(",").map((f) => f.trim()).filter((f) => f),
                isActive: formData.isActive
            }

            if (editingPlan) {
                await subscriptionAPI.updatePlan(editingPlan._id, payload)
                toast({ title: "Success", description: "Plan updated successfully" })
            } else {
                await subscriptionAPI.createPlan(payload)
                toast({ title: "Success", description: "Plan created successfully" })
            }

            setIsDialogOpen(false)
            fetchPlans()
            resetForm()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save plan",
                variant: "destructive",
            })
        }
    }

    const confirmDelete = (id: string) => {
        setDeleteId(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            await subscriptionAPI.deletePlan(deleteId)
            toast({ title: "Success", description: "Plan deleted successfully" })
            fetchPlans()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete plan",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
            setIsDeleteModalOpen(false)
            setDeleteId(null)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            duration: "30",
            billingCycle: "monthly",
            description: "",
            features: "",
            isActive: true
        })
        setEditingPlan(null)
    }

    const openEdit = (plan: Plan) => {
        setEditingPlan(plan)

        // Safely handle features which might be a string or array
        const featuresAsString = Array.isArray(plan.features)
            ? plan.features.join(", ")
            : typeof plan.features === 'string'
                ? plan.features
                : "";

        setFormData({
            name: plan.name,
            price: plan.price.toString(),
            duration: plan.duration?.toString() || "30", // Fallback to 30 if undefined
            billingCycle: plan.billingCycle || "monthly",
            description: plan.description || "",
            features: featuresAsString,
            isActive: plan.isActive
        })
        setIsDialogOpen(true)
    }

    if (isLoading) return <AdminPlansSkeleton />

    return (
        <div className="p-6 space-y-6 lg:p-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Plan Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Pro Plan"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief summary of the plan"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (INR)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (Days)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="billingCycle">Billing Cycle</Label>
                                <Select
                                    value={formData.billingCycle}
                                    onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                        <SelectItem value="lifetime">Lifetime</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="features">Features (comma separated)</Label>
                                <Input
                                    id="features"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="e.g. All Courses, Mentorship, Certificate"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="active">Active</Label>
                            </div>
                            <DialogFooter>
                                <Button type="submit">{editingPlan ? "Update" : "Create"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Cycle</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No plans found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => (
                                <TableRow key={plan._id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                                    <TableCell>₹{plan.price}</TableCell>
                                    <TableCell>{plan.duration ? `${plan.duration} days` : "N/A"}</TableCell>
                                    <TableCell className="max-w-[150px] truncate" title={plan.description}>
                                        {plan.description}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {plan.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => confirmDelete(plan._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Plan"
                description="Are you sure you want to delete this subscription plan? This action cannot be undone."
                confirmText="Delete Plan"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    )
}
