import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for token refresh with Queue
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loop if the refresh endpoint itself fails
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        // If refresh fails, we can't do anything but redirect or reject
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post("/api/auth/refresh")
        console.log("Refresh token response:", data)
        const newToken = data.data?.accessToken || data.token
        
        if (newToken) {
            localStorage.setItem("token", newToken)
            // Fix: Update default header so subsequent requests use it immediately
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
            
            processQueue(null, newToken)
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
        } else {
             console.error("Failed to extract token from refresh response", data)
             throw new Error("No token returned from refresh")
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) => api.post("/api/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
  refresh: () => api.post("/api/auth/refresh"),
  me: () => api.get("/api/auth/me"),
  googleLogin: () => `${API_URL}/api/auth/google`,
  // OTP & Password Management
  verifyEmail: (data: { email: string; otp: string }) => api.post("/api/auth/verify-email", data),
  resendOtp: (data: { email: string }) => api.post("/api/auth/resend-otp", data),
  forgotPassword: (data: { email: string }) => api.post("/api/auth/forgot-password", data),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => api.post("/api/auth/reset-password", data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => api.post("/api/auth/change-password", data),
}

// User API
export const userAPI = {
  updateProfile: (data: FormData) =>
    api.put("/api/user/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDashboardStats: () => api.get("/api/users/dashboard"),
  getWishlist: () => api.get("/api/users/wishlist"),
  addToWishlist: (courseId: string) => api.post(`/api/users/wishlist/${courseId}`),
  removeFromWishlist: (courseId: string) => api.delete(`/api/users/wishlist/${courseId}`),
  getMyCourses: (userId: string) => api.get("/api/user/courses", { params: { userId } }),
}

// Course API
export const courseAPI = {
  getAll: (params?: { category?: string; search?: string }) => api.get("/api/courses", { params }),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post("/api/courses", data),
  update: (id: string, data: any) => api.put(`/api/courses/${id}`, data),
  delete: (id: string) => api.delete(`/api/courses/${id}`),
  addModule: (id: string, data: any) => api.post(`/api/courses/${id}/modules`, data),
  addVideo: (courseId: string, moduleId: string, data: any) => api.post(`/api/courses/${courseId}/modules/${moduleId}/videos`, data),
  search: (query: string) => api.get(`/api/search?query=${query}`),
  enroll: (courseId: string, data: { userId: string; paymentId?: string }) => api.post(`/api/courses/${courseId}/enroll`, data),
}

// Category API
export const categoryAPI = {
  getAll: () => api.get("/api/categories"),
}

// Video API
export const videoAPI = {
  getStreamUrl: (lessonId: string, userId?: string) => api.get("/api/video/stream", { params: { lessonId, userId } }),
}

// Progress API
export const progressAPI = {
  getProgress: (courseId: string, userId: string) => api.get(`/api/courses/${courseId}/progress`, { params: { userId } }),
  updateProgress: (courseId: string, data: { userId: string; lessonId: string; completed: boolean }) => api.post(`/api/courses/${courseId}/progress`, data),
}

// Bundle API
export const bundleAPI = {
  getAll: () => api.get("/api/bundles"),
  getById: (id: string) => api.get(`/api/bundles/${id}`),
}

// Subscription API
export const subscriptionAPI = {
  getPlans: () => api.get("/api/subscriptions/plans"),
  createPlan: (data: { name: string; price: number; duration: number; billingCycle: string; description: string; features: string[]; isActive: boolean }) =>
    api.post("/api/subscriptions/plans", data),
  updatePlan: (id: string, data: Partial<{ name: string; price: number; duration: number; billingCycle: string; description: string; features: string[]; isActive: boolean }>) =>
    api.put(`/api/subscriptions/plans/${id}`, data),
  deletePlan: (id: string) => api.delete(`/api/subscriptions/plans/${id}`),
  getMySubscription: () => api.get("/api/subscriptions/my"),
}

// Payment API
export const paymentAPI = {
  createOrder: (data: { amount: number; courseId?: string; bundleId?: string; planId?: string; userId?: string; itemType?: string; itemId?: string }) =>
    api.post("/api/payments/create-order", data),
  verify: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post("/api/payments/verify", data),
  getMyPayments: () => api.get("/api/payments/my"),
}

// Review API
export const reviewAPI = {
  getReviews: (courseId: string) => api.get(`/api/reviews/${courseId}`),
  addReview: (data: { courseId: string; rating: number; comment: string }) => api.post("/api/reviews", data),
}

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get("/api/admin/users"),
  blockUser: (userId: string) => api.put(`/api/admin/users/${userId}/block`),
  unblockUser: (userId: string) => api.put(`/api/admin/users/${userId}/unblock`),
  changeUserRole: (userId: string, role: string) => api.put(`/api/admin/users/${userId}/role`, { role }),
  getAllPayments: () => api.get("/api/admin/payments"),
  getDashboardStats: () => api.get("/api/admin/dashboard"),
  getHistory: (status?: string) => api.get("/api/payments/history", { params: { status } }),
  getUser: (userId: string) => api.get(`/api/admin/users/${userId}`),
  grantCourseAccess: (userId: string, courseId: string) => api.post(`/api/admin/users/${userId}/courses/${courseId}/grant`),
  revokeCourseAccess: (userId: string, courseId: string) => api.post(`/api/admin/users/${userId}/courses/${courseId}/revoke`),
}

// Certificate API
export const certificateAPI = {
  getMyCertificates: () => api.get("/api/certificates"),
  downloadCertificate: (id: string) => `${API_URL}/api/certificates/${id}/download`,
  getAllCertificates: () => api.get("/api/certificates/all"),
}

// Upload API
export const uploadAPI = {
  uploadImage: (formData: FormData) => api.post("/api/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  uploadVideo: (formData: FormData) => api.post("/api/upload/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getVideoStreamUrl: (key: string) => api.get(`/api/upload/video/stream/${key}`),
}

export default api
