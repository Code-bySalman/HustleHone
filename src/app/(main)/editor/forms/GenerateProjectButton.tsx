import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { generateProject } from "./actions"
import { generateProjectSchema, Project} from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { WandSparklesIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import LoadingButton from "@/components/LoadingButton"
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider"
import usePremiumModal from "@/hooks/usePremiumModal"
import { canUseAITools } from "@/lib/permissions"

interface GenerateProjectButtonProps {
  onProjectGenerated: (project: Project) => void
}

export default function GenerateProjectButton({
  onProjectGenerated
}: GenerateProjectButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false)
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={()=> {
         
          setShowInputDialog(true)}}
      >
        <WandSparklesIcon className="size-4" />
        Smart Fill (AI)
      </Button>

      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onProjectGenerated={(project) => {
          onProjectGenerated(project)
          setShowInputDialog(false)
        }}
      />
    </>
  )
}

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectGenerated: (project: Project) => void
}

function InputDialog({
  open,
  onOpenChange,
  onProjectGenerated
}: InputDialogProps) {
  const { toast } = useToast()

  const form = useForm<{ description: string }>({
    resolver: zodResolver(generateProjectSchema),
    defaultValues: {
      description: ""
    }
  })

  async function onSubmit(input: { description: string }) {
    try {
      const aiResponse = await generateProject(input)
      onProjectGenerated(aiResponse)
    } catch (error) {
      console.error(error)
        toast({
      variant: "destructive",
      className: "bg-red",
      description: error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-black text-black  dark:text-white">
        <DialogHeader>
          <DialogTitle>Generate Project</DialogTitle>
          <DialogDescription>
            Describe your project and the AI will generate a structured entry
            for you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-white text-black"
                      {...field}
                      placeholder={`E.g. "Built a Spotify clone using Next.js and Tailwind..."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting} 
              className="dark:bg-white dark:text-black"
            >
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
