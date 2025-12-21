import { CategoryCard } from "@/components/ui/category-card"

export function CategoriesSection() {
  const categories = [
    {
      title: "WordPress Development",
      description: "This introductory course is for students who want to learn the basics.",
      icon: "/wordpress-icon.jpg",
      courses: 45,
      students: "12k",
      href: "/courses?category=wordpress",
      bgColor: "bg-blue-50",
    },
    {
      title: "Web Development",
      description: "This Modern course is for students who want to learn web at higher.",
      icon: "/web-development-icon.jpg",
      courses: 78,
      students: "25k",
      href: "/courses?category=web-development",
      bgColor: "bg-purple-50",
    },
    {
      title: "App Development",
      description: "This introductory course is for students who want to build apps.",
      icon: "/app-development-icon.png",
      courses: 32,
      students: "8k",
      href: "/courses?category=app-development",
      bgColor: "bg-green-50",
    },
    {
      title: "Java Script",
      description: "This introductory course is for students who want to learn at higher.",
      icon: "/javascript-icon.jpg",
      courses: 56,
      students: "18k",
      href: "/courses?category=javascript",
      bgColor: "bg-yellow-50",
    },
    {
      title: "IT & Software",
      description: "This Modern course is for students who want to learn at higher.",
      icon: "/it-software-icon.jpg",
      courses: 89,
      students: "30k",
      href: "/courses?category=it-software",
      bgColor: "bg-teal-50",
    },
    {
      title: "Graphics Designer",
      description: "This introductory course is for students who are at higher.",
      icon: "/graphic-design-icon.png",
      courses: 67,
      students: "15k",
      href: "/courses?category=graphics-design",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Browse Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choice Favourite Course
            <br />
            from top category
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors">
            See All Category
          </button>
        </div>
      </div>
    </section>
  )
}
