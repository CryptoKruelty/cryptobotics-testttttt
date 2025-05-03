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
        isIncludedInSubscription: true,
      },
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Check if the bot is already inactive
    if (!bot.isActive) {
      return NextResponse.json({ error: "Bot is already inactive" }, { status: 400 })
    }

    // Update the bot status to deactivating
    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: {
        status: "DEACTIVATING",
        isActive: false,
        deactivationDate: new Date(),
      },
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true,
      },
    })

    // If the bot was included in the subscription, decrement the user's active bots count
    if (bot.isIncludedInSubscription) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          activeBotsCount: {
            decrement: 1,
          },
        },
      })

      // Update the bot to no longer be included in the subscription
      await prisma.bot.update({
        where: { id: botId },
        data: {
          isIncludedInSubscription: false,
        },
      })
    }

    // Log the event
    await logAuditEvent({
      userId,
      action: "BOT_DEACTIVATED",
      resourceType: "BOT",
      resourceId: botId,
      details: `Bot "${bot.name}" deactivated`,
    })

    return NextResponse.json(updatedBot)
  } catch (error) {
    console.error("Error deactivating bot:", error)
    return NextResponse.json({ error: "Failed to deactivate bot" }, { status: 500 })
  }
}
