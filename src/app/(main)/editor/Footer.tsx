import { Button } from "@/components/ui/button"
import Link from "next/link"
import { steps } from "./steps"
import { FileUserIcon, PenLineIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface FooterProps {
  currentStep: string
  setCurrentStep: (step: string) => void
  showSmResumePreview: Boolean
  setShowResumePreview: (show: boolean) => void
  isSaving: boolean
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowResumePreview,
  isSaving,
}: FooterProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep)
  const previousStep = currentIndex > 0 ? steps[currentIndex - 1].key : null
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1].key : null

  const [justSaved, setJustSaved] = useState(false)

useEffect(() => {
  let timeout: NodeJS.Timeout

  if (!isSaving) {
    setJustSaved(true)
    timeout = setTimeout(() => setJustSaved(false), 2000)
  } else {
    // safety reset if saving stuck for >10 sec
    timeout = setTimeout(() => {
      setJustSaved(false)
    }, 10000)
  }

  return () => clearTimeout(timeout)
}, [isSaving])


  return (
    <footer className="w-full border-t px-3 py-5 relative">
      <div className="mx-auto max-w-7xl flex items-center justify-between">

        {/* Left: Prev / Next buttons */}
        <div className="flex items-center gap-3">
          <Button
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-black"
            variant="secondary"
            onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
            disabled={!previousStep}
          >
            Previous step
          </Button>
          <Button
            className="bg-blue-700 hover:bg-blue-400 text-white"
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next step
          </Button>
        </div>

        {/* Right: Preview toggle, saving indicator, close button */}
        <div className="flex items-center gap-4 ml-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowResumePreview(!showSmResumePreview)}
            className="md:hidden"
            title={showSmResumePreview ? "Show input form" : "Resume Preview"}
          >
            {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>

          {isSaving && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Saving...</p>
            </div>
          )}

          {!isSaving && justSaved && (
            <p className="text-sm text-green-500">All changes saved ✓</p>
          )}

          <Button
            variant="secondary"
            className="bg-black dark:bg-white text-white dark:text-black"
            asChild
          >
            <Link href="/resumes">Close</Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
