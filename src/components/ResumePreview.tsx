import {  BorderStyles } from "@/app/(main)/editor/BorderStyleButton"
import useDimension from "@/hooks/useDimension"
import { cn } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { MdEmail, MdPhone } from "react-icons/md"

interface ResumePreviewProps {
  resumeData: ResumeValues
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string
}

export default function ResumePreview({ resumeData, className, contentRef }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useDimension(containerRef)

  return (
    <div
      className={cn("bg-white text-black w-full h-full flex items-center justify-center", className)}
      ref={containerRef}
    >
      <div className="w-full max-w-[210mm] aspect-[210/297] bg-white shadow-md overflow-hidden">
        <div
          className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          style={{
            zoom: width ? (1 / 794) * width : 1,
            padding: "1.5rem"
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          <PersonalInfoHeader resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <ProjectSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}


interface ResumeSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    colorHex,
    borderStyle,
    city,
    country,
    phone,
    email,
    linkedin,
    github,
  } = resumeData

  const [photosrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo)

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ""
    if (objectUrl) setPhotoSrc(objectUrl)
    if (photo === null) setPhotoSrc("")
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [photo])

  return (
    <div className="flex flex-col items-center text-center gap-2">
      {photosrc && (
        <Image
          src={photosrc}
          width={100}
          height={100}
          alt="author's photo"
          className="aspect-square object-cover rounded-md left-0"
          style={{borderRadius: borderStyle === BorderStyles.SQUARE ? "0px": borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",}}
        />
      )}

      <div className="space-y-1">
        <p className="text-3xl font-bold"
        style={{color: colorHex}}
        >
          {firstName} {lastName}
        </p>
      </div>

      {/* city + country + phone all in one row */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-700">
        {(city || country) && (
          <span>
            {[city, country].filter(Boolean).join(", ")}
          </span>
        )}
        {phone && (
          <span className="flex items-center gap-1">
            <MdPhone className="text-base" />
            {phone.replace(/^(\+91)?/, "+91 -")}
          </span>
        )}
      </div>

      {/* Email + LinkedIn + GitHub below */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-gray-700">
        {email && (
          <span className="flex items-center gap-1 break-all">
            <MdEmail className="text-base" />
            {email}
          </span>
        )}
        {linkedin && (
          <a
            href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <FaLinkedin className="text-base" />
            {linkedin.replace(/^https?:\/\//, "")}
          </a>
        )}
        {github && (
          <a
            href={github.startsWith("http") ? github : `https://${github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <FaGithub className="text-base" />
            {github.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>
    </div>
  )
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData

  if (!summary) return null

  return (
    <>
      <hr className="border-2 border-black"    style={{color: colorHex}} />
      <div className="space-y-2 mt-6 break-inside-avoid">
        <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700">
          Summary
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">{summary}</p>
      </div>
    </>
  )
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences , colorHex} = resumeData

  if (!workExperiences || workExperiences.length === 0) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr // fallback if not a real date
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <hr className=" border-black"    style={{
        borderColor: colorHex,

      }} />
      <div className="space-y-4 mt-8">
        <h2 
        style={{color: colorHex}}
        className="text-lg font-semibold uppercase tracking-wide text-gray-700">
          Work Experience
        </h2>
        <div className="space-y-4">
          {workExperiences.map((exp, index) => (
            <div key={index} className="space-y-1">
              <div 
              style={{color: colorHex}}
              className="flex justify-between items-center">
                <p className="font-semibold">{exp.position}</p>
                <span 
                style={{color: colorHex}}
                className="text-xs text-gray-500">
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </span>
              </div>
              <p
              style={{color: colorHex}} 
              className="text-sm font-medium text-gray-700">{exp.company}</p>
              <p 
              style={{color: colorHex}}
              className="text-sm text-gray-800">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ProjectSection({ resumeData }: ResumeSectionProps) {
  const { projects, colorHex } = resumeData

  if (!projects || projects.length === 0) return null

  return (
    <>
      <hr className="border-2"    style={{borderColor: colorHex}} />
      <div className="space-y-4 mt-8">
        <h2 
         style={{color: colorHex}}
        className="text-lg font-semibold uppercase tracking-wide text-gray-700">
          Projects
        </h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <p 
                style={{color: colorHex}}
                 className="font-semibold">{project.title}</p>
                {project.link && (
                  <a
                    href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: colorHex}}
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {project.link.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              <p  
              style={{color: colorHex}}
              className="text-sm text-gray-700">{project.description}</p>
              {project.techStack && (
                <p 
                style={{color: colorHex}}
                 className="text-sm text-gray-600 italic">
                  Tech Stack: {project.techStack}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex } = resumeData

  if (!skills || skills.length === 0) return null

  return (
    <>
      <hr className="border-2 border-black"    style={{borderColor: colorHex}}/>
      <div className="space-y-2 mt-8 break-inside-avoid">
        <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700">
          Skills
        </h2>
        <p className="text-sm text-gray-800 ">
          {skills.join(", ")}
        </p>
      </div>
    </>
  )
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations , colorHex} = resumeData

  if (!educations || educations.length === 0) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <hr className="border-2 border-black"    style={{borderColor: colorHex}} />
      <div className="space-y-4 mt-8">
        <h2 
        style={{color: colorHex}}
        className="text-lg font-semibold uppercase tracking-wide text-gray-700">
          Education
        </h2>
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <p 
                style={{color: colorHex}}
                className="font-semibold">{edu.degree}</p>
                <span 
                style={{color: colorHex}}
                className="text-xs text-gray-500">
                  {formatDate(edu.startDate)} -{" "}
                  {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
              </div>
              {edu.college && (
                <p 
                style={{color: colorHex}}
                className="text-sm font-medium text-gray-700">{edu.college}</p>
              )}
              {edu.school && (
                <p 
                style={{color: colorHex}}
                className="text-sm text-gray-800">{edu.school}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
