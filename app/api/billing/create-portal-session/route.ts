import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import Stripe from "stripe"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function POST() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get the user with their Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    })

    if (!user?.stripeCustomerId) {
      // Create a customer in Stripe if they don't have one
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      })

      const customer = await stripe.customers.create({
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        metadata: {
          userId: userId,
        },
      })

      // Update the user with the new Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customer.id,
        },
      })

      // Create a Stripe billing portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${env.NEXTAUTH_URL}/dashboard/billing`,
      })

      // Log the event
      await logAuditEvent({
        userId,
        action: "STRIPE_PORTAL_ACCESSED",
        resourceType: "BILLING",
        details: "User accessed Stripe billing portal (new customer)",
      })

      // Return the session URL
      return NextResponse.json({
        url: portalSession.url,
        sessionId: portalSession.id,
      })
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    // Create a Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.NEXTAUTH_URL}/dashboard/billing`,
    })

    // Log the event
    await logAuditEvent({
      userId,
      action: "STRIPE_PORTAL_ACCESSED",
      resourceType: "BILLING",
      details: "User accessed Stripe billing portal",
    })

    // Return the session URL
    return NextResponse.json({
      url: portalSession.url,
      sessionId: portalSession.id,
    })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
