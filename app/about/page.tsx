import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, Award, Globe, Rocket, Heart, Target } from "lucide-react"
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

const values = [
  {
    icon: Rocket,
    title: "Innovation First",
    description: "We constantly push boundaries to bring you the latest learning technologies."
  },
  {
    icon: Heart,
    title: "Student Centric",
    description: "Your success is our prize. We design every course with your growth in mind."
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We never compromise on quality. Our content is curated by industry leaders."
  }
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
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="container relative z-10 px-4 sm:px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Empowering Learners <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-200">Worldwide</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            We are passionate about democratization of education. We believe that quality learning should be accessible, engaging, and transformative for everyone, everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full h-12 px-8 text-base shadow-lg shadow-orange-500/25" asChild>
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded-full h-12 px-8 text-base" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container px-4 md:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Growth Skill With DevSkill Academy & Accelerate to your Better Future
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  DevSkill Academy started with a simple mission: to make quality education accessible to everyone,
                  everywhere. Founded by passionate educators and tech enthusiasts, we have grown from a small startup to
                  a global learning platform.
                </p>
                <p>
                  Our dynamic educational platform offers you the tools and resources to propel yourself towards a
                  brighter future. With expert guidance and a supportive community, we help you achieve your learning
                  goals.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 pt-4">
                {values.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-[2.5rem] rotate-3 opacity-20 blur-2xl"></div>
              <Image
                src="/diverse-students-learning-online-education.jpg"
                alt="Students learning"
                width={800}
                height={800}
                className="relative rounded-[2rem] w-full h-auto object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="absolute inset-0 bg-slate-50/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600 mb-6">
              Our Team
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Meet the Experts Behind DevSkill</h2>
            <p className="text-xl text-gray-500 leading-relaxed">
              Our team of dedicated professionals works tirelessly to bring you the best learning experience possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-100 mb-6">
                  <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-indigo-900/0 transition-colors duration-500 z-10"></div>
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-500 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
          <div className="absolute -top-[50%] -left-[20%] w-[1000px] h-[1000px] rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute top-[20%] -right-[20%] w-[800px] h-[800px] rounded-full bg-teal-500/20 blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of students who are already learning with DevSkill. Access unlimited courses and start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700 rounded-full h-14 px-10 text-lg font-semibold" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
