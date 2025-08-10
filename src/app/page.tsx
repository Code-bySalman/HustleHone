"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion } from "framer-motion"
import logo from "@assets/logo.png"
import SplitText from "@/SplitText/SplitText"
import StarBorder from "@/components/StarBorder"

import Iridescence from "@/Iridescence/Iridescence"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  const containerRef = useRef(null)
  const { isSignedIn } = useUser()
  const router = useRouter()

  const handleButtonClick = () => {
    const redirect = "/resumes"
    const query = `?redirectUrl=${encodeURIComponent(redirect)}&redirectUrlComplete=${encodeURIComponent(redirect)}`
    if (isSignedIn) {
      router.push(redirect)
    } else {
      router.push(`/sign-up${query}`)
    }
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 🌀 Background Iridescence */}
      <div className="fixed inset-0 z-0 bg-blue">
        <Iridescence
          color={[0.2, 0.4,0.8]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* 🔥 Foreground Content */}
      <section className="relative z-10 flex flex-col items-center justify-center h-full px-5 text-center space-y-8">
        <div className="w-full flex flex-col items-center space-y-6" ref={containerRef}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 1 }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={150}
              className="mx-auto"
            />
          </motion.div>

          <SplitText
            text="Let your resume do the flexing!"
            className="text-4xl md:text-5xl font-bold text-white p-4"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={() => console.log("All letters have animated!")}
          />

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 2.2 }}
          >
            <Link href="/resumes">
            <StarBorder
              as="button"
              className="custom-class"
              color="cyan"
              speed="5s"
              onClick={handleButtonClick}
            >
              Start building your resume!
            </StarBorder>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
