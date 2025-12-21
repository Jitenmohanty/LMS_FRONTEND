import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Star, Users, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-50 blur-xl" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-teal-200 rounded-full opacity-50 blur-xl" />
      <div className="absolute top-40 right-40 w-16 h-16 bg-yellow-200 rounded-full opacity-50 blur-xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-orange-100">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">E-Learning Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart Learning <span className="text-gray-900">Deeper & More</span>
              <br />
              <span className="text-orange-500 relative">
                ~Amazing
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Professionally deploy unique intellectual capital without enterprise-wide e-tailers & data synergy.
              Enthusiastically enable maintainable models.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-14 text-base"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-base group border-gray-300 bg-transparent"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-2 group-hover:bg-orange-600 transition-colors">
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  </div>
                  How it Work
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={`/student-avatar.png?height=40&width=40&query=student avatar ${i}`}
                      alt={`Student ${i}`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">4.9 (2.5k+ Reviews)</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/happy-student-with-books-learning-online-green-bac.jpg"
                alt="Student learning"
                width={500}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Floating cards */}
            <div className="absolute top-20 -left-4 bg-white rounded-xl p-4 shadow-lg animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">250+</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-32 -right-4 bg-white rounded-xl p-4 shadow-lg animate-bounce-slow delay-150">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50k+</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
