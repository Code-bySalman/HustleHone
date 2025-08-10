import { z } from 'zod'

export const optionalString = z.string().trim().optional().or(z.literal(""))
export const optionalDate = z.string().optional()

export const generateInfoSchhema = z.object({
  title: optionalString,
  description: optionalString
})

export type GeneralInfoValue = z.infer<typeof generateInfoSchhema>

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      file => !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file"
    )
    .refine(
      file => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB"
    ),
  firstName: optionalString,
  lastName: optionalString,
  email: optionalString,
  phone: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  linkedin: optionalString,
  github: optionalString
})

export type PersonalInfoValue = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
  workExperiences: z.array(
    z.object({
      position: optionalString,
      company: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      description: optionalString
    })
  ).optional()
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>
export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperiences"]>[number];
export const educationSchema = z.object({
  educations: z.array(
    z.object({
      degree: optionalString,
      college: optionalString,
      school: optionalString,
      startDate: optionalString,
      endDate: optionalString
    })
  ).optional()
})

export type EducationValues = z.infer<typeof educationSchema>

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional()
})
export type SkillValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
   summary: optionalString
})
export type SummaryValues = z.infer<typeof summarySchema>

export const projectSchema = z.object({
  projects: z.array(
    z.object({
      title: optionalString,
      description: optionalString,
      techStack: optionalString,
      link: optionalString,
      startDate: optionalDate,
      endDate: optionalDate,
      projectUrl: optionalString
    })
  ).optional()
})

export type ProjectValues = z.infer<typeof projectSchema>

export const resumeSchema = generateInfoSchhema
  .merge(personalInfoSchema)
  .merge(workExperienceSchema)
  .merge(educationSchema)
  .merge(projectSchema)
  .merge(skillsSchema)
  .merge(summarySchema)
  .extend({
    colorHex: optionalString,
    borderStyle: optionalString
  })

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string
  photo: File | string | null
}

export const generateWorkExperienceSchema = z.object({
  description: z.string().trim().min(1, "required").min(20, "Must be atleast 20 characters long."), 
})
export type WorkExperienceInput = z.infer<typeof generateWorkExperienceSchema>

export const generateSummarySchema = z
  .object({
    jobTitle: optionalString
  })
  .merge(workExperienceSchema)
  .merge(educationSchema)
  .merge(projectSchema)
  .merge(skillsSchema)


  export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>

  export const generateProjectSchema = z.object({
  description: z.string().trim().min(10, "Must be at least 10 characters long")
})

export type GenerateProjectInput = z.infer<typeof generateProjectSchema>

