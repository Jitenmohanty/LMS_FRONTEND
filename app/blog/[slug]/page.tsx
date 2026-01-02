"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

// Static data for the blog posts
const blogPostsData: Record<string, {
    title: string
    subtitle: string
    content: React.ReactNode
    image: string
    category: string
    author: string
    date: string
    readTime: string
}> = {
    "future-of-lms-2025": {
        title: "The Future of Learning Management Systems in 2025",
        subtitle: "AI, Personalization, and the New Era of Corporate Training",
        image: "/futuristic-online-education-technology.jpg",
        category: "Industry Trends",
        author: "Dr. Sarah Chen",
        date: "Jan 15, 2025",
        readTime: "8 min read",
        content: (
            <>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    As we move further into 2025, the landscape of digital learning is undergoing a seismic shift.
                    Learning Management Systems (LMS) are no longer just repositories for courseware; they are evolving into
                    intelligent, adaptive ecosystems that drive organizational growth and individual mastery.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Rise of AI-Driven Personalization</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Artificial Intelligence is at the core of this transformation. Modern LMS platforms are now capable of
                    analyzing a learner's behavior, proficiency, and preferences in real-time. This allows systems to
                    curate personalized learning paths that adapt to the user's pace. Instead of a one-size-fits-all
                    curriculum, employees receive targeted content that addresses their specific skill gaps.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Microlearning and Just-in-Time Training</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Attention spans are shorter, and the need for information is immediate. The future LMS focuses on
                    microlearning—delivering small, bite-sized bursts of information exactly when it's needed. This
                    "flow of work" learning ensures that training is not an interruption but a seamlessly integrated
                    support mechanism for daily tasks.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Immersive Learning Experiences</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Virtual Reality (VR) and Augmented Reality (AR) are moving from niche experiments to mainstream
                    LMS features. For industries like manufacturing, healthcare, and engineering, the ability to
                    simulate dangerous or complex scenarios in a safe virtual environment is a game-changer.
                    In 2025, we expect to see standard LMS platforms offering native support for these immersive modules.
                </p>

                <p className="mb-6 text-lg leading-relaxed text-gray-700 font-medium">
                    The LMS of 2025 is not just a tool; it's a strategic partner in workforce development. Organizations
                    that embrace these intelligent, adaptive systems will see higher engagement, better retention, and
                    faster upskilling of their workforce.
                </p>
            </>
        )
    },
    "creating-engaging-content": {
        title: "How to Create Engaging Course Content",
        subtitle: "Strategies to Keep Learners Motivated and Improve Retention",
        image: "/person-studying-efficiently-with-laptop.jpg",
        category: "Instructional Design",
        author: "Mark Johnson",
        date: "Jan 10, 2025",
        readTime: "6 min read",
        content: (
            <>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    The biggest challenge in online education isn't technology; it's engagement. You can have the best platform
                    in the world, but if your content is dry and uninspiring, learners will tune out. Here are the core principles
                    for creating course content that captivates.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Storytelling is Key</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Humans are wired for stories. Don't just list facts and figures. Frame your lessons around a narrative.
                    Use case studies, real-world examples, and relatable scenarios. specific problem a character is facing,
                    and show how the skills you are teaching provide the solution.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Interactive Elements</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Passive consumption leads to boredom. Interactivity keeps the brain alert. Incorporate quizzes,
                    drag-and-drop exercises, and branched scenarios where learners have to make decisions. Even simple
                    reflection pauses—asking the learner to stop and think about how a concept applies to them—can significantly
                    boost retention.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Visual Variety</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Avoid the "Wall of Text." Mix up your media. unexpected combinations of video, audio, infographics, and text keep the
                    learning experience fresh. Use high-quality visuals to explain complex concepts. A single well-designed
                    diagram can often replace a thousand words of explanation.
                </p>

                <p className="mb-6 text-lg leading-relaxed text-gray-700 font-medium">
                    Remember, your goal is to transform the learner. By focusing on engagement, you respect their time
                    and attention, making the learning journey not just educational, but enjoyable.
                </p>
            </>
        )
    },
    "maximizing-lms-roi": {
        title: "Maximizing ROI with Your Corporate LMS",
        subtitle: "Measuring the True Impact of Learning and Development",
        image: "/professional-development-continuous-learning.jpg",
        category: "Business Strategy",
        author: "Emily Davis",
        date: "Jan 05, 2025",
        readTime: "7 min read",
        content: (
            <>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    investing in a Learning Management System (LMS) is a significant commitment. To justify the
                    expenditure and secure continued budget, L&D leaders must be able to demonstrate a clear Return
                    on Investment (ROI). It's not just about course completion rates; it's about business impact.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Aligning Learning with Business Goals</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    The first step to maximizing ROI is alignment. unexpected disconnect between training programs and business objectives
                    is the most common cause of failure. Before creating a course, ask: What business problem does this solve?
                    Does it reduce support tickets? Increase sales velocity? Improve compliance? Define the metric you want to move
                    before you start teaching.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Moving Beyond Vanity Metrics</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    "Time spent learning" and "number of users logged in" are vanity metrics. They feel good but say little
                    about value. Shift your focus to performance metrics. Look for correlations between training completion
                    and on-the-job performance improvements. For example, did the sales team close more deals after the
                    product training module?
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reducing Operational Costs</h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                    Don't forget the cost savings side of the ROI equation. An effective LMS reduces travel costs,
                    instructor fees, and time away from work. It also automates compliance tracking, saving hundreds of
                    administrative hours. Document these savings meticulously—they are a direct contribution to the bottom line.
                </p>

                <p className="mb-6 text-lg leading-relaxed text-gray-700 font-medium">
                    An LMS is an engine for organizational efficiency. By focusing on alignment, actionable metrics, and
                    cost efficiencies, you can turn your L&D department from a cost center into a strategic profit driver.
                </p>
            </>
        )
    }
}

export default function BlogPostPage() {
    const params = useParams()
    const slug = params.slug as string
    const post = blogPostsData[slug]

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-orange-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            This article is currently being written. Check back later for some insightful content!
                        </p>
                        <Link href="/blog">
                            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 text-base">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
                <div className="container relative z-10 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-start">
                    <Link href="/blog" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-8 transition-colors text-sm font-medium">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>

                    <Badge className="bg-orange-600 text-white border-none mb-6 hover:bg-orange-700">
                        {post.category}
                    </Badge>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-slate-300 mb-8 font-light">
                        {post.subtitle}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-400 border-t border-slate-800 pt-6">
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-500" />
                            {post.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            {post.readTime}
                        </span>
                    </div>
                </div>
            </div>

            <main className="container px-4 sm:px-6 py-12 max-w-4xl mx-auto">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-12">
                    <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-orange-600 hover:prose-a:text-orange-700">
                    {post.content}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Share this article</h4>
                    <div className="flex gap-4">
                        {/* Social share placeholders */}
                        <Button variant="outline" size="sm" className="rounded-full">Twitter</Button>
                        <Button variant="outline" size="sm" className="rounded-full">LinkedIn</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Facebook</Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
