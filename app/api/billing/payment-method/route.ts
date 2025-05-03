import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import Stripe from "stripe"
import { env } from "@/lib/env"

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function GET() {
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
      },
    })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ paymentMethod: null })
    }

    // Fetch payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    })

    if (paymentMethods.data.length === 0) {
      return NextResponse.json({ paymentMethod: null })
    }

    // Get the default payment method
    const defaultPaymentMethod = paymentMethods.data[0]
    const card = defaultPaymentMethod.card

    return NextResponse.json({
      paymentMethod: {
        id: defaultPaymentMethod.id,
        brand: card?.brand || "Unknown",
        last4: card?.last4 || "0000",
        exp_month: card?.exp_month || 0,
        exp_year: card?.exp_year || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching payment method:", error)
    return NextResponse.json({ error: "Failed to fetch payment method" }, { status: 500 })
  }
}
