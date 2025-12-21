import { BookOpen, Users, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: BookOpen,
      value: "25+",
      label: "Years of Learning Education Experience",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      icon: Users,
      value: "56k",
      label: "Students Enrolled in DevSkill Courses",
      color: "text-teal-500",
      bgColor: "bg-teal-100",
    },
    {
      icon: Award,
      value: "170+",
      label: "Experienced Teacher's available",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are passionate about empowering learners <span className="font-semibold text-gray-900">Worldwide</span>{" "}
            with high-quality, accessible & engaging education. Our mission offering a diverse range of courses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
