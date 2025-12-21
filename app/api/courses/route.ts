import { NextResponse } from "next/server"

const courses = [
  {
    id: "1",
    title: "Learn Figma to DevSkill Cms Beginner to Advanced",
    slug: "learn-figma-devskill",
    description: "Master Figma from scratch and learn to design beautiful user interfaces.",
    instructor: { id: "1", name: "John Doe", avatar: "/instructor-1.jpg" },
    price: 49,
    originalPrice: 99,
    rating: 4.8,
    reviewCount: 234,
    studentCount: 1234,
    duration: "12 hours",
    level: "Beginner",
    category: "Design",
    thumbnail: "/figma-design-course.jpg",
    isBestseller: true,
    modules: [
      { id: "m1", title: "Introduction to Figma", lessons: 5, duration: "45 min" },
      { id: "m2", title: "Basic Tools & Shapes", lessons: 8, duration: "1h 20min" },
      { id: "m3", title: "Components & Variants", lessons: 6, duration: "1h 10min" },
    ],
  },
  {
    id: "2",
    title: "Create a Digital Illustration With Procreate",
    slug: "digital-illustration-procreate",
    description: "Learn digital illustration techniques using Procreate on iPad.",
    instructor: { id: "2", name: "Jane Smith", avatar: "/instructor-2.jpg" },
    price: 59,
    originalPrice: 89,
    rating: 4.7,
    reviewCount: 189,
    studentCount: 892,
    duration: "8 hours",
    level: "Intermediate",
    category: "Design",
    thumbnail: "/digital-illustration-procreate.jpg",
    isBestseller: false,
    modules: [],
  },
  {
    id: "3",
    title: "Create a perfect career with UI Design Right Place",
    slug: "ui-design-career",
    description: "Build a successful career in UI design with industry-standard practices.",
    instructor: { id: "3", name: "Mike Johnson", avatar: "/instructor-3.jpg" },
    price: 79,
    originalPrice: 149,
    rating: 4.9,
    reviewCount: 312,
    studentCount: 1567,
    duration: "20 hours",
    level: "All Levels",
    category: "Design",
    thumbnail: "/ui-design-career.jpg",
    isBestseller: true,
    modules: [],
  },
  {
    id: "4",
    title: "Leadership and Management Skills Development",
    slug: "leadership-management",
    description: "Develop essential leadership and management skills for your career.",
    instructor: { id: "4", name: "Sarah Wilson", avatar: "/instructor-4.jpg" },
    price: 69,
    originalPrice: 99,
    rating: 4.6,
    reviewCount: 156,
    studentCount: 678,
    duration: "10 hours",
    level: "Intermediate",
    category: "Business",
    thumbnail: "/leadership-management-course.jpg",
    isBestseller: false,
    modules: [],
  },
  {
    id: "5",
    title: "Create a Design System Finish Lab",
    slug: "design-system-lab",
    description: "Learn to create and maintain design systems for large-scale projects.",
    instructor: { id: "2", name: "Jane Smith", avatar: "/instructor-2.jpg" },
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    reviewCount: 201,
    studentCount: 945,
    duration: "15 hours",
    level: "Advanced",
    category: "Design",
    thumbnail: "/design-system-course.jpg",
    isBestseller: true,
    modules: [],
  },
  {
    id: "6",
    title: "Web Development Bootcamp 2024",
    slug: "web-development-bootcamp",
    description: "Complete web development course covering HTML, CSS, JavaScript, React, and Node.js.",
    instructor: { id: "5", name: "Tom Brown", avatar: "/instructor-5.jpg" },
    price: 99,
    originalPrice: 199,
    rating: 4.9,
    reviewCount: 567,
    studentCount: 2345,
    duration: "45 hours",
    level: "Beginner",
    category: "Development",
    thumbnail: "/web-development-bootcamp.png",
    isBestseller: true,
    modules: [],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const level = searchParams.get("level")
  const search = searchParams.get("search")
  const limit = searchParams.get("limit")

  let filteredCourses = [...courses]

  if (category && category !== "all") {
    filteredCourses = filteredCourses.filter((course) => course.category.toLowerCase() === category.toLowerCase())
  }

  if (level && level !== "all") {
    filteredCourses = filteredCourses.filter((course) => course.level.toLowerCase() === level.toLowerCase())
  }

  if (search) {
    filteredCourses = filteredCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (limit) {
    filteredCourses = filteredCourses.slice(0, Number.parseInt(limit))
  }

  return NextResponse.json({
    courses: filteredCourses,
    total: filteredCourses.length,
  })
}
