import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import Stripe from "stripe"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { quantity = 1 } = await request.json()

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })

      customerId = customer.id

      // Save the customer ID to the user
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: quantity,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          userId: userId,
          action: user.stripeSubscriptionId ? "UPDATE_SUBSCRIPTION" : "NEW_SUBSCRIPTION",
        },
      },
      success_url: `${env.NEXTAUTH_URL}/dashboard?success=subscription_created`,
      cancel_url: `${env.NEXTAUTH_URL}/dashboard?canceled=true`,
    })

    // Log the event
    await logAuditEvent({
      userId,
      action: "CHECKOUT_INITIATED",
      resourceType: "BILLING",
      details: `Checkout session created for ${quantity} bot(s)`,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
