"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How do I get started with your product?",
      answer:
        "Sign up on our website, explore features, customize your profile, and start using our products. We're here to help!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Razorpay for seamless payments.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 7-day free trial with full access to all features. No credit card required to start.",
    },
    {
      question: "Is technical support available?",
      answer: "Yes, we provide 24/7 technical support via email, chat, and phone. Our team is always ready to help.",
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your dashboard. No questions asked.",
    },
    {
      question: "Is my data secure with your product?",
      answer: "We use industry-standard encryption and security protocols to protect your data.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left */}
          <div>
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently asked
              <br />
              Questions
            </h2>
            <p className="text-gray-600">
              For any unanswered questions, reach out to our support team via email. We'll respond as soon as possible
              to assist you.
            </p>
          </div>

          {/* Right */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-xl border border-gray-100 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
