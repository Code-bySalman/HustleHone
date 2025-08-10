"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion } from "framer-motion"
import logo from "@assets/logo.png"
import SplitText from "@/SplitText/SplitText"
import StarBorder from "@/components/StarBorder"

import Hyperspeed from "@/Hyperspeed/Hyperspeed"
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
    router.push(`/sign-up${query}`) // You can also direct to sign-in, but sign-up handles both
  }
}


  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 🌀 Background Hyperspeed */}
      <div className="fixed inset-0 z-0 bg-black">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3,
            },
          }}
        />
      </div>

      {/* 🔥 Foreground Content */}
      <section className="relative z-10 flex flex-col items-center justify-center h-full px-5 text-center space-y-8">
        <div className="w-full flex flex-col items-center space-y-6 " ref={containerRef}>
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
