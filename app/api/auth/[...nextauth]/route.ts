import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { env } from "@/lib/env"
import { prisma } from "@/lib/db"
import { type Profile } from "next-auth"

// Use admin Discord IDs from environment variable
const adminDiscordIds = env.ADMIN_DISCORD_IDS

// Make sure we have the required environment variables
if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
  throw new Error("Missing Discord OAuth credentials in environment variables")
}

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: "identify email guilds" },
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        // Make sure we're safely accessing properties
        if (profile) {
          // Use type assertion for Discord profile properties
          token.discordId = (profile as any).id
          token.discordUsername = (profile as any).username

          // Check if user is an admin
          token.role = adminDiscordIds.includes((profile as any).id) ? "admin" : "user"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Find user in database to get their ID
        if (token.discordId) {
          const dbUser = await prisma.user.findUnique({
            where: { discordId: token.discordId as string },
            select: { id: true },
          });
          
          if (dbUser) {
            session.user.id = dbUser.id; // Add the database ID to session
          } else {
            console.error(`User not found in DB for discordId: ${token.discordId}`);
          }
        }
        
        // Type-safe property assignment
        session.user.discordId = token.discordId as string
        session.user.discordUsername = token.discordUsername as string
        session.user.role = token.role as "admin" | "user"
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
