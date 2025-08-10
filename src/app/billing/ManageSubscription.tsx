"use client"

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";
import { useState } from "react";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const {toast} = useToast();

  const [laoding, setlaoding] = useState(false);

  async function handleClick(){
    try {
        setlaoding(true);
        const redirectUrl = await createCustomerPortalSession();
        window.location.href = redirectUrl;
    } catch (error) {
        console.error("Error while getting subscription", error);
        toast({
            variant: "destructive",
            className: "bg-red",
            description:  "Something went wrong. Please try again."
        })
    }finally{
        setlaoding(false);
    }
  }
  return <LoadingButton onClick={handleClick} loading={laoding} variant="premium">
   Manage your subscription
  </LoadingButton>

}