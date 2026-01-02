import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-24">
        <div className="container px-4 sm:px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 10, 2024</p>

          <div className="prose prose-sm sm:prose-base prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We only collect the information necessary to provide you with a great learning experience.
                This includes basic details like your name and email when you sign up, and course progress data
                to help you track your learning journey.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use It</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reuse your information for one purpose: to make your learning better. This includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                <li>Giving you access to your purchased courses.</li>
                <li>Sending you important updates about your account or courses.</li>
                <li>Improving our platform based on how students use it.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do NOT sell your personal data to anyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take the security of your data seriously. We use industry-standard security measures
                to keep your personal information safe and secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You own your data. If you ever want to see what information we have about you,
                incorrect it, or delete your account entirely, just let us know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about your privacy, we're here to help. Reach out to us at:
              </p>
              <div className="mt-4 border-l-4 border-primary pl-4">
                <p className="font-semibold">DevSkill Impact Team</p>
                <p><a href="mailto:info.nextgensolution90@gmail.com" className="text-primary hover:underline">info.nextgensolution90@gmail.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
