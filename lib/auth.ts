import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: (data) => {
      return prisma.user.create({
        data: {
          ...data,
          activeBotQuota: 0, // Default bot quota for new users
        },
      })
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [], // Providers are configured in [...nextauth]/route.ts
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.discordId = token.discordId as string
        session.user.discordUsername = token.discordUsername as string
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.discordId = user.discordId
        token.discordUsername = user.discordUsername
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}
