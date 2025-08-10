import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";
import { canUseAITools } from "@/lib/permissions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";

interface GenerateAISummaryButtonProps{
    resumeData: ResumeValues;
    onSummaryGenerated: (summary: string)=> void

}
export default function GenerateAISummaryButton({resumeData, onSummaryGenerated}: GenerateAISummaryButtonProps){
   const {toast} = useToast();
   const [loading, setloading] = useState(false)
   const subscriptionLevel = useSubscriptionLevel();
   const premiumModal = usePremiumModal();

   async function handleClick() {
       if (!canUseAITools(subscriptionLevel)) {
                   premiumModal.setOpen(true);
                   return;
               }
    try {
        setloading(true)
        const aiResponse = await generateSummary(resumeData);
        onSummaryGenerated(aiResponse);
    } catch (error) {
         toast({
    variant: "destructive",
    className:"bg-red",
    description: error instanceof Error
      ? error.message
      : "Something went wrong. Please try again."
  })
    } finally{
        setloading(false)
    }
   }
    return <LoadingButton
    variant="outline"
    type="button"
    onClick={handleClick}
    loading={loading}
    >
        <WandSparklesIcon className="size-4"/>
        Generate (AI)
    </LoadingButton>
}