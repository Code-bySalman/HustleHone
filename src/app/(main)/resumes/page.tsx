import prisma from "@/lib/prisma"
import { resumeDataIncludes } from "@/lib/type"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import ResumeItem from "./ResumeItem"
import { RedirectToSignIn } from "@clerk/nextjs"
import ResumesHeaderButton from "./ResumesHeaderbutton"
import { getUserSubscriptionLevel } from "@/lib/subscription"
import { canCreateResume } from "@/lib/permissions"

export const metadata: Metadata = {
  title: "Your Resumes",
}

export default async function Page() {
  const { userId } = await auth()

if (!userId) {
  return <RedirectToSignIn />
}
  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataIncludes,
    }),
    prisma.resume.count({
      where: { userId },
    }),
    getUserSubscriptionLevel(userId)
  ])

  return (
    <main className="max-w-9xl mx-auto w-full pl-8 px-3 py-6 space-y-6 bg-white dark:bg-black transition-colors duration-300">
      {/* Centered Loader Button */}
      <div className="w-full flex flex-row justify-center items-center">
        <ResumesHeaderButton 
          canCreate={canCreateResume(subscriptionLevel, totalCount)}
        />
      </div>

      {/* Heading and Count */}
      <div className="space-y-1 pt-4 flex flex-col items-center mb-5">
        <h1 className="text-3xl font-bold text-black dark:text-white">Your Resumes</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Number of resumes: {totalCount}
        </p>
      </div>

      {/* Resume Grid */}
      <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="
              bg-white dark:bg-black
              border border-gray-300 dark:border-gray-600
              rounded-2xl
              shadow-md dark:shadow-lg
              p-8
              transition-transform transition-shadow duration-300 ease-in-out
              hover:scale-[1.03]
              hover:shadow-2xl dark:hover:shadow-2xl
              cursor-pointer
            "
          >
            <ResumeItem resume={resume} />
          </div>
        ))}
      </div>
    </main>
  )
}
