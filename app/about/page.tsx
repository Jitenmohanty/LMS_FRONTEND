import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const stats = [
  { icon: Users, value: "56K+", label: "Active Learners" },
  { icon: BookOpen, value: "170+", label: "Expert Courses" },
  { icon: Award, value: "25+", label: "Years Experience" },
  { icon: Globe, value: "120+", label: "Countries" },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/female-ceo-professional-portrait.jpg",
  },
  {
    name: "Michael Chen",
    role: "Head of Education",
    image: "/male-educator-professional-portrait.jpg",
  },
  {
    name: "Emily Davis",
    role: "Lead Designer",
    image: "/female-designer-professional-portrait.jpg",
  },
  {
    name: "James Wilson",
    role: "Tech Director",
    image: "/male-tech-director-professional-portrait.jpg",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Empowering Learners <span className="text-primary">Worldwide</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We are passionate about empowering learners worldwide with high-quality, accessible and engaging
              education. Our mission is to offer a diverse range of courses that cater to every learning need.
            </p>
            <Button size="lg" asChild>
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
                Our Story
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Growth Skill With DevSkill Academy & Accelerate to your Better Future
              </h2>
              <p className="text-muted-foreground mb-6">
                DevSkill Academy started with a simple mission: to make quality education accessible to everyone,
                everywhere. Founded by passionate educators and tech enthusiasts, we have grown from a small startup to
                a global learning platform.
              </p>
              <p className="text-muted-foreground mb-6">
                Our dynamic educational platform offers you the tools and resources to propel yourself towards a
                brighter future. With expert guidance and a supportive community, we help you achieve your learning
                goals.
              </p>
              <Button variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/diverse-students-learning-online-education.jpg"
                alt="Students learning"
                width={600}
                height={500}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              Our Team
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet the Experts Behind DevSkill</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of dedicated professionals works tirelessly to bring you the best learning experience possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Join thousands of students who are already learning with DevSkill. Start your free trial today.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
