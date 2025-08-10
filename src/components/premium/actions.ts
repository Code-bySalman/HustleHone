"use server"

import { env } from "@/env"
import { stripe } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs/server"

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error("User Unauthorized")
  }
  const stripeCustomerid = user.privateMetadata?.stripeCustomerId as  string | undefined
 

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",

    // ✅ Let Stripe show Google Pay (and Apple Pay) if available
    payment_method_types: ["card"],

    // Stripe Checkout page URLs
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
   customer : stripeCustomerid,
    customer_email: stripeCustomerid ? undefined : user.emailAddresses[0].emailAddress,
   metadata:{
    userId : user.id,
   },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },

    // ✅ Optional — require ToS acceptance
    custom_text: {
      terms_of_service_acceptance: {
        message: `By subscribing, you agree to our [Terms of Service](${env.NEXT_PUBLIC_BASE_URL}/tos)`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },

    // ✅ Recommended — let Stripe auto-detect wallets
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
  })

  if (!session.url) {
    throw new Error("Failed to create checkout session")
  }

  return session.url
}
