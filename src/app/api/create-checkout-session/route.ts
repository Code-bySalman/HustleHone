import { stripe } from "@/lib/stripe"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { env } from "@/env"

export async function POST() {
  const user = await currentUser()
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  let stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined

  // Agar customer ID nahi hai to create karo
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      metadata: { userId: user.id }
    })

    stripeCustomerId = customer.id

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: { stripeCustomerId }
    })
  }

  // Checkout session create karo
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [
      { price: env.STRIPE_PRICE_ID, quantity: 1 }
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cancel`,
    metadata: { userId: user.id }
  })

  return Response.json({ url: session.url })
}
