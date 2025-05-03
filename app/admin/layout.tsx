"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, Settings, LogOut, Menu, Users, BarChart3, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = useSession()

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Bots",
      href: "/admin/bots",
      icon: Bot,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Bot className="h-6 w-6 text-primary" />
            <span>CryptoBotics</span>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              Admin Panel
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                User Dashboard
              </Link>
            </Button>
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
                <AvatarFallback>{session?.user?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{session?.user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.discordUsername || ""}</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex items-center gap-2 font-bold text-xl mb-8">
                  <Bot className="h-6 w-6 text-primary" />
                  <span>CryptoBotics</span>
                </div>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                        pathname === item.href && "text-foreground font-medium",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>User Dashboard</span>
                  </Link>
                  <Button variant="ghost" className="justify-start px-2">
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r p-6">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  pathname === item.href && "text-foreground font-medium",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Home className="h-5 w-5 mr-2" />
              <Link href="/dashboard">User Dashboard</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}
