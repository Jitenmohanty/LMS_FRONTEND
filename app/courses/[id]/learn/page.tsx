"use client"

import { useEffect, useState, useCallback, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCourses, type Video, type Module } from "@/contexts/course-context"
import { useAuth } from "@/contexts/auth-context"
import { canAccessCourse } from "@/lib/course-helper"
import { progressAPI } from "@/lib/api"
import { VideoPlayer } from "@/components/video-player/video-player"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, PlayCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

import { CourseCompletionModal } from "@/components/courses/course-completion-modal"

export default function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { getCourseDetails, activeCourse, fetchVideoUrl, markProgress, isLoading: courseLoading } = useCourses()
  const isLoading = authLoading || courseLoading
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const [initialTime, setInitialTime] = useState(0)

  useEffect(() => {
    const loadCourse = async () => {
      const course = await getCourseDetails(id)

      if (course) {
        // Populate completed videos if the backend returns them
        const completed = new Set<string>()
        course.modules?.forEach(m => {
          m.videos.forEach(v => {
            if (v.completed) completed.add(v.id || (v as any)._id)
          })
        })
        setCompletedVideos(completed)

        if (!authLoading && !canAccessCourse(user, course)) {
          router.replace(`/courses/${id}`)
          return
        }

        // Logic to determine active video:
        // 1. If backend provides lastWatchedVideo, use it.
        // 2. Else find first uncompleted video.
        // 3. Fallback to first video.
        let targetVideo: Video | undefined
        let targetModuleId: string | undefined

        // This relies on backend returning lastWatchedVideoId in the course object or similar
        // For now, let's try to deduce from completed status or if user object has this data
        // Assuming the updated API response from markProgress might be needed, but we are fetching course details here.
        // If the 'course' object has a 'userProgress' field (common pattern), use that.
        const userProgress = (course as any).userProgress
        if (userProgress?.lastWatchedVideo) {
          // Find video by ID
          for (const m of course.modules || []) {
            const v = m.videos.find(v => v.id === userProgress.lastWatchedVideo || (v as any)._id === userProgress.lastWatchedVideo)
            if (v) {
              targetVideo = v
              targetModuleId = m.id
              if (userProgress.lastVideoTimestamp) {
                setInitialTime(userProgress.lastVideoTimestamp)
              }
              break
            }
          }
        }

        // Fallback: Find first uncompleted
        if (!targetVideo) {
          for (const m of course.modules || []) {
            const uncompleted = m.videos.find(v => !completed.has(v.id || (v as any)._id))
            if (uncompleted) {
              targetVideo = uncompleted
              targetModuleId = m.id
              break
            }
          }
        }

        // Fallback: First video
        if (!targetVideo && course.modules?.[0]?.videos?.[0]) {
          targetVideo = course.modules[0].videos[0]
          targetModuleId = course.modules[0].id
        }

        if (targetVideo && targetModuleId) {
          setActiveVideo(targetVideo)
          setActiveModuleId(targetModuleId)
          setExpandedModules(new Set([targetModuleId]))
          const url = await fetchVideoUrl(targetVideo.videoUrl || targetVideo.key || "")
          setVideoUrl(url)
        }
      }
    }
    if (!authLoading) {
      loadCourse()
    }
  }, [id, getCourseDetails, fetchVideoUrl, user, authLoading, router])

  const handleVideoSelect = async (video: Video, moduleId: string) => {
    setActiveVideo(video)
    setActiveModuleId(moduleId)
    const url = await fetchVideoUrl(video.videoUrl || video.key || "")
    setVideoUrl(url)
  }

  const handleVideoComplete = useCallback(async () => {
    if (activeVideo && activeCourse) {
      setCompletedVideos((prev) => new Set([...prev, activeVideo.id]))
      const response = await markProgress(id, activeVideo.id)

      // Check if course is complete
      // We calculate locally + check response triggered certificate
      const totalVideos = activeCourse.modules?.reduce((acc, m) => acc + m.videos.length, 0) || 0
      // We use a functional update for setCompletedVideos, so we need to calculate 'newSize' carefully.
      // Assuming setCompletedVideos update above has been scheduled, let's look at current set size
      // Actually, state update isn't immediate.
      const isAlreadyCompleted = completedVideos.has(activeVideo.id)
      const currentCompletedCount = completedVideos.size + (isAlreadyCompleted ? 0 : 1)

      if (currentCompletedCount >= totalVideos) {
        setShowCompletionModal(true)
      } else if (response && response.certificate) {
        // Fallback: if backend returns certificate object in response (implied completion)
        setShowCompletionModal(true)
      } else if (response && response.progress === 100) {
        setShowCompletionModal(true)
      }
    }
  }, [activeVideo, activeCourse, id, markProgress, completedVideos])

  const getNextVideo = (): { video: Video; moduleId: string } | null => {
    if (!activeCourse?.modules || !activeVideo || !activeModuleId) return null

    const currentModuleIndex = activeCourse.modules.findIndex((m) => m.id === activeModuleId)
    if (currentModuleIndex === -1) return null

    const currentModule = activeCourse.modules[currentModuleIndex]
    const currentVideoIndex = currentModule.videos.findIndex((v) => v.id === activeVideo.id)

    // Check next video in current module
    if (currentVideoIndex < currentModule.videos.length - 1) {
      return {
        video: currentModule.videos[currentVideoIndex + 1],
        moduleId: currentModule.id,
      }
    }

    // Check first video of next module
    if (currentModuleIndex < activeCourse.modules.length - 1) {
      const nextModule = activeCourse.modules[currentModuleIndex + 1]
      if (nextModule.videos.length > 0) {
        return {
          video: nextModule.videos[0],
          moduleId: nextModule.id,
        }
      }
    }

    return null
  }

  const getPreviousVideo = (): { video: Video; moduleId: string } | null => {
    if (!activeCourse?.modules || !activeVideo || !activeModuleId) return null

    const currentModuleIndex = activeCourse.modules.findIndex((m) => m.id === activeModuleId)
    if (currentModuleIndex === -1) return null

    const currentModule = activeCourse.modules[currentModuleIndex]
    const currentVideoIndex = currentModule.videos.findIndex((v) => v.id === activeVideo.id)

    // Check previous video in current module
    if (currentVideoIndex > 0) {
      return {
        video: currentModule.videos[currentVideoIndex - 1],
        moduleId: currentModule.id,
      }
    }

    // Check last video of previous module
    if (currentModuleIndex > 0) {
      const prevModule = activeCourse.modules[currentModuleIndex - 1]
      if (prevModule.videos.length > 0) {
        return {
          video: prevModule.videos[prevModule.videos.length - 1],
          moduleId: prevModule.id,
        }
      }
    }

    return null
  }

  const handleNext = () => {
    const next = getNextVideo()
    if (next) {
      handleVideoSelect(next.video, next.moduleId)
    }
  }

  const handlePrevious = () => {
    const prev = getPreviousVideo()
    if (prev) {
      handleVideoSelect(prev.video, prev.moduleId)
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const getProgress = () => {
    if (!activeCourse?.modules) return 0
    const totalVideos = activeCourse.modules.reduce((acc, m) => acc + m.videos.length, 0)
    return Math.round((completedVideos.size / totalVideos) * 100)
  }

  if (isLoading || !activeCourse) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1 p-6">
            <Skeleton className="aspect-video rounded-2xl" />
          </div>
          <div className="w-80 bg-white p-4">
            <Skeleton className="h-8 w-full mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <Link
          href="/dashboard"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">My Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/courses/${id}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 hidden md:block">
            Course Details
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Home
          </Link>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Video Player */}
        <div className="flex-1 p-4 lg:p-6">
          {videoUrl && activeVideo ? (
            <VideoPlayer
              src={videoUrl}
              title={activeVideo.title}
              description={activeVideo.description}
              onComplete={handleVideoComplete}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={!!getNextVideo()}
              hasPrevious={!!getPreviousVideo()}
              isCompleted={completedVideos.has(activeVideo.id)}
              initialTime={initialTime}
              onHeartbeat={(time) => {
                if (activeVideo && activeCourse) {
                  progressAPI.sendHeartbeat(id, activeVideo.id, time)
                }
              }}
            />
          ) : (
            <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">Select a video to start learning</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto max-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">{activeCourse.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{getProgress()}%</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {(
              activeCourse.modules || [
                {
                  id: "1",
                  title: "Introduction",
                  videos: [
                    {
                      id: "v1",
                      title: "Welcome to the Course",
                      description: "Get started with the course",
                      duration: "5:30",
                      key: "intro",
                    },
                    {
                      id: "v2",
                      title: "Course Overview",
                      description: "What you will learn",
                      duration: "10:15",
                      key: "overview",
                    },
                  ],
                },
                {
                  id: "2",
                  title: "Getting Started",
                  videos: [
                    {
                      id: "v3",
                      title: "Setting Up Environment",
                      description: "Setup your tools",
                      duration: "15:20",
                      key: "setup",
                    },
                    {
                      id: "v4",
                      title: "Understanding Basics",
                      description: "Core concepts",
                      duration: "20:45",
                      key: "basics",
                    },
                  ],
                },
              ]
            ).map((module: Module, moduleIndex: number) => {
              const moduleId = module.id || (module as any)._id
              return (
                <div key={moduleId}>
                  <button
                    onClick={() => toggleModule(moduleId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        Section {moduleIndex + 1}: {module.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {module.videos.filter((v) => completedVideos.has(v.id || (v as any)._id)).length} / {module.videos.length} completed
                      </p>
                    </div>
                    {expandedModules.has(moduleId) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedModules.has(moduleId) && (
                    <div className="bg-gray-50">
                      {module.videos.map((video, videoIndex) => {
                        const videoId = video.id || (video as any)._id
                        const isActive = activeVideo?.id === videoId || (activeVideo as any)?._id === videoId
                        const isCompleted = completedVideos.has(videoId)

                        return (
                          <button
                            key={videoId}
                            onClick={() => handleVideoSelect(video, moduleId)}
                            className={`w-full flex items-center gap-3 p-4 pl-6 text-left transition-colors ${isActive ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-100"
                              }`}
                          >
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isActive ? (
                                <PlayCircle className="w-5 h-5 text-orange-500" />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm truncate ${isActive ? "font-medium text-orange-600" : "text-gray-700"}`}
                              >
                                {moduleIndex + 1}.{videoIndex + 1} {video.title}
                              </p>
                              <p className="text-xs text-gray-500">{video.duration}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {activeCourse && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          courseName={activeCourse.title}
        />
      )}
    </main>
  )
}
