// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Bot, Plus, RefreshCw, AlertCircle, Zap, Activity, Wallet } from "lucide-react"
// import { CreateBotDialog } from "@/components/create-bot-dialog"
// import { BotCard } from "@/components/bot-card"
// import { useToast } from "@/hooks/use-toast"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { useSearchParams } from "next/navigation"

// // Custom hook to prevent layout shift by locking body scroll
// const useLockBodyScroll = (open) => {
//   useEffect(() => {
//     if (open) {
//       const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
//       document.body.style.paddingRight = `${scrollbarWidth}px`
//       document.body.style.overflow = "hidden" // Optional: explicitly lock scroll
//     } else {
//       document.body.style.paddingRight = ""
//       document.body.style.overflow = "" // Reset to default
//     }
//   }, [open])
// }

// // Define types for our data
// interface BotType {
//   id: string
//   name: string
//   type: string
//   status: string
//   isActive: boolean
//   info?: string
//   config?: any
//   isIncludedInSubscription?: boolean
// }

// interface UserSubscription {
//   plan: string
//   status: string
//   activeBotQuota: number
//   activeBotsCount: number
//   nextBillingDate: string
//   monthlyCost: number
// }

// export default function DashboardPage() {
//   const { toast } = useToast()
//   const searchParams = useSearchParams()

//   const [bots, setBots] = useState<BotType[]>([])
//   const [subscription, setSubscription] = useState<UserSubscription>({
//     plan: "No Subscription",
//     status: "INACTIVE",
//     activeBotQuota: 0,
//     activeBotsCount: 0,
//     nextBillingDate: "N/A",
//     monthlyCost: 0,
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [isLoadingInitial, setIsLoadingInitial] = useState(true)
//   const [progress, setProgress] = useState(0)
//   const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)
//   const [checkoutUrl, setCheckoutUrl] = useState("")

//   // Apply the scroll lock for the subscription dialog
//   useLockBodyScroll(showSubscriptionDialog)

//   // Check for success/error messages from URL params
//   useEffect(() => {
//     const success = searchParams.get("success")
//     const canceled = searchParams.get("canceled")

//     if (success === "subscription_updated") {
//       toast({
//         title: "Subscription Updated",
//         description: "Your subscription has been updated successfully.",
//       })
//     }

//     if (canceled === "true") {
//       toast({
//         title: "Checkout Canceled",
//         description: "You canceled the checkout process.",
//         variant: "destructive",
//       })
//     }
//   }, [searchParams, toast])

//   // Calculate progress based on active bots vs quota
//   useEffect(() => {
//     if (subscription.activeBotQuota > 0) {
//       const calculatedProgress = (subscription.activeBotsCount / subscription.activeBotQuota) * 100
//       setProgress(calculatedProgress)
//     } else {
//       setProgress(0)
//     }
//   }, [subscription])

//   // Fetch data function
//   const fetchData = useCallback(async () => {
//     try {
//       // Fetch bots
//       const botsResponse = await fetch("/api/bots")
//       if (!botsResponse.ok) throw new Error("Failed to fetch bots")
//       const botsData = await botsResponse.json()
//       setBots(botsData)

//       // Fetch subscription
//       try {
//         const subscriptionResponse = await fetch("/api/billing/subscription")
//         if (subscriptionResponse.ok) {
//           const subscriptionData = await subscriptionResponse.json()
//           setSubscription(subscriptionData)
//         }
//       } catch (error) {
//         console.error("Error fetching subscription:", error)
//         // Keep the default "No Subscription" state
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load dashboard data.",
//         variant: "destructive",
//       })
//     }
//   }, [toast])

//   // Initial data fetch
//   useEffect(() => {
//     setIsLoadingInitial(true)
//     fetchData().finally(() => setIsLoadingInitial(false))
//   }, [fetchData])

