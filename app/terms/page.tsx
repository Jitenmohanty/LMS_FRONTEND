import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Calendar } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="container relative z-10 px-4 sm:px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. They outline your rights and obligations.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400 bg-slate-800/50 w-fit mx-auto px-4 py-2 rounded-full border border-slate-700">
            <Calendar className="w-4 h-4" />
            <span>Last updated: December 10, 2024</span>
          </div>
        </div>
      </div>

      <main className="py-16 -mt-12 relative z-20">
        <div className="container px-4 sm:px-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="prose prose-lg prose-slate max-w-none space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">1</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Welcome to DevSkill</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  Welcome to our learning community! By using DevSkill, you agree to these simple terms.
                  Our goal is to provide a great learning experience for everyone.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">2</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Learning License</h2>
                </div>
                <div className="pl-12">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    When you access our platform, we grant you a personal license to learn. This means:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>You can access and view all course materials for your personal learning.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>Please don't share your account credentials or downloadable content with others.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>Please don't copy or resell our course materials.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">3</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Course Access & Updates</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  We believe in lifetime value. Once you purchase a course, you get lifetime access to its content,
                  including any future updates we add to that specific course.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">4</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Refunds</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  We want you to be happy with your learning. If a course isn't right for you,
                  you can request a full refund within 30 days of purchase, no questions asked.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">5</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Community Guidelines</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  We are a small, supportive organization. We ask that you be respectful to instructors
                  and fellow students in discussions and reviews. We reserve the right to remove access for abusive behavior.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">6</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Need Help?</h2>
                </div>
                <div className="pl-12">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    If you have any questions, run into technical issues, or just need to talk to a human,
                    please don't hesitate to reach out.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <p className="mb-3 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Email us:</span>
                      <a href="mailto:info.nextgensolution90@gmail.com" className="text-orange-600 hover:text-orange-700 hover:underline">info.nextgensolution90@gmail.com</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Support Center:</span>
                      <Link href="/contact" className="text-orange-600 hover:text-orange-700 hover:underline">Visit Support Page →</Link>
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
