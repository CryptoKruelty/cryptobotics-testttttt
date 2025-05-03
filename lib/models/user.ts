export interface User {
  id: string
  email: string
  name: string
  image?: string
  discordId: string
  discordUsername: string
  role: "user" | "admin"
  activeBotQuota: number
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentSubscriptionPeriodEnd?: Date
  createdAt: Date
  updatedAt: Date
}
