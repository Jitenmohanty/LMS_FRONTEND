export interface ContinueLearningCourse {
  courseId: string
  title: string
  thumbnail: string
  progressPercentage: number
  lastWatchedVideo?: string
  lastVideoTimestamp?: number
  totalVideos: number
  completedVideos: number
}
