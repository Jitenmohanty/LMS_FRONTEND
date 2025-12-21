import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const blogPosts = [
  {
    id: 1,
    title: "10 Tips to Boost Your Learning Efficiency",
    excerpt: "Discover proven strategies to maximize your learning potential and retain information better.",
    image: "/person-studying-efficiently-with-laptop.jpg",
    category: "Learning Tips",
    author: "Sarah Johnson",
    date: "Dec 8, 2024",
    slug: "boost-learning-efficiency",
  },
  {
    id: 2,
    title: "The Future of Online Education in 2025",
    excerpt: "Explore the emerging trends and technologies shaping the future of digital learning.",
    image: "/futuristic-online-education-technology.jpg",
    category: "Industry Trends",
    author: "Michael Chen",
    date: "Dec 5, 2024",
    slug: "future-online-education-2025",
  },
  {
    id: 3,
    title: "How to Build a Successful Career in Web Development",
    excerpt: "A comprehensive guide to starting and growing your career as a web developer.",
    image: "/web-developer-coding-on-multiple-screens.jpg",
    category: "Career",
    author: "Emily Davis",
    date: "Dec 1, 2024",
    slug: "career-web-development",
  },
  {
    id: 4,
    title: "Mastering UI/UX Design: Essential Skills for 2024",
    excerpt: "Learn the key skills every UI/UX designer needs to succeed in today's market.",
    image: "/ux-designer-working-on-wireframes.jpg",
    category: "Design",
    author: "James Wilson",
    date: "Nov 28, 2024",
    slug: "mastering-uiux-design",
  },
  {
    id: 5,
    title: "Why Continuous Learning is Key to Professional Growth",
    excerpt: "Understanding the importance of lifelong learning in today's rapidly changing world.",
    image: "/professional-development-continuous-learning.jpg",
    category: "Career",
    author: "Sarah Johnson",
    date: "Nov 25, 2024",
    slug: "continuous-learning-growth",
  },
  {
    id: 6,
    title: "JavaScript Frameworks Comparison: React vs Vue vs Angular",
    excerpt: "An in-depth comparison to help you choose the right framework for your next project.",
    image: "/javascript-frameworks-comparison-code.jpg",
    category: "Development",
    author: "Michael Chen",
    date: "Nov 20, 2024",
    slug: "javascript-frameworks-comparison",
  },
]

export default function BlogPage() {
  const featuredPost = blogPosts[0]
  const otherPosts = blogPosts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              Our Blog
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Insights & Resources</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights in education and technology.
            </p>
          </div>

          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <Image
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                width={500}
                height={300}
                className="w-full h-64 lg:h-full object-cover"
              />
              <CardContent className="p-6 lg:p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                </div>
                <Button asChild className="w-fit">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Other Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group">
                <div className="overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
