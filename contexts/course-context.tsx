"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { courseAPI, videoAPI, progressAPI, bundleAPI } from "@/lib/api"

export interface Video {
  id: string
  title: string
  description: string
  duration: string
  key?: string
  videoUrl?: string
  completed?: boolean
}

export interface Module {
  id: string
  title: string
  videos: Video[]
}

export interface Course {
  id: string
  _id?: string
  title: string
  description: string
  thumbnail: string
  price: number
  discountPrice?: number
  rating: number
  students: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  instructor: {
    name: string
    avatar: string
  }
  modules?: Module[]
  isFree?: boolean
}

export interface Bundle {
  id: string
  title: string
  description: string
  thumbnail: string
  courses: Course[]
  price: number
  discountPrice: number
}

interface CourseContextType {
  allCourses: Course[]
  myCourses: Course[]
  bundles: Bundle[]
  activeCourse: Course | null
  activeVideo: Video | null
  activeVideoUrl: string | null
  isLoading: boolean
  getCourses: (params?: { category?: string; search?: string }) => Promise<void>
  getCourseDetails: (id: string) => Promise<Course>
  fetchVideoUrl: (key: string) => Promise<string>
  markProgress: (courseId: string, videoId: string) => Promise<any>
  setActiveCourse: (course: Course | null) => void
  setActiveVideo: (video: Video | null) => void
  getBundles: () => Promise<void>
  searchCourses: (query: string) => Promise<Course[]>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }: { children: ReactNode }) {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCourses = useCallback(async (params?: { category?: string; search?: string }) => {
    setIsLoading(true)
    try {
      const { data } = await courseAPI.getAll(params)
      const courses = data.data?.courses || data.courses || data
      if (Array.isArray(courses)) {
        // Normalize _id to id
        const normalizedCourses = courses.map((c: any) => ({
          ...c,
          id: c._id || c.id
        }))
        setAllCourses(normalizedCourses)
      } else {
        console.warn("API returned non-array data for courses:", data)
        setAllCourses([])
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setAllCourses([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCourseDetails = useCallback(async (id: string): Promise<Course> => {
    setIsLoading(true)
    try {
      const { data } = await courseAPI.getById(id)
      const normalizeCourse = (course: any): Course => ({
        ...course,
        id: course._id || course.id,
        modules: course.modules?.map((m: any) => ({
          ...m,
          id: m._id || m.id,
          videos: m.videos?.map((v: any) => ({
            ...v,
            id: v._id || v.id
          })) || []
        })) || []
      })

      const courseData = data.data?.course || data.course || data
      const normalizedCourse = normalizeCourse(courseData)
      setActiveCourse(normalizedCourse)
      return normalizedCourse
    } catch (error) {
      console.error("Failed to fetch course details:", error)
      // Return null or handle error appropriately in UI
      setActiveCourse(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchVideoUrl = useCallback(async (url: string): Promise<string> => {
    setActiveVideoUrl(url)
    return url
  }, [])

  const markProgress = useCallback(async (courseId: string, videoId: string) => {
    try {
      const { data } = await progressAPI.markProgress(courseId, videoId)
      return data
    } catch (error) {
      console.error("Failed to mark progress:", error)
      return null
    }
  }, [])

  const getBundles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await bundleAPI.getAll()
      setBundles(data.data?.bundles || data.bundles || data)
    } catch (error) {
      console.error("Failed to fetch bundles:", error)
      setBundles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchCourses = useCallback(async (query: string): Promise<Course[]> => {
    try {
      const { data } = await courseAPI.search(query)
      const results = data.data?.courses || data.courses || data
      return Array.isArray(results)
        ? results.map((c: any) => ({ ...c, id: c._id || c.id }))
        : []
    } catch (error) {
      console.error("Failed to search courses:", error)
      return []
    }
  }, [])

  return (
    <CourseContext.Provider
      value={{
        allCourses,
        myCourses,
        bundles,
        activeCourse,
        activeVideo,
        activeVideoUrl,
        isLoading,
        getCourses,
        getCourseDetails,
        fetchVideoUrl,
        markProgress,
        setActiveCourse,
        setActiveVideo,
        getBundles,
        searchCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider")
  }
  return context
}

// Dummy data removed
