"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Learning Management Systems in 2025",
    excerpt: "Discover how AI and adaptive learning are reshaping the landscape of corporate and educational training.",
    image: "/futuristic-online-education-technology.jpg",
    category: "Industry Trends",
    author: "Dr. Sarah Chen",
    date: "Jan 15, 2025",
    slug: "future-of-lms-2025",
  },
  {
    id: 2,
    title: "How to Create Engaging Course Content",
    excerpt: "Learn the secrets to designing courses that keep learners motivated and improve retention rates.",
    image: "/person-studying-efficiently-with-laptop.jpg",
    category: "Instructional Design",
    author: "Mark Johnson",
    date: "Jan 10, 2025",
    slug: "creating-engaging-content",
  },
  {
    id: 3,
    title: "Maximizing ROI with Your Corporate LMS",
    excerpt: "A guide for businesses on how to measure and improve the return on investment of their training programs.",
    image: "/professional-development-continuous-learning.jpg",
    category: "Business Strategy",
    author: "Emily Davis",
    date: "Jan 05, 2025",
    slug: "maximizing-lms-roi",
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="container relative z-10 px-4 sm:px-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-6 border border-orange-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Our Blog
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-200">Resources</span></h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest trends, tips, and insights in education and technology.
          </p>
        </div>
      </div>

      <main className="container px-4 sm:px-6 -mt-16 relative z-20 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-600 text-white hover:bg-orange-700 border-none shadow-lg">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-orange-500" />
                    {post.author}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
