# Course Access Control Implementation

## Goal
Implement robust access control logic for courses to ensure only enrolled users, admins, or instructors can access paid course content, while allowing free courses to be accessed by everyone.

## Proposed Changes

### 1. Create Helper Utility
Create a new file `lib/course-helper.ts` (or `utils/course-access.ts`) to centralize the access logic.

#### [NEW] [lib/course-helper.ts](file:///c:/Users/jiten/OneDrive/Desktop/Personal_Project/LMS/lib/course-helper.ts)
```typescript
import { User } from "@/contexts/auth-context" // Check if need to export User from there or define here
import { Course } from "@/contexts/course-context"

export function canAccessCourse(user: User | null, course: Course): boolean {
  if (course.isFree) return true
  if (!user) return false
  if (user.role === 'admin' || user.role === 'instructor') return true
  // Check purchasedCourses (handle potential undefined)
  return user.purchasedCourses?.includes(course.id || course._id || '') || false
}
```

### 2. Update Course Detail Page
Update `app/courses/[id]/page.tsx` to use this helper for the "Start Learning" vs "Enroll Now" button logic.

#### [MODIFY] [app/courses/[id]/page.tsx](file:///c:/Users/jiten/OneDrive/Desktop/Personal_Project/LMS/app/courses/[id]/page.tsx)
- Import `canAccessCourse`.
- Replace inline `isEnrolled` check with `canAccessCourse(user, course)`.

### 3. Update/Implement Learning Page
Ensure `app/courses/[id]/learn/page.tsx` (or whatever the file inside `learn` dir is) uses this check to protect content.

#### [MODIFY] [app/courses/[id]/learn/page.tsx](file:///c:/Users/jiten/OneDrive/Desktop/Personal_Project/LMS/app/courses/[id]/learn/page.tsx)
- Fetch course and user.
- Run `canAccessCourse`.
- If false, redirect to `/courses/[id]` (or show proper "Access Denied" state).

## Verification Plan

### Manual Verification
1.  **Test Free Course**:
    -   Logout.
    -   Go to a free course.
    -   Verify "Start Learning" is visible and clickable.
2.  **Test Paid Course (Not Logged In)**:
    -   Go to a paid course.
    -   Verify "Enroll Now" is visible.
    -   Try to access `/courses/[id]/learn` directly -> Should redirect or deny.
3.  **Test Paid Course (Logged In, Not Purchased)**:
    -   Login as standard user.
    -   Go to paid course.
    -   Verify "Enroll Now".
    -   Try to access `/courses/[id]/learn` -> Should redirect or deny.
4.  **Test Paid Course (Purchased)**:
    -   Buy course (using test flow).
    -   Verify button changes to "Start Learning".
    -   Click "Start Learning" -> Should work.
5.  **Test Admin/Instructor**:
    -   Login as Admin/Instructor.
    -   Verify access to any paid course.
