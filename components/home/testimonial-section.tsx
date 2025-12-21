import Image from "next/image"
import { Star, Quote } from "lucide-react"

export function TestimonialSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            See why We're rated #1 in
            <br />
            Online <span className="text-orange-500">Platform</span> tech
          </h2>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold">CodeLine</div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-orange-200" />

            <p className="text-lg text-gray-600 mb-8 relative z-10">
              "Our dynamic educational platform offers you the tools and resources to propel yourself towards a brighter
              future. With expert guidance & a supportive community."
            </p>

            <div className="flex items-center justify-center gap-4">
              <Image src="/professional-woman-testimonial-avatar.jpg" alt="Reviewer" width={60} height={60} className="rounded-full" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Brianna Butler</p>
                <p className="text-sm text-gray-500">• Digital Marketer</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
