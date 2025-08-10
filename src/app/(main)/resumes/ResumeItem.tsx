"use client"

import { ResumeServerData } from "@/lib/type"
import Link from "next/link"
import { format } from "date-fns"
import ResumePreview from "@/components/ResumePreview"
import { maptoResumeValues } from "@/lib/utils"
import { useRef, useState, useTransition } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Printer, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteResume } from "./action"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingButton from "@/components/LoadingButton"
import {useReactToPrint} from "react-to-print"

interface ResumeItemProps {
  resume: ResumeServerData
}

export default function ResumeItem({ resume }: ResumeItemProps) {

  const contentRef = useRef<HTMLDivElement>(null)

  const reactToPrintFn = useReactToPrint({
    contentRef, 
    documentTitle: resume.title || "Resume"
  })

  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className="group relative border rounded-lg border-transparent hover:border-border transition-colors bg-secondary p-3">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="font-semibold line-clamp-1">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {format(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>

        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={maptoResumeValues(resume)}
            contentRef={contentRef}
            className="overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

          {/* 🔥 Hover Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
              View/Edit Resume
            </span>
          </div>
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn}/>
    </div>
  )
}

interface MoreMenuProps{
    resumeId: string,
    onPrintClick: ()=> void;
}
function MoreMenu({resumeId, onPrintClick}: MoreMenuProps){
   const [showDeleteConfirmation, setshowDeleteConfirmation] = useState(false);

   return <>
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
       <Button 
       variant="ghost"
       size="icon"
       className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
       >
        <MoreVertical className="size-4"/>
       </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-white text-black">
      <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={()=> setshowDeleteConfirmation(true)}
      >
        <Trash2 className="size4 bg"/>
        Delete
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-2"
      onClick={onPrintClick}
      >
     <Printer className="size-4"/>
     Print Resume
      </DropdownMenuItem>
    </DropdownMenuContent>
   </DropdownMenu>
   <DeleteConfirmationDialog 
   resumeId={resumeId}
   open={showDeleteConfirmation}
   onOpenChange={setshowDeleteConfirmation}/>
   </>
}

interface DeleteConfirmationDialogProps{
     resumeId: string
     open:boolean
     onOpenChange: (open:boolean)=> void
}
function DeleteConfirmationDialog({resumeId, onOpenChange,open}: DeleteConfirmationDialogProps){
    const{toast} = useToast()

    const[ispending, startTransition] = useTransition();

    async function handleDelete(){
      startTransition(async ()=>{
        try {
          await deleteResume(resumeId);
          onOpenChange(false)
        } catch (error) {
          console.error(error)
           toast({
        variant: "destructive",
        description: "Something went wrong. Please try again."
      });
        }
      })
    }
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Delete Resume?</DialogTitle>
          <DialogDescription>
            This will permanently delete your resume.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
          variant="destructive"
          onClick={handleDelete}
          loading={ispending}>
            Delete Resume
          </LoadingButton>
          <Button variant="secondary" onClick={()=> onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}