import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { encrypt } from "@/lib/utils/encryption"
import { logAuditEvent } from "@/lib/utils/audit-logger"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch bots from the database with explicit field selection
    const bots = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        isActive: true,
        updateIntervalSeconds: true,
        decimalPlaces: true,
        config: true,
        lastErrorMessage: true,
        isIncludedInSubscription: true,
        activationDate: true,
        deactivationDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(bots)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.type || !data.discordBotToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Encrypt the bot token
    const encryptedToken = encrypt(data.discordBotToken)

    // Create the bot in the database with explicit field selection
    const newBot = await prisma.bot.create({
      data: {
        userId,
        name: data.name,
        type: data.type.toUpperCase(),
        status: "OFFLINE_INACTIVE",
        isActive: false,
        discordBotToken: encryptedToken,
        updateIntervalSeconds: data.updateIntervalSeconds || 60,
        decimalPlaces: data.decimalPlaces || 4,
        config: data.config || {},
        isIncludedInSubscription: false, // Not included in subscription until activated
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        isActive: true,
        updateIntervalSeconds: true,
        decimalPlaces: true,
        config: true,
        createdAt: true,
      },
    })

    // Log the event
    await logAuditEvent({
      userId,
      action: "BOT_CREATED",
      resourceType: "BOT",
      resourceId: newBot.id,
      details: `Bot "${newBot.name}" created`,
    })

    return NextResponse.json(newBot, { status: 201 })
  } catch (error) {
    console.error("Error creating bot:", error)
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 })
  }
}
