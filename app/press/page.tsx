
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Newspaper } from "lucide-react"

export default function PressPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 bg-muted/30">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Newspaper className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Press & Media</h1>
                        <p className="text-muted-foreground">
                            For press inquiries, media assets, or interview requests, please contact us at press@example.com.
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