//   // Memoized filtered bots
//   const activeBots = useMemo(
//     () => bots.filter((bot) => bot.isActive || bot.status === "RUNNING" || bot.status === "ACTIVATING"),
//     [bots]
//   )

//   const inactiveBots = useMemo(
//     () =>
//       bots.filter(
//         (bot) =>
//           !bot.isActive || bot.status === "OFFLINE_INACTIVE" || bot.status === "DEACTIVATING" || bot.status === "ERROR"
//       ),
//     [bots]
//   )

//   const refreshBots = useCallback(async () => {
//     setIsLoading(true)
//     try {
//       await fetchData()
//       toast({
//         title: "Refreshed",
//         description: "Bot status updated successfully",
//       })
//     } catch (error) {
//       console.error("Error refreshing bots:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [fetchData, toast])

//   const activateBot = useCallback(
//     async (botId: string) => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/bots/${botId}/activate`, {
//           method: "POST",
//         })

//         const data = await response.json()

//         if (!response.ok) {
//           if (response.status === 402 || data.needsPayment) {
//             // User needs to pay for additional bot
//             setCheckoutUrl(data.checkoutUrl)
//             setShowSubscriptionDialog(true)
//             return
//           }
//           throw new Error(data.error || "Failed to activate bot")
//         }

//         // Update the bot in the local state
//         setBots((prevBots) =>
//           prevBots.map((bot) => (bot.id === botId ? { ...bot, status: "ACTIVATING", isActive: true } : bot))
//         )

//         toast({
//           title: "Bot Activating",
//           description: "Your bot is being activated. This may take a moment.",
//         })

//         // Refresh bots after a delay to get updated status
//         setTimeout(refreshBots, 3000)
//       } catch (error) {
//         console.error("Error activating bot:", error)
//         toast({
//           title: "Error",
//           description: "Failed to activate bot. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [refreshBots, toast]
//   )

//   const deactivateBot = useCallback(
//     async (botId: string) => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/bots/${botId}/deactivate`, {
//           method: "POST",
//         })

//         if (!response.ok) {
//           const data = await response.json()
//           throw new Error(data.error || "Failed to deactivate bot")
//         }

//         // Update the bot in the local state
//         setBots((prevBots) =>
//           prevBots.map((bot) => (bot.id === botId ? { ...bot, status: "DEACTIVATING", isActive: false } : bot))
//         )

//         toast({
//           title: "Bot Deactivating",
//           description: "Your bot is being deactivated. This may take a moment.",
//         })

//         // Refresh bots after a delay to get updated status
//         setTimeout(refreshBots, 3000)
//       } catch (error) {
//         console.error("Error deactivating bot:", error)
//         toast({
//           title: "Error",
//           description: "Failed to deactivate bot. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [refreshBots, toast]
//   )

//   const deleteBot = useCallback(
//     async (botId: string) => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/bots/${botId}`, {
//           method: "DELETE",
//         })

//         if (!response.ok) {
//           const data = await response.json()
//           throw new Error(data.error || "Failed to delete bot")
//         }

//         // Remove the bot from the local state
//         setBots((prevBots) => prevBots.filter((bot) => bot.id !== botId))

//         toast({
//           title: "Bot Deleted",
//           description: "Your bot has been deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Error deleting bot:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete bot. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [toast]
//   )

//   const handleBotCreated = useCallback(
//     (newBot: BotType) => {
//       setBots((prevBots) => [newBot, ...prevBots])
//       toast({
//         title: "Bot Created",
//         description: "Your bot has been created successfully. You can now activate it.",
//       })
//     },
//     [toast]
//   )

//   const proceedToCheckout = useCallback(() => {
//     if (checkoutUrl) {
//       window.location.href = checkoutUrl
//     }
//   }, [checkoutUrl])

//   const handleManageSubscription = useCallback(async () => {
//     setIsLoading(true)
//     try {
//       // Call the API to create a Stripe portal session
//       const response = await fetch("/api/billing/create-portal-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create portal session")
//       }

