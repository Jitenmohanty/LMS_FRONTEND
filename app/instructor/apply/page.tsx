"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function InstructorApplyPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 lg:py-24">
          <div className="container max-w-lg">
            <Card>
              <CardContent className="pt-6 text-center space-y-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Application Submitted!</h1>
                  <p className="text-muted-foreground">
                    Thank you for applying to become an instructor. We will review your application and get back to you
                    within 3-5 business days.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/">Return to Homepage</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 lg:py-24 bg-muted/30">
        <div className="container max-w-2xl">
          <Link
            href="/instructor"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instructor Page
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Become an Instructor</CardTitle>
              <CardDescription>
                Fill out the form below to apply. We will review your application and get back to you soon.
              </CardDescription>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={() => setStep(2)} className="w-full">
                      Continue
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Professional Background</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="expertise">Area of Expertise</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Web Development</SelectItem>
                          <SelectItem value="design">UI/UX Design</SelectItem>
                          <SelectItem value="mobile">Mobile Development</SelectItem>
                          <SelectItem value="data">Data Science</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your background and expertise..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-transparent"
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)} className="flex-1">
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Course Information</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="courseTitle">Proposed Course Title</Label>
                      <Input id="courseTitle" placeholder="e.g., Complete Web Development Bootcamp" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="courseDescription">Course Description</Label>
                      <Textarea
                        id="courseDescription"
                        placeholder="Describe what students will learn in your course..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Sample Video (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop a sample teaching video, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 100MB</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Instructor Agreement
                        </Link>
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-transparent"
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
