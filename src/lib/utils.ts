import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./type"
import { ResumeValues } from "./validation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maptoResumeValues(data: ResumeServerData): ResumeValues{
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || null,
    firstName: data.firstName || undefined,
     lastName: data.lastName || undefined,
      city: data.city || undefined,
       country: data.country || undefined,
        phone: data.phone || undefined,
         email: data.email || undefined,
         workExperiences: data.workExperiences.map(exp=>({
          position: exp.position ||undefined,
          company: exp.company || undefined,
          startDate: exp.startDate?.toISOString().split("T")[0],
           endDate: exp.endDate?.toISOString().split("T")[0],
           description: exp.description || undefined
         })),
         educations: data.educations.map(edu=>({
          degree: edu.degree || undefined,
          college: edu.college || undefined,
          school: edu.school || undefined,
           startDate: edu.startDate?.toISOString().split("T")[0],
           endDate: edu.endDate?.toISOString().split("T")[0],
           
         })),
         projects: data.projects.map(pro=>({
          title: pro.title || undefined,
          description: pro.description||undefined,
          techStack: pro.description||undefined,
           startDate: pro.startDate?.toISOString().split("T")[0],
           endDate: pro.endDate?.toISOString().split("T")[0],
         })),
         skills: data.skills,
         borderStyle: data.borderStyle,
         colorHex: data.colorHex,
         summary: data.summary || undefined
  }
}