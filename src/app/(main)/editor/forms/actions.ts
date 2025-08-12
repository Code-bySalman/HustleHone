"use server"

import groq from "@/lib/groq"
import { canUseAITools } from "@/lib/permissions"
import { getUserSubscriptionLevel } from "@/lib/subscription"
import { GenerateSummaryInput, generateSummarySchema, generateWorkExperienceSchema, WorkExperience, WorkExperienceInput } from "@/lib/validation"
import { generateProjectSchema, GenerateProjectInput } from "@/lib/validation"
import { auth } from "@clerk/nextjs/server"
export async function generateSummary(input: GenerateSummaryInput) {
   const {userId} = await auth();
    if (!userId) {
      throw new Error("User is not authorized") 
    }
    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    

  const {
    jobTitle,
    workExperiences,
    educations,
    projects,
    skills
  } = generateSummarySchema.parse(input)

  const systemMessage = `
You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
Only return the summary and do not include any other information in the response. Keep it concise and professional.
`

  const userMessage = `
Please generate a professional resume summary from this data:

Job title: ${jobTitle || "N/A"}

Work experience:
${workExperiences
    ?.map(
      (exp) => `
- Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${
        exp.startDate || "N/A"
      } to ${exp.endDate || "Present"}

  Description:
  ${exp.description || "N/A"}
    `
    )
    .join("\n\n") || "N/A"}

Education:
${educations
    ?.map(
      (edu) => `
- Degree: ${edu.degree || "N/A"} from ${edu.college || edu.school || "N/A"} from ${
        edu.startDate || "N/A"
      } to ${edu.endDate || "Present"}
    `
    )
    .join("\n\n") || "N/A"}

Projects:
${projects
    ?.map(
      (project) => `
- Title: ${project.title || "N/A"}
  Description: ${project.description || "N/A"}
  Tech stack: ${project.techStack || "N/A"}
  Duration: ${project.startDate || "N/A"} to ${project.endDate || "Present"}
  Link: ${project.projectUrl || "N/A"}
    `
    )
    .join("\n\n") || "N/A"}

Skills:
${skills?.join(", ") || "N/A"}
`

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192", 
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error("Failed to generate AI response")
  }
  const cleaned = aiResponse.replace(/^Here.*summary:\s*/i, '').trim()
  return cleaned
}

export  async  function generateWorkExperience(
    input: WorkExperienceInput
){
    const {userId} = await auth();
    if (!userId) {
      throw new Error("User is not authorized") 
    }
    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    

    const {description} = generateWorkExperienceSchema.parse(input);

   const systemMessage = `
You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add made-up info.

Job title: <job title>
Company: <company name>
Start date: <format: YYYY-MM-DD> (only if provided)
End date: <format: YYYY-MM-DD> (only if provided)
Description: <an optimized description in bullet format , might be inferred from the job title>
`

const userMessage = `
Please provide a work experience entry from this description:
${description}
` 

 const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192", 
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error("Failed to generate AI response")
  }
  console.log("ai response", aiResponse)
return {
  position: aiResponse.match(/Job title:\s*(.+)/)?.[1] || "",
  company: aiResponse.match(/Company:\s*(.+)/)?.[1] || "",
  description: (aiResponse.match(/Description:\s*([\s\S]+)/)?.[1] || "").trim(),
  startDate: aiResponse.match(/Start date:\s*(\d{4}-\d{2}-\d{2})/)?.[1],
  endDate: aiResponse.match(/End date:\s*(\d{4}-\d{2}-\d{2})/)?.[1],
} satisfies WorkExperience;

}

export async function generateProject(input: GenerateProjectInput) {
   const {userId} = await auth();
    if (!userId) {
      throw new Error("User is not authorized") 
    }
    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
      throw new Error("This feature is only available for premium or premium + users. Please upgrade to use it.");
    }
  const { description } = generateProjectSchema.parse(input)

  const systemMessage = `
You are a job resume generator AI. Your task is to generate a project entry based on the user's description.
Respond strictly in the following format (omit any field that can't be inferred, but DO NOT make stuff up):

Title: <project title>
Description: <short but impressive description>
Tech stack: <comma separated tech stack>
Start date: <YYYY-MM-DD> (optional)
End date: <YYYY-MM-DD> (optional)
Project URL: <link if mentioned>
`

  const userMessage = `
Please generate a project entry based on this description:

"${description}"
`

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) throw new Error("AI failed to respond")

  return {
    title: aiResponse.match(/Title:\s*(.+)/)?.[1] || "",
    description: aiResponse.match(/Description:\s*([\s\S]*?)\n(?:Tech stack|Start date|End date|Project URL)/)?.[1]?.trim() || "",
    techStack: aiResponse.match(/Tech stack:\s*(.+)/)?.[1] || "",
    startDate: aiResponse.match(/Start date:\s*(\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date:\s*(\d{4}-\d{2}-\d{2})/)?.[1],
    projectUrl: aiResponse.match(/Project URL:\s*(.+)/)?.[1] || ""
  }
}