import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataIncludes } from "@/lib/type";

export const metadata : Metadata = {
  title: "Design your resume",
}
interface PageProps{
  searchParams: Promise<{resumeId?: string}>
}
export default async function Page({searchParams}: PageProps) {
  const {resumeId} = await searchParams

  const {userId} = await auth()
   if(!userId){
    return null;
   }

  const resumeToEdit = resumeId? await prisma.resume.findUnique({
    where: {id: resumeId, userId},
    include: resumeDataIncludes
    
  }):
  null
  return <ResumeEditor
  
  resumeToEdit={resumeToEdit}/>
}