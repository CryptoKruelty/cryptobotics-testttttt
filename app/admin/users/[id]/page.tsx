"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangle, Bot, CreditCard, Shield, Ban } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userBots, setUserBots] = useState<any[]>([])
  const [userLogs, setUserLogs] = useState<any[]>([])
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMakeAdminDialog, setShowMakeAdminDialog] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)

        // Fetch user's bots
        const botsResponse = await fetch(`/api/admin/users/${params.id}/bots`)
        if (botsResponse.ok) {
          const botsData = await botsResponse.json()
          setUserBots(botsData)
        }

        // Fetch user's audit logs
        const logsResponse = await fetch(`/api/admin/users/${params.id}/logs`)
        if (logsResponse.ok) {
          const logsData = await logsResponse.json()
          setUserLogs(logsData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id, toast])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) throw new Error("Failed to update user")

      toast({
        title: "Success",
        description: "User details updated successfully",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBanUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}/ban`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to ban user")

      toast({
        title: "Success",
        description: "User has been banned",
      })

      // Update user state
      setUser({
        ...user,
        status: "banned",
      })

      setShowBanDialog(false)
    } catch (error) {
      console.error("Error banning user:", error)
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      toast({
        title: "Success",
        description: "User has been deleted",
      })

      router.push("/admin/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleMakeAdmin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}/make-admin`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to make user admin")

      toast({
        title: "Success",
        description: "User has been made an admin",
      })

      // Update user state
      setUser({
        ...user,
        role: "admin",
      })

      setShowMakeAdminDialog(false)
    } catch (error) {
      console.error("Error making user admin:", error)
      toast({
        title: "Error",
        description: "Failed to make user admin",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>User not found or you don't have permission to view this user.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/users")}>Back to Users</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground mt-1">Manage user {user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/users")}>
            Back to Users
          </Button>
          <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Ban className="h-4 w-4 mr-2" />
                Ban User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ban User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to ban this user? They will no longer be able to access the platform.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBanDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBanUser} disabled={isLoading}>
                  {isLoading ? "Banning..." : "Ban User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.role === "admin" ? "default" : "outline"}>
                {user.role === "admin" ? "Admin" : "User"}
              </Badge>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className={user.status === "active" ? "bg-green-500" : user.status === "banned" ? "bg-red-500" : ""}
              >
                {user.status}
              </Badge>
            </div>
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discord ID:</span>
                <span className="font-mono">{user.discordId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discord Username:</span>
                <span>{user.discordUsername}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Dialog open={showMakeAdminDialog} onOpenChange={setShowMakeAdminDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={user.role === "admin"}>
                  <Shield className="h-4 w-4 mr-2" />
                  Make Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make User Admin</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to make this user an admin? They will have full access to the admin panel.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowMakeAdminDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleMakeAdmin} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Make Admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action cannot be undone and will delete all of the
                    user's data, including bots.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bots">Bots</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Edit user details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active-status">Active Status</Label>
                      <Switch
                        id="active-status"
                        checked={user.status === "active"}
                        onCheckedChange={(checked) => setUser({ ...user, status: checked ? "active" : "inactive" })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When disabled, the user will not be able to log in to the platform.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bot-quota">Bot Quota</Label>
                    <Input
                      id="bot-quota"
                      type="number"
                      value={user.activeBotQuota || 0}
                      onChange={(e) => setUser({ ...user, activeBotQuota: Number.parseInt(e.target.value) })}
                    />
                    <p className="text-sm text-muted-foreground">
                      The maximum number of bots this user can have active at once.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>User Management</AlertTitle>
                <AlertDescription>
                  Changes made to user details are immediately reflected in the database. Be careful when modifying
                  sensitive information.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="bots" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User's Bots</CardTitle>
                  <CardDescription>Manage bots created by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  {userBots.length === 0 ? (
                    <div className="text-center py-6">
                      <Bot className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No Bots Found</h3>
                      <p className="text-sm text-muted-foreground mt-1">This user hasn't created any bots yet.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userBots.map((bot) => (
                            <TableRow key={bot.id}>
                              <TableCell className="font-medium">{bot.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {bot.type.toLowerCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    bot.status === "RUNNING"
                                      ? "default"
                                      : bot.status === "ERROR"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className={bot.status === "RUNNING" ? "bg-green-500" : ""}
                                >
                                  {bot.status.replace("_", " ").toLowerCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(bot.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/bots/${bot.id}`)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Manage user's subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.stripeCustomerId ? (
                    <>
                      <div className="rounded-md bg-muted p-4">
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-medium">Current Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.stripeSubscriptionId ? "Active Subscription" : "No Active Subscription"}
                            </p>
                          </div>
                          <Badge className="ml-auto">{user.stripeSubscriptionId ? "Active" : "Inactive"}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Stripe Customer ID:</span>
                          <span className="text-sm font-mono">{user.stripeCustomerId}</span>
                        </div>
                        {user.stripeSubscriptionId && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Stripe Subscription ID:</span>
                              <span className="text-sm font-mono">{user.stripeSubscriptionId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Current Period End:</span>
                              <span className="text-sm">
                                {user.currentSubscriptionPeriodEnd
                                  ? new Date(user.currentSubscriptionPeriodEnd).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            window.open(`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`, "_blank")
                          }
                        >
                          View in Stripe
                        </Button>
                        <Button className="gradient-bg border-0 hover:opacity-90">Manage Subscription</Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No Subscription</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This user doesn't have a Stripe subscription.
                      </p>
                      <Button className="mt-4">Create Subscription</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>View user's activity history</CardDescription>
                </CardHeader>
                <CardContent>
                  {userLogs.length === 0 ? (
                    <div className="text-center py-6">
                      <InfoIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No Activity Logs</h3>
                      <p className="text-sm text-muted-foreground mt-1">No activity has been recorded for this user.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {log.resourceType.toLowerCase()}
                                </Badge>
                                {log.resourceId && (
                                  <span className="ml-2 text-xs text-muted-foreground">{log.resourceId}</span>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                              <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
