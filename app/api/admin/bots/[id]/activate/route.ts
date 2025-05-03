import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botId = params.id

    // Get bot
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Update bot status
    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: {
        status: "ACTIVATING",
        isActive: true,
      },
    })

    // Log the event
    await logAuditEvent({
      userId: session.user.id,
      action: "BOT_ACTIVATED",
      resourceType: "BOT",
      resourceId: botId,
      details: `Bot "${bot.name}" activated by admin`,
    })

    // In a real implementation, you would signal the Bot Runner to start the bot
    // This is a placeholder for that logic

    return NextResponse.json({
      id: botId,
      status: "ACTIVATING",
      isActive: true,
      message: "Bot is being activated. This may take a few moments.",
    })
  } catch (error) {
    console.error("Error activating bot:", error)
    return NextResponse.json({ error: "Failed to activate bot" }, { status: 500 })
  }
}