//       const data = await response.json()

//       if (data.url) {
//         // Redirect to Stripe portal
//         window.location.href = data.url
//       } else {
//         throw new Error("No URL returned from portal session creation")
//       }
//     } catch (error) {
//       console.error("Error creating portal session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to open Stripe portal. Please try again later.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [toast])

//   if (isLoadingInitial) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin">
//             <RefreshCw className="h-8 w-8 text-primary" />
//           </div>
//           <p className="text-muted-foreground">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <p className="text-muted-foreground mt-1">Manage your crypto Discord bots</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={refreshBots} disabled={isLoading}>
//             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//             <span className="sr-only">Refresh</span>
//           </Button>
//           <CreateBotDialog onBotCreated={handleBotCreated}>
//             <Button className="gradient-bg border-0 hover:opacity-90">
//               <Plus className="h-4 w-4 mr-2" />
//               Create Bot
//             </Button>
//           </CreateBotDialog>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-4">
//         <Card className="relative overflow-hidden md:col-span-2">
//           <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex justify-between items-center mb-2">
//               <div>
//                 <div className="text-2xl font-bold">{subscription.plan}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {subscription.activeBotsCount === 0 ? "0 Active Bots" : `${subscription.activeBotsCount} Active Bots`}
//                 </p>
//               </div>
//               <Badge
//                 variant="outline"
//                 className={
//                   subscription.status === "ACTIVE" || subscription.status === "TRIALING"
//                     ? "bg-primary/10 text-primary"
//                     : "bg-yellow-500/10 text-yellow-500"
//                 }
//               >
//                 {subscription.status === "ACTIVE" ? "Active" : subscription.status}
//               </Badge>
//             </div>
//             <Progress value={progress} className="h-2 mb-4" />
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Next billing:</span>
//                 <span>{subscription.nextBillingDate}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Monthly cost:</span>
//                 <span>${subscription.monthlyCost.toFixed(2)}</span>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
//               {subscription.status === "INACTIVE" ? "Subscribe" : "Manage Subscription"}
//             </Button>
//           </CardFooter>
//         </Card>

//         <Card className="relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center">
//               <div className="text-2xl font-bold">{activeBots.length}</div>
//               <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
//                 <Activity className="h-3 w-3 text-green-500" />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground">Running bots</p>
//           </CardContent>
//           <CardFooter>
//             <CreateBotDialog onBotCreated={handleBotCreated}>
//               <Button variant="outline" className="w-full">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Bot
//               </Button>
//             </CreateBotDialog>
//           </CardFooter>
//         </Card>

//         <Card className="relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center">
//               <div className="text-2xl font-bold">${subscription.monthlyCost.toFixed(2)}</div>
//               <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
//                 <Wallet className="h-3 w-3 text-primary" />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground">Current billing period</p>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
//               View Details
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>

