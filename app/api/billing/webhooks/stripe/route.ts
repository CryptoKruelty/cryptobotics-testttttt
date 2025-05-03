import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") as string

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session

        // Get the subscription ID from the checkout session
        if (checkoutSession.mode === "subscription" && checkoutSession.subscription) {
          const subscriptionId = checkoutSession.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)

          // Get the user ID from the metadata
          const userId = subscription.metadata.userId

          if (!userId) {
            console.error("No userId found in subscription metadata")
            break
          }

          // Get the quantity from the subscription
          const quantity = subscription.items.data[0].quantity || 1

          // Update the user's subscription details
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeSubscriptionStatus: subscription.status.toUpperCase() as any,
              stripeSubscriptionPriceId: subscription.items.data[0].price.id,
              activeBotQuota: quantity,
              currentSubscriptionPeriodStart: new Date(subscription.current_period_start * 1000),
              currentSubscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })

          // Log the event
          await logAuditEvent({
            userId,
            action: "SUBSCRIPTION_CREATED",
            resourceType: "BILLING",
            details: `Subscription created with ${quantity} bot quota`,
          })

          // Check if there's a specific bot to activate
          const botId = subscription.metadata.botId
          if (botId) {
            // Activate the bot
            await prisma.bot.update({
              where: { id: botId },
              data: {
                status: "ACTIVATING",
                isActive: true,
                isIncludedInSubscription: true,
                activationDate: new Date(),
              },
            })

            // Update the user's active bot count
            await prisma.user.update({
              where: { id: userId },
              data: {
                activeBotsCount: {
                  increment: 1,
                },
              },
            })

            // Log the bot activation
            await logAuditEvent({
              userId,
              action: "BOT_ACTIVATED",
              resourceType: "BOT",
              resourceId: botId,
              details: `Bot activated after subscription payment`,
            })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.userId

        if (!userId) {
          console.error("No userId found in subscription metadata")
          break
        }

        // Get the quantity from the subscription
        const quantity = subscription.items.data[0].quantity || 1

        // Update the user's subscription details
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionStatus: subscription.status.toUpperCase() as any,
            activeBotQuota: quantity,
            currentSubscriptionPeriodStart: new Date(subscription.current_period_start * 1000),
            currentSubscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        // Log the event
        await logAuditEvent({
          userId,
          action: "SUBSCRIPTION_UPDATED",
          resourceType: "BILLING",
          details: `Subscription updated with ${quantity} bot quota`,
        })

        // Create a subscription change record
        await prisma.subscriptionChange.create({
          data: {
            userId,
            changeType: "INCREASE", // This is a simplification, could be DECREASE
            previousQuota: 0, // This should be the previous quota
            newQuota: quantity,
            effectiveDate: new Date(),
            additionalCost: 0, // This should be calculated
          },
        })

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.userId

        if (!userId) {
          console.error("No userId found in subscription metadata")
          break
        }

        // Update the user's subscription details
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionStatus: "CANCELED",
            // Don't reset the quota yet, as they might still have time left in their billing period
          },
        })

        // Log the event
        await logAuditEvent({
          userId,
          action: "SUBSCRIPTION_CANCELED",
          resourceType: "BILLING",
          details: `Subscription canceled`,
        })

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) {
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata.userId

        if (!userId) {
          console.error("No userId found in subscription metadata")
          break
        }

        // Create a payment record
        await prisma.payment.create({
          data: {
            userId,
            amount: invoice.amount_paid / 100, // Convert from cents to dollars
            currency: invoice.currency,
            status: "SUCCEEDED",
            stripePaymentId: invoice.payment_intent as string,
            stripeInvoiceId: invoice.id,
            description: `Payment for subscription ${subscriptionId}`,
            metadata: {
              invoiceId: invoice.id,
              subscriptionId: subscriptionId,
            },
          },
        })

        // Log the event
        await logAuditEvent({
          userId,
          action: "PAYMENT_SUCCEEDED",
          resourceType: "BILLING",
          details: `Payment of ${invoice.amount_paid / 100} ${invoice.currency} succeeded`,
        })

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) {
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata.userId

        if (!userId) {
          console.error("No userId found in subscription metadata")
          break
        }

        // Update the user's subscription status
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionStatus: "PAST_DUE",
          },
        })

        // Create a payment record
        await prisma.payment.create({
          data: {
            userId,
            amount: invoice.amount_due / 100, // Convert from cents to dollars
            currency: invoice.currency,
            status: "FAILED",
            stripeInvoiceId: invoice.id,
            description: `Failed payment for subscription ${subscriptionId}`,
            metadata: {
              invoiceId: invoice.id,
              subscriptionId: subscriptionId,
            },
          },
        })

        // Log the event
        await logAuditEvent({
          userId,
          action: "PAYMENT_FAILED",
          resourceType: "BILLING",
          details: `Payment of ${invoice.amount_due / 100} ${invoice.currency} failed`,
        })

        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
