import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { format } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all bots with their owners
    const bots = await prisma.bot.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        isActive: true,
        createdAt: true,
        lastRunEpoch: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            discordUsername: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format bots for the frontend
    const formattedBots = bots.map((bot) => {
      return {
        id: bot.id,
        name: bot.name,
        type: bot.type,
        status: bot.status.toLowerCase(),
        isActive: bot.isActive,
        owner: bot.user?.name || bot.user?.discordUsername || "Unknown",
        ownerId: bot.user?.id,
        createdAt: format(bot.createdAt, "yyyy-MM-dd"),
        lastActive: bot.lastRunEpoch ? new Date(bot.lastRunEpoch * 1000).toISOString() : null,
      }
    })

    return NextResponse.json({ bots: formattedBots })
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}
