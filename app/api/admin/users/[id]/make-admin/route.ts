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

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "ADMIN",
      },
    })

    // Log the event
    await logAuditEvent({
      userId: session.user.id,
      action: "USER_ROLE_UPDATED",
      resourceType: "USER",
      resourceId: userId,
      details: `User "${user.name}" promoted to admin by ${session.user.name}`,
    })

    return NextResponse.json({
      success: true,
      message: "User has been made an admin",
    })
  } catch (error) {
    console.error("Error making user admin:", error)
    return NextResponse.json({ error: "Failed to make user admin" }, { status: 500 })
  }
}
