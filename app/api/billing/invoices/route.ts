import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { format } from "date-fns"
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
      return NextResponse.json({ invoices: [] })
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 5,
    })

    // Format invoices for the frontend
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.number || invoice.id,
      date: format(new Date(invoice.created * 1000), "MMM d, yyyy"),
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.currency.toUpperCase(),
      }).format(invoice.amount_paid / 100),
      status: invoice.status === "paid" ? "Paid" : invoice.status,
      url: invoice.hosted_invoice_url,
    }))

    return NextResponse.json({ invoices: formattedInvoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
