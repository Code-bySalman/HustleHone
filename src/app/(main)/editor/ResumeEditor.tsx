"use client"

import { useSearchParams } from "next/navigation"
import { steps } from "./steps"
import Breadcrumbs from "./Breadcrumb"
import Footer from "./Footer"
import { useState } from "react"
import { ResumeValues } from "@/lib/validation"
import ResumePreview from "@/components/ResumePreview"
import ResumePreviewSection from "./ResumePreviewSection"
import { cn, maptoResumeValues } from "@/lib/utils"
import useUnloadWarning from "@/hooks/useUnloadWarning"
import useAutoSave from "./useAutoSave"
import { ResumeServerData } from "@/lib/type"

interface ResumeEditorProps{
  resumeToEdit: ResumeServerData | null;
}
export default function ResumeEditor({resumeToEdit}: ResumeEditorProps) {
  const searchParams = useSearchParams()

  const defaultResumeData: ResumeValues = {
    id: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    city: '',
    country: '',
    title: '',
    description: ''
  }

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit? maptoResumeValues(resumeToEdit) : defaultResumeData
  )
  const [showSmResumePreview, setShowResumePreview] = useState(false)
   const{isSaving, hasUnsavedChanges} = useAutoSave(resumeData)
   useUnloadWarning(hasUnsavedChanges)

  const currentStep = searchParams.get("step") || steps[0].key

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState({}, "", `?${newSearchParams.toString()}`)
  }

  const FormComponent = steps.find(step => step.key === currentStep)?.component
  
  return (
    <div className="flex flex-col min-h-screen ">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-3xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. All of your progress will be saved automatically
        </p>
      </header>

   <main className="relative grow flex">
  
  <div className={cn("w-full md:w-1/2  mt-3 border-gray-300 dark:border-gray-600  p-4 space-y-6 border-b-4 md:block ", showSmResumePreview && "hidden")}>
    <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
    {FormComponent && (
      <FormComponent
        resumeData={resumeData}
        setResumeData={setResumeData}
      />
    )}
  </div>

  {/* Right Resume Preview Side */}

 <ResumePreviewSection
 className={cn(showSmResumePreview && "flex")}
  resumeData={resumeData}
  setResumeData={setResumeData}
/>

  

</main>


      <Footer 
  currentStep={currentStep}
  setCurrentStep={setStep}
  showSmResumePreview={showSmResumePreview}
  setShowResumePreview={setShowResumePreview}
  isSaving={isSaving}
/>

    </div>
  )
}
