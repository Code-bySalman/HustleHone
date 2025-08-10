"use server"


import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server"

export async function createCustomerPortalSession() {
   const user = await currentUser();
   if (!user) {
     throw new Error("User Unauthorized");
   }
   const stripeCustomerid = user.privateMetadata.stripeCustomerId as string | undefined;
   if (!stripeCustomerid) {
     throw new Error("Stripe customer ID not found");
   }
   const session = await stripe.billingPortal.sessions.create({
     customer: stripeCustomerid,
     return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
   });
   if(!session.url) {
     throw new Error("Failed to create billing portal session");
   }
   return session.url;  
}