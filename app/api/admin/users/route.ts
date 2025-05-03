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

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        discordUsername: true,
        role: true,
        activeBotQuota: true,
        activeBotsCount: true,
        stripeSubscriptionStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format users for the frontend
    const formattedUsers = users.map((user) => {
      // Determine subscription tier
      let subscription = "Free Plan"
      if (user.activeBotQuota === 1) subscription = "Basic"
      else if (user.activeBotQuota === 3) subscription = "Standard"
      else if (user.activeBotQuota === 10) subscription = "Premium"
      else if (user.activeBotQuota > 10) subscription = "Enterprise"

      // Determine status
      const status = user.stripeSubscriptionStatus === "ACTIVE" ? "active" : "inactive"

      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email || "No email",
        discordUsername: user.discordUsername || "Unknown",
        role: user.role,
        activeBotQuota: user.activeBotQuota,
        activeBotsCount: user.activeBotsCount,
        status,
        subscription,
        createdAt: format(user.createdAt, "yyyy-MM-dd"),
      }
    })

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
