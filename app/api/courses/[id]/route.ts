import { NextResponse } from "next/server"

const coursesData: Record<
  string,
  {
    id: string
    title: string
    slug: string
    description: string
    longDescription: string
    instructor: { id: string; name: string; avatar: string; bio: string; studentCount: number; courseCount: number }
    price: number
    originalPrice: number
    rating: number
    reviewCount: number
    studentCount: number
    duration: string
    level: string
    category: string
    thumbnail: string
    previewVideo: string
    isBestseller: boolean
    lastUpdated: string
    language: string
    features: string[]
    requirements: string[]
    targetAudience: string[]
    modules: Array<{
      id: string
      title: string
      lessons: Array<{
        id: string
        title: string
        duration: string
        type: string
        isPreview: boolean
        videoUrl?: string
      }>
    }>
  }
> = {
  "1": {
    id: "1",
    title: "Learn Figma to DevSkill Cms Beginner to Advanced",
    slug: "learn-figma-devskill",
    description: "Master Figma from scratch and learn to design beautiful user interfaces.",
    longDescription:
      "This comprehensive course will take you from a complete beginner to an advanced Figma user. You'll learn everything from basic shapes and tools to complex prototyping and design systems. By the end of this course, you'll be able to create professional-quality designs for web and mobile applications.",
    instructor: {
      id: "1",
      name: "John Doe",
      avatar: "/instructor-avatar.jpg",
      bio: "Senior UI/UX Designer with 10+ years of experience working with Fortune 500 companies.",
      studentCount: 15000,
      courseCount: 8,
    },
    price: 49,
    originalPrice: 99,
    rating: 4.8,
    reviewCount: 234,
    studentCount: 1234,
    duration: "12 hours",
    level: "Beginner",
    category: "Design",
    thumbnail: "/figma-design-course-thumbnail.jpg",
    previewVideo: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    isBestseller: true,
    lastUpdated: "December 2024",
    language: "English",
    features: [
      "12 hours of on-demand video",
      "45 downloadable resources",
      "Full lifetime access",
      "Access on mobile and desktop",
      "Certificate of completion",
    ],
    requirements: ["No prior Figma experience required", "A computer with internet access", "Free Figma account"],
    targetAudience: [
      "Aspiring UI/UX designers",
      "Web developers who want to learn design",
      "Product managers",
      "Anyone interested in digital design",
    ],
    modules: [
      {
        id: "m1",
        title: "Getting Started with Figma",
        lessons: [
          {
            id: "l1",
            title: "Welcome to the Course",
            duration: "3:45",
            type: "video",
            isPreview: true,
            videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
          },
          {
            id: "l2",
            title: "Installing Figma",
            duration: "5:20",
            type: "video",
            isPreview: true,
            videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
          },
          { id: "l3", title: "Figma Interface Overview", duration: "8:15", type: "video", isPreview: false },
          { id: "l4", title: "Your First Design", duration: "12:30", type: "video", isPreview: false },
          { id: "l5", title: "Module Quiz", duration: "10 questions", type: "quiz", isPreview: false },
        ],
      },
      {
        id: "m2",
        title: "Basic Tools and Shapes",
        lessons: [
          { id: "l6", title: "Working with Frames", duration: "10:00", type: "video", isPreview: false },
          { id: "l7", title: "Shape Tools Deep Dive", duration: "15:45", type: "video", isPreview: false },
          { id: "l8", title: "Text and Typography", duration: "12:20", type: "video", isPreview: false },
          { id: "l9", title: "Colors and Gradients", duration: "9:30", type: "video", isPreview: false },
          { id: "l10", title: "Practice Exercise", duration: "20:00", type: "exercise", isPreview: false },
        ],
      },
      {
        id: "m3",
        title: "Components and Variants",
        lessons: [
          { id: "l11", title: "Introduction to Components", duration: "8:45", type: "video", isPreview: false },
          { id: "l12", title: "Creating Your First Component", duration: "14:20", type: "video", isPreview: false },
          { id: "l13", title: "Component Variants", duration: "18:00", type: "video", isPreview: false },
          { id: "l14", title: "Auto Layout Basics", duration: "16:30", type: "video", isPreview: false },
        ],
      },
      {
        id: "m4",
        title: "Prototyping",
        lessons: [
          { id: "l15", title: "Prototype Basics", duration: "10:15", type: "video", isPreview: false },
          { id: "l16", title: "Interactive Components", duration: "14:00", type: "video", isPreview: false },
          { id: "l17", title: "Smart Animate", duration: "12:45", type: "video", isPreview: false },
          { id: "l18", title: "Final Project", duration: "45:00", type: "project", isPreview: false },
        ],
      },
    ],
  },
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = coursesData[id]

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}
