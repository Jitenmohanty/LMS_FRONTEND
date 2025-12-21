"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, CheckCircle, Download, X } from "lucide-react"
import Confetti from "react-confetti"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CourseCompletionModalProps {
    isOpen: boolean
    onClose: () => void
    courseName: string
    certificateId?: string // Optional: if we have it immediately
}

export function CourseCompletionModal({
    isOpen,
    onClose,
    courseName,
    certificateId,
}: CourseCompletionModalProps) {
    const router = useRouter()
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        // Set initial size
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleViewCertificate = () => {
        router.push("/dashboard/certificates")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {isOpen && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center text-green-700">Congratulations!</DialogTitle>
                    <DialogDescription className="text-center text-lg pt-2">
                        You have successfully completed <span className="font-semibold text-gray-900">{courseName}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-muted-foreground">
                        Your certificate of completion is ready. You can view and download it from your dashboard.
                    </p>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Close
                    </Button>
                    <Button onClick={handleViewCertificate} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                        View Certificate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
