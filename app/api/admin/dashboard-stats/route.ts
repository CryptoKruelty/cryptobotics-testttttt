import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"
import { subDays, startOfMonth, endOfMonth, format } from "date-fns"

export async function GET(request: Request) {
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

    // Get date range from query params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "last30days"

    // Calculate date range
    let startDate: Date
    let endDate = new Date()

    switch (range) {
      case "today":
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        break
      case "yesterday":
        startDate = subDays(new Date(), 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case "last7days":
        startDate = subDays(new Date(), 7)
        break
      case "thisMonth":
        startDate = startOfMonth(new Date())
        break
      case "lastMonth":
        startDate = startOfMonth(subDays(startOfMonth(new Date()), 1))
        endDate = endOfMonth(startDate)
        break
      case "last30days":
      default:
        startDate = subDays(new Date(), 30)
        break
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get active users (users who have logged in within the date range)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Get total bots
    const totalBots = await prisma.bot.count()

    // Get active bots
    const activeBots = await prisma.bot.count({
      where: {
        isActive: true,
      },
    })

    // Get MRR (Monthly Recurring Revenue)
    const subscriptions = await prisma.user.findMany({
      where: {
        stripeSubscriptionStatus: "ACTIVE",
      },
      select: {
        activeBotsCount: true,
      },
    })

    const mrr = subscriptions.reduce((total, sub) => total + sub.activeBotsCount * 5, 0)

    // Get bots by type
    const botsByTypeRaw = await prisma.bot.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    })

    const botsByType = botsByTypeRaw.reduce(
      (acc, item) => {
        acc[item.type.toLowerCase()] = item._count.id
        return acc
      },
      {} as Record<string, number>,
    )

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = subDays(new Date(), 180)
    const revenueByMonth = []

    for (let i = 0; i < 6; i++) {
      const monthDate = subDays(new Date(), i * 30)
      const monthName = format(monthDate, "MMM")

      // In a real implementation, you would query your payment processor
      // Here we'll just use the current MRR for demonstration
      revenueByMonth.unshift({
        month: monthName,
        value: mrr,
      })
    }

    // Get user growth (last 6 months)
    const userGrowth = []

    for (let i = 0; i < 6; i++) {
      const monthDate = subDays(new Date(), i * 30)
      const monthName = format(monthDate, "MMM")

      // For demonstration, we'll use the current user count
      // In a real implementation, you would query historical data
      userGrowth.unshift({
        month: monthName,
        value: totalUsers,
      })
    }

    // Get bot growth (last 6 months)
    const botGrowth = []

    for (let i = 0; i < 6; i++) {
      const monthDate = subDays(new Date(), i * 30)
      const monthName = format(monthDate, "MMM")

      // For demonstration, we'll use the current bot count
      botGrowth.unshift({
        month: monthName,
        value: totalBots,
      })
    }

    // Get subscription tiers
    const subscriptionTiers = await prisma.user.groupBy({
      by: ["activeBotQuota"],
      _count: {
        id: true,
      },
    })

    const formattedSubscriptionTiers = subscriptionTiers.map((tier) => {
      let name = "Free (0 bots)"
      if (tier.activeBotQuota === 1) name = "Basic (1 bot)"
      else if (tier.activeBotQuota === 3) name = "Standard (3 bots)"
      else if (tier.activeBotQuota === 10) name = "Premium (10 bots)"
      else if (tier.activeBotQuota > 10) name = "Enterprise"

      return {
        name,
        users: tier._count.id,
        percentage: Math.round((tier._count.id / totalUsers) * 100),
      }
    })

    // Calculate growth percentages (for demonstration)
    const userGrowthPercentage = 13.2
    const botGrowthPercentage = 8.7
    const revenueGrowthPercentage = 12.5

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalBots,
      activeBots,
      mrr,
      botsByType,
      revenueByMonth,
      userGrowth,
      botGrowth,
      subscriptionTiers: formattedSubscriptionTiers,
      userGrowthPercentage,
      botGrowthPercentage,
      revenueGrowthPercentage,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
