"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoadingButton from "@/components/LoadingButton"
import { PlusSquare } from "lucide-react"
import usePremiumModal from "@/hooks/usePremiumModal"
import { Button } from "@/components/ui/button"

interface ResumesHeaderButtonProps {
  canCreate: boolean
}

export default function ResumesHeaderButton({ canCreate }: ResumesHeaderButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const premiumModal = usePremiumModal()

  const handleClick = () => {
    setLoading(true)
    router.push("/editor")
  }

  if (canCreate) {
    return (
      <LoadingButton
        onClick={handleClick}
        loading={loading}
        variant="outline"
        className="flex items-center justify-center gap-2 rounded-xl border-5 border-blue-900 dark:border-white dark:bg-white dark:text-black text-white hover:bg-white hover:text-black bg-black transition-all whitespace-nowrap h-10 dark:hover:bg-black dark:hover:text-white shadow-md hover:shadow-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:shadow-md dark:hover:shadow-white"
      >
        {!loading && (
          <>
            <PlusSquare className="size-4" />
            <span>Start building your resume!</span>
          </>
        )}
      </LoadingButton>
    )
  }

  return (
    <Button 
      onClick={() => premiumModal.setOpen(true)}
      className="flex items-center justify-center gap-2 rounded-xl border-5 border-blue-900 dark:border-white dark:bg-white dark:text-black text-white hover:bg-white hover:text-black bg-black transition-all whitespace-nowrap h-10 dark:hover:bg-black dark:hover:text-white shadow-md hover:shadow-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:shadow-md dark:hover:shadow-white"
    >
      <PlusSquare className="size-4" />
      <span>Upgrade to Premium</span>
    </Button>
  )
}
