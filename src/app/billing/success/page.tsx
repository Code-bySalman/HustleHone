"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import StarBorder from "@/components/StarBorder"

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white dark:bg-black transition-colors duration-300">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="mb-6"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 dark:text-green-400 drop-shadow-lg" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-black dark:text-white"
      >
        Payment Successful 🎉
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-lg"
      >
        Your subscription is now active. Thank you for supporting HustleHone.  
        You’re officially on the fast track to creating a killer resume.
      </motion.p>

      {/* StarBorder Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8"
      >
        <Link href="/resumes">
          <StarBorder
            as="button"
            color="cyan"
            speed="5s"
            className="custom-class"
          >
            Go to Resumes
          </StarBorder>
        </Link>
      </motion.div>
    </main>
  )
}
