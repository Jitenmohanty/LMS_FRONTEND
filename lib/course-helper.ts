import { User } from "@/contexts/auth-context"
import { Course } from "@/contexts/course-context"

/**
 * Checks if a user can access the content of a specific course.
 * 
 * @param user The current user from AuthContext
 * @param course The course object to check access for
 * @returns boolean true if access is allowed, false otherwise
 */
export function canAccessCourse(user: User | null, course: Course): boolean {
  // 1. If course is Free, everyone has access
  if (course.isFree) {
    return true
  }

  // 2. If user is NOT logged in, they can't access paid content
  if (!user) {
    return false
  }

  // 3. If user is Admin/Instructor, allow access
  if (user.role === "admin" || user.role === "instructor") {
    return true
  }

  // 4. Check if user has purchased the course
  // Note: user.purchasedCourses contains an array of course IDs
  // We check against course.id (normalized) and course._id (backend raw) just in case
  const courseId = course.id || course._id || ""
  return user.purchasedCourses?.includes(courseId) || false
}
