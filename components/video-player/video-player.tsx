"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  PictureInPicture2,
  CheckCircle,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  src: string
  title: string
  description?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  isCompleted?: boolean
  initialTime?: number
  onHeartbeat?: (currentTime: number) => void
}

export function VideoPlayer({
  src,
  title,
  description,
  onProgress,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isCompleted,
  initialTime = 0,
  onHeartbeat,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasCompletedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasSetInitialTime, setHasSetInitialTime] = useState(false)

  // Reset completion status when video changes
  useEffect(() => {
    hasCompletedRef.current = false
    setIsPlaying(false)
    setCurrentTime(0)
    setBuffered(0)
    setHasSetInitialTime(false)
  }, [src])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle Initial Time
  useEffect(() => {
    const video = videoRef.current
    if (video && !hasSetInitialTime && duration > 0 && initialTime > 0) {
      if (initialTime < duration) {
        video.currentTime = initialTime
        setHasSetInitialTime(true)
      }
    }
  }, [duration, initialTime, hasSetInitialTime])

  // Heartbeat logic
  useEffect(() => {
    if (isPlaying && onHeartbeat) {
      heartbeatIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          onHeartbeat(videoRef.current.currentTime)
        }
      }, 30000) // 30 seconds
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
        heartbeatIntervalRef.current = null
      }
    }
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
    }
  }, [isPlaying, onHeartbeat])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          videoRef.current.currentTime -= 10
          break
        case "ArrowRight":
          e.preventDefault()
          videoRef.current.currentTime += 10
          break
        case "ArrowUp":
          e.preventDefault()
          setVolume((v) => Math.min(1, v + 0.1))
          break
        case "ArrowDown":
          e.preventDefault()
          setVolume((v) => Math.max(0, v - 0.1))
          break
        case "KeyM":
          setIsMuted((m) => !m)
          break
        case "KeyF":
          toggleFullscreen()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Update volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const togglePiP = async () => {
    if (!videoRef.current) return
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      await videoRef.current.requestPictureInPicture()
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration
    setCurrentTime(current)

    // Track progress
    const progress = (current / total) * 100
    onProgress?.(progress)

    // Mark as complete at 90%
    if (progress >= 90 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
    }

    // Update buffered
    if (videoRef.current.buffered.length > 0) {
      setBuffered((videoRef.current.buffered.end(0) / total) * 100)
    }
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = (value[0] / 100) * duration
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleEnded = () => {
    setIsPlaying(false)
    onComplete?.()
    // Auto-play next video
    if (hasNext) {
      setTimeout(() => {
        onNext?.()
      }, 2000)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden group"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Play overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <Play className="w-10 h-10 text-white ml-1" />
          </button>
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Completed
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress bar */}
        <div className="relative mb-4">
          <div className="absolute inset-0 h-1 bg-gray-600 rounded-full">
            <div className="h-full bg-gray-500 rounded-full" style={{ width: `${buffered}%` }} />
          </div>
          <Slider
            value={[(currentTime / duration) * 100 || 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Previous */}
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={`text-white ${hasPrevious ? "hover:text-orange-500" : "opacity-50 cursor-not-allowed"}`}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-orange-500">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`text-white ${hasNext ? "hover:text-orange-500" : "opacity-50 cursor-not-allowed"}`}
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-orange-500">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(v) => {
                  setVolume(v[0] / 100)
                  setIsMuted(false)
                }}
                max={100}
                className="w-20"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Settings */}
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-orange-500">
                <Settings className="w-5 h-5" />
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-3 min-w-40">
                  <p className="text-white text-sm mb-2">Playback Speed</p>
                  <div className="flex flex-wrap gap-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate)
                          if (videoRef.current) videoRef.current.playbackRate = rate
                        }}
                        className={`px-2 py-1 rounded text-sm ${playbackRate === rate ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PiP */}
            <button onClick={togglePiP} className="text-white hover:text-orange-500">
              <PictureInPicture2 className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-orange-500">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Video info */}
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-gray-600 mt-2">{description}</p>}
      </div>
    </div>
  )
}
