import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-24">
        <div className="container px-4 sm:px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 10, 2024</p>

          <div className="prose prose-sm sm:prose-base prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Welcome to DevSkill</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to our learning community! By using DevSkill, you agree to these simple terms.
                Our goal is to provide a great learning experience for everyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Learning License</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you access our platform, we grant you a personal license to learn. This means:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                <li>You can access and view all course materials for your personal learning.</li>
                <li>Please don't share your account credentials or downloadable content with others.</li>
                <li>Please don't copy or resell our course materials.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Course Access & Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in lifetime value. Once you purchase a course, you get lifetime access to its content,
                including any future updates we add to that specific course.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                We want you to be happy with your learning. If a course isn't right for you,
                you can request a full refund within 30 days of purchase, no questions asked.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Community Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are a small, supportive organization. We ask that you be respectful to instructors
                and fellow students in discussions and reviews. We reserve the right to remove access for abusive behavior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Need Help?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions, run into technical issues, or just need to talk to a human,
                please don't hesitate to reach out.
              </p>
              <div className="mt-4">
                <p className="mb-2">You can email us directly at <a href="mailto:info.nextgensolution90@gmail.com" className="text-primary hover:underline">info.nextgensolution90@gmail.com</a></p>
                <p>Or verify your issue and raise a ticket on our <Link href="/contact" className="text-primary hover:underline font-medium">Support Page</Link>.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
