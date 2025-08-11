"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteResume } from "@/app/(main)/resumes/action";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

export default function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        setShowDeleteConfirmation(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="transition-opacity" // Removed opacity-0 and group-hover:opacity-100
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white text-black">
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => setShowDeleteConfirmation(true)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={onPrintClick}>
            <Printer className="size-4" />
            Print Resume
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Delete Resume?</DialogTitle>
            <DialogDescription>This will permanently delete your resume.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <LoadingButton variant="destructive" onClick={handleDelete} loading={isPending}>
              Delete Resume
            </LoadingButton>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}