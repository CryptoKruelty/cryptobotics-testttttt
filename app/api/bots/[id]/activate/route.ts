import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const botId = params.id

    // Check if the bot exists and belongs to the user
    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        status: true,
      },
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Check if the bot is already active
    if (bot.isActive) {
      return NextResponse.json({ error: "Bot is already active" }, { status: 400 })
    }

    // Check if the user has available bot quota
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        activeBotQuota: true,
        activeBotsCount: true,
        stripeSubscriptionStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the user has an active subscription
    if (user.stripeSubscriptionStatus !== "ACTIVE" && user.stripeSubscriptionStatus !== "TRIALING") {
      return NextResponse.json({ error: "You need an active subscription to activate bots" }, { status: 403 })
    }

    // Check if the user has reached their bot quota
    if (user.activeBotsCount >= user.activeBotQuota) {
      return NextResponse.json(
        { error: "You have reached your bot quota. Please upgrade your subscription to activate more bots." },
        { status: 403 },
      )
    }

    // Update the bot status to activating
    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: {
        status: "ACTIVATING",
        isActive: true,
        activationDate: new Date(),
        isIncludedInSubscription: true,
      },
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true,
      },
    })

    // Increment the user's active bots count
    await prisma.user.update({
      where: { id: userId },
      data: {
        activeBotsCount: {
          increment: 1,
        },
      },
    })

    // Log the event
    await logAuditEvent({
      userId,
      action: "BOT_ACTIVATED",
      resourceType: "BOT",
      resourceId: botId,
      details: `Bot "${bot.name}" activated`,
    })

    return NextResponse.json(updatedBot)
  } catch (error) {
    console.error("Error activating bot:", error)
    return NextResponse.json({ error: "Failed to activate bot" }, { status: 500 })
  }
}
