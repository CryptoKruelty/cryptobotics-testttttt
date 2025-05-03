import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botId = params.id

    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error fetching bot:", error)
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botId = params.id
    const data = await request.json()

    // Validate data
    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Update bot
    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: {
        name: data.name,
        isActive: data.isActive,
        updateIntervalSeconds: data.updateIntervalSeconds,
        decimalPlaces: data.decimalPlaces,
        config: data.config,
        // Add other fields as needed
      },
    })

    // Log the event
    await logAuditEvent({
      userId: session.user.id,
      action: "BOT_UPDATED",
      resourceType: "BOT",
      resourceId: botId,
      details: `Bot ${updatedBot.name} updated by admin`,
    })

    return NextResponse.json(updatedBot)
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botId = params.id

    // Get bot info for logging
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Delete bot
    await prisma.bot.delete({
      where: { id: botId },
    })

    // Log the event
    await logAuditEvent({
      userId: session.user.id,
      action: "BOT_DELETED",
      resourceType: "BOT",
      resourceId: botId,
      details: `Bot "${bot.name}" deleted by admin`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 })
  }
}
