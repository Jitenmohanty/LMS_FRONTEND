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

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await api.post("/api/auth/refresh")
        console.log("Refresh token response:", data)
        const newToken = data.data?.accessToken || data.token
        
        if (newToken) {
            localStorage.setItem("token", newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
        } else {
             console.error("Failed to extract token from refresh response", data)
             throw new Error("No token returned from refresh")
        }
      } catch (refreshError) {
        localStorage.removeItem("token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
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
}

// User API
export const userAPI = {
  updateProfile: (data: FormData) =>
    api.put("/api/users/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDashboardStats: () => api.get("/api/users/dashboard"),
  getWishlist: () => api.get("/api/users/wishlist"),
  addToWishlist: (courseId: string) => api.post(`/api/users/wishlist/${courseId}`),
  removeFromWishlist: (courseId: string) => api.delete(`/api/users/wishlist/${courseId}`),
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
}

// Video API
export const videoAPI = {
  getStreamUrl: (key: string) => api.get(`/api/video/stream/${key}`),
}

// Progress API
export const progressAPI = {
  markProgress: (courseId: string, videoId: string) => api.post(`/api/progress/${courseId}/${videoId}`),
  getContinueLearning: () => api.get("/api/progress/continue-learning"),
  sendHeartbeat: (courseId: string, videoId: string, timestamp: number) =>
    api.post(`/api/progress/heartbeat/${courseId}/${videoId}`, { timestamp }),
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
