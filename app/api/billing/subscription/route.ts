import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to find user by ID first, if not available, try discordId
    let user = null;
    
    if (session.user.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          activeBotQuota: true,
          activeBotsCount: true,
          stripeSubscriptionStatus: true,
          stripeSubscriptionId: true,
          currentSubscriptionPeriodEnd: true,
        },
      });
    } else if (session.user.discordId) {
      user = await prisma.user.findUnique({
        where: { discordId: session.user.discordId },
        select: {
          activeBotQuota: true,
          activeBotsCount: true,
          stripeSubscriptionStatus: true,
          stripeSubscriptionId: true,
          currentSubscriptionPeriodEnd: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user has no subscription, return default values
    if (!user.stripeSubscriptionId || !user.stripeSubscriptionStatus) {
      return NextResponse.json({
        plan: "No Subscription",
        status: "INACTIVE",
        activeBotQuota: 0,
        activeBotsCount: 0,
        nextBillingDate: "N/A",
        monthlyCost: 0,
      })
    }

    // Determine plan name based on bot quota
    let planName = "Basic Plan"
    if (user.activeBotQuota === 1) planName = "Basic Plan"
    else if (user.activeBotQuota === 3) planName = "Standard Plan"
    else if (user.activeBotQuota === 10) planName = "Premium Plan"
    else if (user.activeBotQuota > 10) planName = "Enterprise Plan"

    // Calculate monthly cost based on active bots
    const monthlyCost = user.activeBotQuota * 5 // $5 per bot

    // Format next billing date
    const nextBillingDate = user.currentSubscriptionPeriodEnd
      ? new Date(user.currentSubscriptionPeriodEnd).toLocaleDateString()
      : "N/A"

    return NextResponse.json({
      plan: planName,
      status: user.stripeSubscriptionStatus,
      activeBotQuota: user.activeBotQuota,
      activeBotsCount: user.activeBotsCount,
      nextBillingDate,
      monthlyCost,
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
