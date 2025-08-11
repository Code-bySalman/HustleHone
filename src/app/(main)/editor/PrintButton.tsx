
"use client";

import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLElement>;
  documentTitle?: string;
  className?: string;
}

export default function PrintButton({ contentRef, documentTitle = "Document", className = "" }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef, 
    documentTitle,
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePrint}
      className={cn("transition-opacity", className)}
    >
      <Printer className="size-4" />
    </Button>
  );
}