//       <div className="space-y-4">
//         <Tabs defaultValue="all" className="w-full">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//             <h2 className="text-xl font-semibold">Your Bots</h2>
//             <TabsList>
//               <TabsTrigger value="all">All Bots</TabsTrigger>
//               <TabsTrigger value="active">Active</TabsTrigger>
//               <TabsTrigger value="inactive">Inactive</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="all" className="space-y-4">
//             {bots.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center py-10">
//                   <div className="rounded-full bg-primary/10 p-3 mb-4">
//                     <Bot className="h-6 w-6 text-primary" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No bots found</h3>
//                   <p className="text-muted-foreground text-center max-w-md mb-6">
//                     You haven't created any bots yet. Click the "Create Bot" button to get started.
//                   </p>
//                   <CreateBotDialog onBotCreated={handleBotCreated}>
//                     <Button className="gradient-bg border-0 hover:opacity-90">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create Your First Bot
//                     </Button>
//                   </CreateBotDialog>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {bots.map((bot) => (
//                   <BotCard
//                     key={bot.id}
//                     bot={bot}
//                     onActivate={() => activateBot(bot.id)}
//                     onDeactivate={() => deactivateBot(bot.id)}
//                     onDelete={() => deleteBot(bot.id)}
//                     isLoading={isLoading}
//                   />
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="active" className="space-y-4">
//             {activeBots.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center py-10">
//                   <div className="rounded-full bg-primary/10 p-3 mb-4">
//                     <AlertCircle className="h-6 w-6 text-primary" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No active bots</h3>
//                   <p className="text-muted-foreground text-center max-w-md mb-6">
//                     You don't have any active bots. Activate an existing bot or create a new one.
//                   </p>
//                   <CreateBotDialog onBotCreated={handleBotCreated}>
//                     <Button className="gradient-bg border-0 hover:opacity-90">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create Bot
//                     </Button>
//                   </CreateBotDialog>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {activeBots.map((bot) => (
//                   <BotCard
//                     key={bot.id}
//                     bot={bot}
//                     onActivate={() => activateBot(bot.id)}
//                     onDeactivate={() => deactivateBot(bot.id)}
//                     onDelete={() => deleteBot(bot.id)}
//                     isLoading={isLoading}
//                   />
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="inactive" className="space-y-4">
//             {inactiveBots.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center py-10">
//                   <div className="rounded-full bg-primary/10 p-3 mb-4">
//                     <Zap className="h-6 w-6 text-primary" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No inactive bots</h3>
//                   <p className="text-muted-foreground text-center max-w-md mb-6">
//                     All your bots are currently active. Create a new bot if needed.
//                   </p>
//                   <CreateBotDialog onBotCreated={handleBotCreated}>
//                     <Button className="gradient-bg border-0 hover:opacity-90">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create Bot
//                     </Button>
//                   </CreateBotDialog>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {inactiveBots.map((bot) => (
//                   <BotCard
//                     key={bot.id}
//                     bot={bot}
//                     onActivate={() => activateBot(bot.id)}
//                     onDeactivate={() => deactivateBot(bot.id)}
//                     onDelete={() => deleteBot(bot.id)}
//                     isLoading={isLoading}
//                   />
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Subscription Dialog */}
//       <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Additional Payment Required</DialogTitle>
//             <DialogDescription>
//               You need to upgrade your subscription to activate more bots. This will be charged immediately.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <div className="rounded-lg border p-4 mb-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-medium">Additional Bot</p>
//                   <p className="text-sm text-muted-foreground">1 bot × $5.00/month</p>
//                 </div>
//                 <p className="font-medium">$5.00</p>
//               </div>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Your subscription will be updated immediately and you'll be charged a prorated amount for the current
//               billing period.
//             </p>
//           </div>
//           <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
//             <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={proceedToCheckout} className="gradient-bg border-0 hover:opacity-90">
//               Proceed to Payment
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Plus, RefreshCw, AlertCircle, Zap, Activity, Wallet } from "lucide-react"
import { CreateBotDialog } from "@/components/create-bot-dialog"
import { BotCard } from "@/components/bot-card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSearchParams } from "next/navigation"

// Define types for our data
interface BotType {
  id: string
  name: string
  type: string
  status: string
  isActive: boolean
  info?: string
  config?: any
  isIncludedInSubscription?: boolean
}

interface UserSubscription {
  plan: string
  status: string
  activeBotQuota: number
  activeBotsCount: number
  nextBillingDate: string
  monthlyCost: number
}

