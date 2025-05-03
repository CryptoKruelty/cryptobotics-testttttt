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

    const userId = params.id

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "BANNED",
      },
    })

    // Deactivate all user's bots
    await prisma.bot.updateMany({
      where: { userId },
      data: {
        status: "OFFLINE_INACTIVE",
        isActive: false,
      },
    })

    // Log the event
    await logAuditEvent({
      userId: session.user.id,
      action: "USER_BANNED",
      resourceType: "USER",
      resourceId: userId,
      details: `User "${user.name}" banned by admin`,
    })

    return NextResponse.json({
      success: true,
      message: "User has been banned",
    })
  } catch (error) {
    console.error("Error banning user:", error)
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 })
  }
}
