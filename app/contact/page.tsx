"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "info.nextgensolution90@gmail.com",
    subtitle: "We reply within 24 hours",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+91-8338829961",
    subtitle: "Mon-Sat, 9am-6pm IST",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Nilachal Bhaban, B-14 , Dalak, Odagaon , Nayagarh, 752081",
    subtitle: "San Francisco, CA 94102",
    color: "bg-purple-500/10 text-purple-600",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = {
      firstName: (document.getElementById("firstName") as HTMLInputElement).value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      subject: "General Inquiry",
      message: (document.getElementById("message") as HTMLTextAreaElement).value
    }

    try {
      const { contactFormSchema } = await import("@/lib/validations")
      const validatedData = contactFormSchema.parse(formData)

      const { contactAPI } = await import("@/lib/api")
      await contactAPI.sendMessage(validatedData)
      setSubmitted(true)
    } catch (error: any) {
      if (error.issues) {
        const newErrors: any = {}
        error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message
        })
        setErrors(newErrors)
      } else {
        console.error("Failed to send message", error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="container relative z-10 px-4 sm:px-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-6 border border-orange-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-200">Touch</span></h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </div>

      <main className="container px-4 sm:px-6 -mt-16 relative z-20 pb-20">
        {/* Contact Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
              <div className={`mx-auto h-14 w-14 rounded-2xl ${info.color} flex items-center justify-center mb-6`}>
                <info.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 font-medium mb-1">{info.description}</p>
              <p className="text-sm text-gray-500">{info.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Send className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 max-w-sm mx-auto mb-8">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl h-12 px-8"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                    <Input id="firstName" placeholder="John" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" rows={6} className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none p-4" />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/20" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-sm text-center text-gray-500 mt-4">
                  By submitting this form, you agree to our <a href="/terms" className="text-orange-600 hover:underline">Terms of Service</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