export default function DashboardPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const [bots, setBots] = useState<BotType[]>([])
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: "No Subscription",
    status: "INACTIVE",
    activeBotQuota: 0,
    activeBotsCount: 0,
    nextBillingDate: "N/A",
    monthlyCost: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState("")

  // Check for success/error messages from URL params
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    if (success === "subscription_updated") {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
      })
    }

    if (canceled === "true") {
      toast({
        title: "Checkout Canceled",
        description: "You canceled the checkout process.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  // Calculate progress based on active bots vs quota
  useEffect(() => {
    if (subscription.activeBotQuota > 0) {
      const calculatedProgress = (subscription.activeBotsCount / subscription.activeBotQuota) * 100
      setProgress(calculatedProgress)
    } else {
      setProgress(0)
    }
  }, [subscription])

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      // Fetch bots
      const botsResponse = await fetch("/api/bots")
      if (!botsResponse.ok) throw new Error("Failed to fetch bots")
      const botsData = await botsResponse.json()
      setBots(botsData)

      // Fetch subscription
      try {
        const subscriptionResponse = await fetch("/api/billing/subscription")
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          setSubscription(subscriptionData)
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
        // Keep the default "No Subscription" state
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Initial data fetch
  useEffect(() => {
    setIsLoadingInitial(true)
    fetchData().finally(() => setIsLoadingInitial(false))
  }, [fetchData])

  // Memoized filtered bots
  const activeBots = useMemo(
    () => bots.filter((bot) => bot.isActive || bot.status === "RUNNING" || bot.status === "ACTIVATING"),
    [bots],
  )

  const inactiveBots = useMemo(
    () =>
      bots.filter(
        (bot) =>
          !bot.isActive || bot.status === "OFFLINE_INACTIVE" || bot.status === "DEACTIVATING" || bot.status === "ERROR",
      ),
    [bots],
  )

  const refreshBots = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchData()
      toast({
        title: "Refreshed",
        description: "Bot status updated successfully",
      })
    } catch (error) {
      console.error("Error refreshing bots:", error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchData, toast])

  const activateBot = useCallback(
    async (botId: string) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/bots/${botId}/activate`, {
          method: "POST",
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 402 || data.needsPayment) {
            // User needs to pay for additional bot
            setCheckoutUrl(data.checkoutUrl)
            setShowSubscriptionDialog(true)
            return
          }
          throw new Error(data.error || "Failed to activate bot")
        }

        // Update the bot in the local state
        setBots((prevBots) =>
          prevBots.map((bot) => (bot.id === botId ? { ...bot, status: "ACTIVATING", isActive: true } : bot)),
        )

        toast({
          title: "Bot Activating",
          description: "Your bot is being activated. This may take a moment.",
        })

        // Refresh bots after a delay to get updated status
        setTimeout(refreshBots, 3000)
      } catch (error) {
        console.error("Error activating bot:", error)
        toast({
          title: "Error",
          description: "Failed to activate bot. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [refreshBots, toast],
  )

  const deactivateBot = useCallback(
    async (botId: string) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/bots/${botId}/deactivate`, {
          method: "POST",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to deactivate bot")
        }

        // Update the bot in the local state
        setBots((prevBots) =>
          prevBots.map((bot) => (bot.id === botId ? { ...bot, status: "DEACTIVATING", isActive: false } : bot)),
        )

        toast({
          title: "Bot Deactivating",
          description: "Your bot is being deactivated. This may take a moment.",
        })

        // Refresh bots after a delay to get updated status
        setTimeout(refreshBots, 3000)
      } catch (error) {
        console.error("Error deactivating bot:", error)
        toast({
          title: "Error",
          description: "Failed to deactivate bot. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [refreshBots, toast],
  )

  const deleteBot = useCallback(
    async (botId: string) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/bots/${botId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete bot")
        }

        // Remove the bot from the local state
        setBots((prevBots) => prevBots.filter((bot) => bot.id !== botId))

        toast({
          title: "Bot Deleted",
          description: "Your bot has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting bot:", error)
        toast({
          title: "Error",
          description: "Failed to delete bot. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const handleBotCreated = useCallback(
    (newBot: BotType) => {
      setBots((prevBots) => [newBot, ...prevBots])
      toast({
        title: "Bot Created",
        description: "Your bot has been created successfully. You can now activate it.",
      })
    },
    [toast],
  )

  const proceedToCheckout = useCallback(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }, [checkoutUrl])

  const handleManageSubscription = useCallback(async () => {
    setIsLoading(true)
    try {
      // Call the API to create a Stripe portal session
      const response = await fetch("/api/billing/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create portal session")
      }

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe portal
        window.location.href = data.url
      } else {
        throw new Error("No URL returned from portal session creation")
      }
    } catch (error) {
      console.error("Error creating portal session:", error)
      toast({
        title: "Error",
        description: "Failed to open Stripe portal. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your crypto Discord bots</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refreshBots} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <CreateBotDialog onBotCreated={handleBotCreated}>
            <Button className="gradient-bg border-0 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </CreateBotDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-2xl font-bold">{subscription.plan}</div>
                <p className="text-xs text-muted-foreground">
                  {subscription.activeBotsCount === 0 ? "0 Active Bots" : `${subscription.activeBotsCount} Active Bots`}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  subscription.status === "ACTIVE" || subscription.status === "TRIALING"
                    ? "bg-primary/10 text-primary"
                    : "bg-yellow-500/10 text-yellow-500"
                }
              >
                {subscription.status === "ACTIVE" ? "Active" : subscription.status}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next billing:</span>
                <span>{subscription.nextBillingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly cost:</span>
                <span>${subscription.monthlyCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
              {subscription.status === "INACTIVE" ? "Subscribe" : "Manage Subscription"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{activeBots.length}</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <Activity className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Running bots</p>
          </CardContent>
          <CardFooter>
            <CreateBotDialog onBotCreated={handleBotCreated}>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Bot
              </Button>
            </CreateBotDialog>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">${subscription.monthlyCost.toFixed(2)}</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                <Wallet className="h-3 w-3 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Current billing period</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Your Bots</h2>
            <TabsList>
              <TabsTrigger value="all">All Bots</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {bots.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bots found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You haven't created any bots yet. Click the "Create Bot" button to get started.
                  </p>
                  <CreateBotDialog onBotCreated={handleBotCreated}>
                    <Button className="gradient-bg border-0 hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Bot
                    </Button>
                  </CreateBotDialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bots.map((bot) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    onActivate={() => activateBot(bot.id)}
                    onDeactivate={() => deactivateBot(bot.id)}
                    onDelete={() => deleteBot(bot.id)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeBots.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No active bots</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You don't have any active bots. Activate an existing bot or create a new one.
                  </p>
                  <CreateBotDialog onBotCreated={handleBotCreated}>
                    <Button className="gradient-bg border-0 hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Bot
                    </Button>
                  </CreateBotDialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeBots.map((bot) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    onActivate={() => activateBot(bot.id)}
                    onDeactivate={() => deactivateBot(bot.id)}
                    onDelete={() => deleteBot(bot.id)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {inactiveBots.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No inactive bots</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    All your bots are currently active. Create a new bot if needed.
                  </p>
                  <CreateBotDialog onBotCreated={handleBotCreated}>
                    <Button className="gradient-bg border-0 hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Bot
                    </Button>
                  </CreateBotDialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveBots.map((bot) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    onActivate={() => activateBot(bot.id)}
                    onDeactivate={() => deactivateBot(bot.id)}
                    onDelete={() => deleteBot(bot.id)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Subscription Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Additional Payment Required</DialogTitle>
            <DialogDescription>
              You need to upgrade your subscription to activate more bots. This will be charged immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Additional Bot</p>
                  <p className="text-sm text-muted-foreground">1 bot × $5.00/month</p>
                </div>
                <p className="font-medium">$5.00</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your subscription will be updated immediately and you'll be charged a prorated amount for the current
              billing period.
            </p>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={proceedToCheckout} className="gradient-bg border-0 hover:opacity-90">
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}