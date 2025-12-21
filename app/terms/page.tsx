import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 10, 2024</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using DevSkill, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily access the materials on DevSkill for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this license
                you may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Course Access</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upon purchasing a course, you are granted lifetime access to the course content. This access is for
                personal use only and may not be shared with others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 30-day money-back guarantee on all course purchases. If you are not satisfied with your
                purchase, you may request a full refund within 30 days of the purchase date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use the platform for any unlawful purpose or any purpose prohibited under this clause.
                You agree not to use the platform in any way that could damage, disable, or impair the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <Link href="mailto:support@devskill.com" className="text-primary hover:underline">
                  support@devskill.com
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
