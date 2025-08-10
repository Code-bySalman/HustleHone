import { Button } from "@/components/ui/button";
import { Circle, Square, Squircle } from "lucide-react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomization } from "@/lib/permissions";

interface BorderStyleButtoProps{
    borderStyle: string | undefined;
    onChange: (borderStyle: string) => void;
}

export const BorderStyles={
  SQUARE: "square",
  CIRCLE:"circle",
  SQUICIRCLE: "squicircle"
}
const borderStyles = Object.values(BorderStyles)
export default function BorderStyleButton({borderStyle, onChange}: BorderStyleButtoProps){
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal()
   function handleClick(){
    if (!canUseCustomization(subscriptionLevel)) {
      premiumModal.setOpen(true)
      return;
    }
     const currentIndex = borderStyle? borderStyles.indexOf(borderStyle) : 0
     const nextIndex = (currentIndex+1) % borderStyles.length
     onChange(borderStyles[nextIndex])
   }
   const Icon = borderStyle === "sqaure"? Square
   : borderStyle==="circle" ? Circle : Squircle;
   return <Button variant="outline" size="icon" title="Change image border stye"  onClick={handleClick}>
    <Icon className="size-4"/>
   </Button>
}