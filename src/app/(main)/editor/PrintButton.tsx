"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import React from "react"

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLElement>
  documentTitle?: string
  className?: string
}

export default function PrintButton({ contentRef, documentTitle = "Document", className = "" }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle,
  })

  return (
    <Button
      variant="outline"
      size="icon"
      title="Print Resume"
      onClick={handlePrint}
      className={className}
      type="button"
    >
      <Printer className="size-4" />
    </Button>
  )
}
