import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database migration...")

  try {
    // Check if discordServerId column exists
    try {
      await prisma.$executeRaw`SELECT "discordServerId" FROM "Bot" LIMIT 1;`
      console.log("discordServerId column exists, no need to add it")
    } catch (error) {
      console.log("Adding discordServerId column to Bot table")
      await prisma.$executeRaw`ALTER TABLE "Bot" ADD COLUMN "discordServerId" TEXT;`
    }

    // Check if discordChannelId column exists
    try {
      await prisma.$executeRaw`SELECT "discordChannelId" FROM "Bot" LIMIT 1;`
      console.log("discordChannelId column exists, no need to add it")
    } catch (error) {
      console.log("Adding discordChannelId column to Bot table")
      await prisma.$executeRaw`ALTER TABLE "Bot" ADD COLUMN "discordChannelId" TEXT;`
    }

    // Check if lastSuccessfulRun column exists
    try {
      await prisma.$executeRaw`SELECT "lastSuccessfulRun" FROM "Bot" LIMIT 1;`
      console.log("lastSuccessfulRun column exists, no need to add it")
    } catch (error) {
      console.log("Adding lastSuccessfulRun column to Bot table")
      await prisma.$executeRaw`ALTER TABLE "Bot" ADD COLUMN "lastSuccessfulRun" TIMESTAMP(3);`
    }

    // Check if failureCount column exists
    try {
      await prisma.$executeRaw`SELECT "failureCount" FROM "Bot" LIMIT 1;`
      console.log("failureCount column exists, no need to add it")
    } catch (error) {
      console.log("Adding failureCount column to Bot table")
      await prisma.$executeRaw`ALTER TABLE "Bot" ADD COLUMN "failureCount" INTEGER NOT NULL DEFAULT 0;`
    }

    // Check if deactivationReason column exists
    try {
      await prisma.$executeRaw`SELECT "deactivationReason" FROM "Bot" LIMIT 1;`
      console.log("deactivationReason column exists, no need to add it")
    } catch (error) {
      console.log("Adding deactivationReason column to Bot table")
      await prisma.$executeRaw`ALTER TABLE "Bot" ADD COLUMN "deactivationReason" TEXT;`
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
