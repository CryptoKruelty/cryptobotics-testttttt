import "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
    discordId?: string
    discordUsername?: string
    role?: "admin" | "user"
  }

  interface Session {
    user: User
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string
    discordUsername?: string
    accessToken?: string
    role?: "admin" | "user"
  }
}
