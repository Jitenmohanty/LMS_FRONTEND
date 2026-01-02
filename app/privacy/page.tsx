import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Calendar } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="container relative z-10 px-4 sm:px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We value your trust and are committed to protecting your personal information.
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
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  We only collect the information necessary to provide you with a great learning experience.
                  This includes basic details like your name and email when you sign up, and course progress data
                  to help you track your learning journey.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">2</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use It</h2>
                </div>
                <div className="pl-12">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We reuse your information for one purpose: to make your learning better. This includes:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>Giving you access to your purchased courses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>Sending you important updates about your account or courses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span>Improving our platform based on how students use it.</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-orange-800 text-sm font-medium">
                      We do NOT sell your personal data to anyone.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">3</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Data Security</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  We take the security of your data seriously. We use industry-standard security measures
                  to keep your personal information safe and secure.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">4</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Your Rights</h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-12">
                  You own your data. If you ever want to see what information we have about you,
                  incorrect it, or delete your account entirely, just let us know.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">5</span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Contact Us</h2>
                </div>
                <div className="pl-12">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    If you have any questions about your privacy, we're here to help. Reach out to us at:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">DevSkill Impact Team</p>
                    <a href="mailto:info.nextgensolution90@gmail.com" className="text-orange-600 hover:text-orange-700 hover:underline">info.nextgensolution90@gmail.com</a>
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
