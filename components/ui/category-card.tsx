import Link from "next/link"
import Image from "next/image"

interface CategoryCardProps {
  title: string
  description: string
  icon: string
  courses: number
  students: string
  href: string
  bgColor: string
}

export function CategoryCard({ title, description, icon, courses, students, href, bgColor }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div
        className={`${bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full`}
      >
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
          <Image src={icon || "/placeholder.svg"} alt={title} width={32} height={32} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{courses}+ Courses</span>
          <span>{students} Students</span>
        </div>
      </div>
    </Link>
  )
}
