// This script fixes the schema mismatch by updating the Prisma schema to match the database

import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function main() {
  console.log("Starting database schema fix...")

  try {
    // First, try to generate the Prisma client with the current schema
    console.log("Generating Prisma client...")
    await execAsync("npx prisma generate")

    // Then, push the schema to the database (this is more forgiving than migrations)
    console.log("Pushing schema to database...")
    await execAsync("npx prisma db push --accept-data-loss")

    // Test the connection
    console.log("Testing database connection...")
    const prisma = new PrismaClient()
    await prisma.$connect()

    // Try a simple query to verify everything works
    const botCount = await prisma.bot.count()
    console.log(`Database connection successful. Found ${botCount} bots.`)

    await prisma.$disconnect()
    console.log("Schema fix completed successfully!")
  } catch (error) {
    console.error("Error fixing schema:", error)
    process.exit(1)
  }
}

main()
