// Environment variables with validation
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "ENCRYPTION_KEY",
]

// Check for missing environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET!,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || "price_default",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,
  ADMIN_DISCORD_IDS: process.env.ADMIN_DISCORD_IDS?.split(",") || [],
  NODE_ENV: process.env.NODE_ENV || "development",
}
