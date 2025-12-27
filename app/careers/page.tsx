
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function CareersPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 bg-muted/30">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Briefcase className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Careers</h1>
                        <p className="text-muted-foreground">
                            We are not hiring at the moment. However, we're always looking for talented individuals. Feel free to send your resume to jobs@example.com.
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
