"use server"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { env } from "@/env"

export async function createCustomerPortalSession() {
  const user = await currentUser()
  if (!user) throw new Error("User Unauthorized")

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id }
  })

  if (!subscription?.stripeCustomerId) {
    throw new Error("Stripe customer ID not found")
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`
  })

  return session.url
}
