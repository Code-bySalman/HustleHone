"use client"
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { set } from "date-fns";

import { createCheckoutSession } from "./actions";
import { env } from "@/env";

export const premiumFeatures = [
  "AI-powered resume suggestions tailored to your job title",
  "Generate a professional summary instantly with AI",
  "Upto 3 resumes generation"
]

export const premiumPlusFeatures = [
    "Unlimeted resume generation",
  
  "Instant keyword optimization for ATS-friendly resumes",
  "Multiple AI-generated summary variations to choose from"
]
 
export default function PremiumModal() {
    const { open, setOpen } = usePremiumModal();
    const {toast} = useToast();
    const [loading, setloading] = useState(false);
    
    async function handleUpgrade(priceId: string) {
        try {
            setloading(true);
            const redirectUrl = await  createCheckoutSession(priceId);
            window.location.href = redirectUrl;
        } catch (error) {
            console.error(error);
              toast({
            variant:"destructive",
            description: "Something went wrogn. PLease try again."
        })
        }finally{
            setloading(false);
        }
    }
  return <Dialog open={open} onOpenChange={(open) =>{
    if (!loading) {
        setOpen(open);
    }
  }}>
     <DialogContent className="max-w-2xl bg-white dark:bg-black text-black dark:text-white">
        <DialogHeader>
            <DialogTitle className=" font-bold text-2xl">Upgrade to Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
            <p>
            Get the premium features you deserve.
            </p>
            <div className="flex">
               <div className="flex w-1/2 flex-col space-y-5">
               <h3 className="text-center text-lg font-bold">Premium</h3>
               <ul className="list-inside space-y-2">
               {premiumFeatures.map((feature) => (
                 <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-900 dark:text-white"/>
                   {feature}
                 </li>
               ))}
               </ul>
               <Button
               disabled={loading}
               onClick={() => handleUpgrade(env.
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!)}
               className="bg-black text-white dark:bg-white dark:text-black">Upgrade to Premium</Button>
               </div>
               <div className="border-1  mx-6"/>
                <div className="flex w-1/2 flex-col space-y-5">
                <h3 className="text-center text-lg font-bold text-blue-800">Premium +</h3>
             <ul className="list-inside space-y-2">
               {premiumPlusFeatures.map((feature) => (
                 <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-800 "/>
                   {feature}
                 </li>
               ))}
               </ul>
               <Button 
               disabled={loading}
               onClick={() => handleUpgrade(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY!)}
               className="bg-blue-900">Upgrade to Premium +</Button>
               </div>
            </div>
            </div>
     </DialogContent>
  </Dialog>
}
