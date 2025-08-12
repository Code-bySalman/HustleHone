import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateWorkExperienceSchema, WorkExperience, WorkExperienceInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import { canUseAITools } from "@/lib/permissions";

import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";



interface GenerateWorkExperienceButtonProps{
    onWorkExperienceGenerated: (workExperience: WorkExperience)=> void;
}

export default  function GenerateWorkExperienceButton({onWorkExperienceGenerated}: GenerateWorkExperienceButtonProps){

   const [showInputDialog, setshowInputDialog] = useState(false);
  const subscriptionLevel =  useSubscriptionLevel();
  const premiumModal = usePremiumModal();
   return <>
   <Button
   variant="outline"
   type="button"
   
   onClick={()=> {
    
   setshowInputDialog(true)
}}>
   <WandSparklesIcon className="size-4"/>
   Smart Fill(AI)
   </Button>
   <InputDialog
   open={showInputDialog}
   onOpenChange={setshowInputDialog}
   onWorkExperienceGenerated={(workExperience)=>{
    onWorkExperienceGenerated(workExperience);
    setshowInputDialog(false)
   }}
   />
   </>
}

interface InputDialogProps{
    open: boolean
    onOpenChange: (open: boolean)=> void;
      onWorkExperienceGenerated: (workExperience: WorkExperience)=> void;
}

export function InputDialog({open, onOpenChange, onWorkExperienceGenerated}: InputDialogProps){
    const {toast} = useToast();

    const form = useForm<WorkExperienceInput>({
        resolver: zodResolver(generateWorkExperienceSchema),
        defaultValues:{
            description: ""
        }
    })

   async function onSubmit(input: WorkExperienceInput) {
  try {
    const aiResponse = await generateWorkExperience(input)
    onWorkExperienceGenerated(aiResponse)
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


    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-black text-white dark:text-white">
            <DialogHeader>
                <DialogTitle>
                    Generate work experience.
                </DialogTitle>
                <DialogDescription>
                    Describe your work experience and the AI will generate an optimized entry for you.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                    control={form.control}
                    name = "description"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                className=" bg-white text-black "
                                {...field}
                                placeholder={`E.g. "from sept. 2019 to march 2022 I worked at a Burger  shop as a waiter, my tasks were...." `}
                                autoFocus
                                />
                            </FormControl>
                            <FormMessage/>
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
}