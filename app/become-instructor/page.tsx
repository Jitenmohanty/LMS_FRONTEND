
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users } from "lucide-react"

export default function BecomeInstructorPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 bg-muted/30">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-10 h-10 text-orange-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Become an Instructor</h1>
                        <p className="text-muted-foreground">
                            We are currently updating our instructor application process. Please check back soon!
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    )
}
