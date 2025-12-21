import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { CoursesSection } from "@/components/home/courses-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { GrowthSection } from "@/components/home/growth-section"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { FAQSection } from "@/components/home/faq-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CoursesSection />
        <CategoriesSection />
        <GrowthSection />
        <TestimonialSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
