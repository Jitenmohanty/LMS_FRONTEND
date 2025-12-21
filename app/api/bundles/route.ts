import { NextResponse } from "next/server"

const bundles = [
  {
    id: "1",
    title: "Complete Web Developer Bundle",
    description: "Everything you need to become a full-stack web developer",
    courses: ["1", "3", "6"],
    courseCount: 3,
    price: 149,
    originalPrice: 297,
    discount: 50,
    thumbnail: "/web-development-bundle.png",
  },
  {
    id: "2",
    title: "UI/UX Design Mastery Bundle",
    description: "Master UI/UX design with this comprehensive bundle",
    courses: ["1", "2", "5"],
    courseCount: 3,
    price: 129,
    originalPrice: 237,
    discount: 45,
    thumbnail: "/ui-ux-design-bundle.jpg",
  },
  {
    id: "3",
    title: "Business & Leadership Bundle",
    description: "Develop essential business and leadership skills",
    courses: ["4"],
    courseCount: 1,
    price: 49,
    originalPrice: 69,
    discount: 30,
    thumbnail: "/business-leadership-bundle.jpg",
  },
]

export async function GET() {
  return NextResponse.json({
    bundles,
    total: bundles.length,
  })
}
