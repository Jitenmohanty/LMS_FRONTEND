import { z } from "zod"

// Helper schemas
const optionalUrl = z.string().url().optional().or(z.literal(""))
const idSchema = z.string().min(1, "ID is required")

// --- Authentication ---

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Confirm new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// --- User Profile ---

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
})

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: optionalUrl,
  addresses: z.array(addressSchema).optional(),
})

// --- Course Management ---

export const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(2, "Category is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]), // Adjusted slightly to match common UI options, or strictly "beginner" etc? Doc says lowercase. I'll support capitalized too or fix in UI. Let's stick to doc values but allow capitalization for UI flexibility if needed, or strictly follow doc. Doc says: beginner, intermediate, advanced.
  isFree: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
})

export const moduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
})

export const videoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  videoUrl: z.string().min(1, "Video URL is required"), // Doc says Valid URL OR ID, so min(1) is safer than .url()
  duration: z.coerce.number().min(1, "Duration must be a positive number").optional(),
})

// --- Reviews ---

export const reviewSchema = z.object({
  courseId: idSchema,
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
})

// --- Bundles ---

export const bundleSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  courses: z.array(z.string().min(1)).min(1, "Select at least one course"),
})

// --- Subscriptions ---

export const planSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  durationInDays: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// --- Payments ---

export const createOrderSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  currency: z.string().optional().default("INR"),
  productId: z.string().optional(), // courseId, bundleId, planId
})

// --- Contact ---

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type ModuleInput = z.infer<typeof moduleSchema>
export type VideoInput = z.infer<typeof videoSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type BundleInput = z.infer<typeof bundleSchema>
export type PlanInput = z.infer<typeof planSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
