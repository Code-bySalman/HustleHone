import ResumePreview from "@/components/ResumePreview"
import { ResumeValues } from "@/lib/validation"
import ColorPicker from "./ColorPicker"
import BorderStyleButton from "./BorderStyleButton"
import { cn } from "@/lib/utils"

import React from "react"

interface ResumePreviewSectionProps {
  resumeData: ResumeValues
  setResumeData: (data: ResumeValues) => void
  className?: string
  contentRef?: React.RefObject<HTMLDivElement>  // <== here
}


export default function ResumePreviewSection({ resumeData, setResumeData, className, contentRef }: ResumePreviewSectionProps) {
  return (
    <div className={cn("relative hidden md:w-1/2 md:flex w-full flex-col bg-secondary group", className)}>

      <div className="absolute top-3 left-3 flex flex-col gap-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300 ">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({
              ...resumeData,
              colorHex: color.hex
            })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({
              ...resumeData,
              borderStyle
            })
          }
        />
      
      
      </div>

      <div className="flex w-full justify-center overflow-y-auto p-3 ml-2 border-l-2" ref={contentRef}>
        <ResumePreview resumeData={resumeData} className="max-w-2xl shadow-md" />
      </div>
    </div>
  )
}
