import { useToast } from "@/hooks/use-toast"
import useDebounce from "@/hooks/useDebounce"
import { ResumeValues } from "@/lib/validation"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { saveResume } from "./action"
import { Button } from "@/components/ui/button"

export default function useAutoSave(resumeData: ResumeValues) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const debouncedResumeData = useDebounce(resumeData, 2000)

  const [resumeId, setResumeId] = useState(resumeData.id)
  const [lastSavedData, setLastSavedData] = useState(structuredClone(resumeData))
  const [isSaving, setIsSaving] = useState(false)
  const [isError, setIsError] = useState(false)

  const isSamePhoto = (a?: File, b?: File) => {
    if (!a && !b) return true
    if (!a || !b) return false
    return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  }

  const hasChanges = () => {
    const cloneA = structuredClone(debouncedResumeData)
    const cloneB = structuredClone(lastSavedData)

    delete cloneA.photo
    delete cloneB.photo

    const isPhotoSame = isSamePhoto(debouncedResumeData.photo, lastSavedData.photo)

    return JSON.stringify(cloneA) !== JSON.stringify(cloneB) || !isPhotoSame
  }

  useEffect(() => {
    if (!debouncedResumeData || isSaving || isError || !hasChanges()) return

    const save = async () => {
      setIsSaving(true)
      setIsError(false)

      try {
        const newData = structuredClone(debouncedResumeData)

        if (isSamePhoto(newData.photo, lastSavedData.photo)) {
          delete newData.photo
        }

        const updatedResume = await saveResume({
          ...newData,
          id: resumeId,
        })

        setResumeId(updatedResume.id)
        setLastSavedData(structuredClone(debouncedResumeData))

        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set("resumeId", updatedResume.id)

          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}?${newSearchParams.toString()}`
          )
        }
      } catch (error) {
        console.error("Auto save failed:", error)
        setIsError(true)

        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss()
                  setIsError(false)
                }}
              >
                Retry
              </Button>
            </div>
          ),
        })
      } finally {
        setIsSaving(false)
      }
    }

    save()
  }, [debouncedResumeData, isSaving, isError, searchParams, resumeId, lastSavedData, toast])

  const hasUnsavedChanges = (() => {
    const cloneA = structuredClone(resumeData)
    const cloneB = structuredClone(lastSavedData)

    delete cloneA.photo
    delete cloneB.photo

    const isPhotoSame = isSamePhoto(resumeData.photo, lastSavedData.photo)

    return JSON.stringify(cloneA) !== JSON.stringify(cloneB) || !isPhotoSame
  })()

  return {
    isSaving,
    hasUnsavedChanges
  }
}
