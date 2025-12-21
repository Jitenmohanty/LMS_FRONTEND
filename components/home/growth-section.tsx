import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export function GrowthSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative bg-teal-100 rounded-3xl overflow-hidden">
              <Image
                src="/student-studying-with-laptop-online-learning.jpg"
                alt="Student learning"
                width={600}
                height={500}
                className="w-full h-auto"
              />

              {/* Stats card */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of active users</p>
                    <p className="text-2xl font-bold text-gray-900">13.5k+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative badge */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center text-white">
                <p className="text-2xl font-bold">5+</p>
                <p className="text-xs">Years</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Growth Skill With Devskill Academy & Accelerate to your Better future
            </h2>

            <p className="text-gray-600">
              Embrace a transformative journey of learning with DevSkill knowledge remains a catalyst for progress.
            </p>

            <p className="text-gray-600">
              Our courses are designed to empower you with the tools and resources to propel yourself towards a brighter
              future. With expert guidance & a supportive community.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/courses">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                  Browse Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
