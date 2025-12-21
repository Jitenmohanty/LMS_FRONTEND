import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What You Looking for?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dynamic educational platform offers you the tools and resources to propel yourself towards a brighter
            future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Teach Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Do You Want Teach Here</h3>
              <p className="text-gray-600 mb-6">
                Our dynamic educational platform offers you the tools and resources to share your knowledge.
              </p>
              <Link href="/become-instructor">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">Get Started</Button>
              </Link>
            </div>
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Teaching"
              width={200}
              height={200}
              className="absolute bottom-0 right-0 opacity-20"
            />
          </div>

          {/* Learn Card */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-7 h-7 text-teal-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Do You Want Learn Here</h3>
              <p className="text-gray-600 mb-6">
                Our dynamic educational platform offers you the lessons to propel yourself towards a brighter future.
              </p>
              <Link href="/courses">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full">Browse Courses</Button>
              </Link>
            </div>
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Learning"
              width={200}
              height={200}
              className="absolute bottom-0 right-0 opacity-20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
