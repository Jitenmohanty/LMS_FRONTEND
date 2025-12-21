import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, DollarSign, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const benefits = [
  {
    icon: Users,
    title: "Reach Millions",
    description: "Access our global community of 56K+ learners eager to learn from experts like you.",
  },
  {
    icon: DollarSign,
    title: "Earn Revenue",
    description: "Set your own prices and earn up to 97% revenue share on your course sales.",
  },
  {
    icon: BookOpen,
    title: "Easy Tools",
    description: "Use our intuitive course builder to create engaging video content with ease.",
  },
  {
    icon: Star,
    title: "Get Support",
    description: "Our team helps you succeed with marketing support and instructor resources.",
  },
]

const steps = [
  { step: 1, title: "Apply to Teach", description: "Submit your application with your expertise and course idea." },
  { step: 2, title: "Create Your Course", description: "Use our tools to build your curriculum and record videos." },
  { step: 3, title: "Launch & Earn", description: "Publish your course and start earning from day one." },
]

const instructors = [
  { name: "John Doe", courses: 8, students: 15000, image: "/instructor-john.jpg" },
  { name: "Jane Smith", courses: 12, students: 22000, image: "/instructor-jane.jpg" },
  { name: "Mike Johnson", courses: 5, students: 8500, image: "/instructor-mike.jpg" },
]

export default function InstructorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
                Become an Instructor
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Share Your Knowledge & <span className="text-primary">Earn Money</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of instructors teaching millions of students on DevSkill. Create courses, build your
                brand, and earn money doing what you love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/instructor/apply">
                    Start Teaching Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/instructor-teaching-online-classroom.jpg"
                alt="Instructor teaching"
                width={600}
                height={500}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Teach on DevSkill?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to create, market, and sell your courses.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to start teaching</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Top Instructors</h2>
            <p className="text-muted-foreground">Learn from the success of our community</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {instructors.map((instructor) => (
              <Card key={instructor.name}>
                <CardContent className="pt-6 text-center">
                  <Image
                    src={instructor.image || "/placeholder.svg"}
                    alt={instructor.name}
                    width={80}
                    height={80}
                    className="mx-auto rounded-full mb-4"
                  />
                  <h3 className="font-semibold">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {instructor.courses} courses | {instructor.students.toLocaleString()} students
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our community of instructors and start earning today. No experience required.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/instructor/apply">Apply Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
