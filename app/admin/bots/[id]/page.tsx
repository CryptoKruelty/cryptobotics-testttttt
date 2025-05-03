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
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangle, Bot, Power, Trash2, ExternalLink } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

export default function BotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bot, setBot] = useState<any>(null)
  const [botLogs, setBotLogs] = useState<any[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  useEffect(() => {
    const fetchBot = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/bots/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch bot")
        const data = await response.json()
        setBot(data)

        // Fetch bot logs
        const logsResponse = await fetch(`/api/admin/bots/${params.id}/logs`)
        if (logsResponse.ok) {
          const logsData = await logsResponse.json()
          setBotLogs(logsData)
        }
      } catch (error) {
        console.error("Error fetching bot:", error)
        toast({
          title: "Error",
          description: "Failed to fetch bot details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBot()
    }
  }, [params.id, toast])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/bots/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bot),
      })

      if (!response.ok) throw new Error("Failed to update bot")

      toast({
        title: "Success",
        description: "Bot details updated successfully",
      })
    } catch (error) {
      console.error("Error updating bot:", error)
      toast({
        title: "Error",
        description: "Failed to update bot details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBot = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/bots/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete bot")

      toast({
        title: "Success",
        description: "Bot has been deleted",
      })

      router.push("/admin/bots")
    } catch (error) {
      console.error("Error deleting bot:", error)
      toast({
        title: "Error",
        description: "Failed to delete bot",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleToggleBot = async () => {
    setIsLoading(true)
    try {
      const endpoint = bot.isActive
        ? `/api/admin/bots/${params.id}/deactivate`
        : `/api/admin/bots/${params.id}/activate`

      const response = await fetch(endpoint, {
        method: "POST",
      })

      if (!response.ok) throw new Error(`Failed to ${bot.isActive ? "deactivate" : "activate"} bot`)

      const data = await response.json()

      setBot({
        ...bot,
        isActive: !bot.isActive,
        status: data.status,
      })

      toast({
        title: "Success",
        description: `Bot has been ${bot.isActive ? "deactivated" : "activated"}`,
      })

      setShowDeactivateDialog(false)
    } catch (error) {
      console.error(`Error ${bot.isActive ? "deactivating" : "activating"} bot:`, error)
      toast({
        title: "Error",
        description: `Failed to ${bot.isActive ? "deactivate" : "activate"} bot`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !bot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Bot not found or you don't have permission to view this bot.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/bots")}>Back to Bots</Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Badge className="bg-green-500">Running</Badge>
      case "ERROR":
        return <Badge variant="destructive">Error</Badge>
      case "OFFLINE_INACTIVE":
        return <Badge variant="secondary">Offline</Badge>
      case "ACTIVATING":
        return <Badge className="bg-yellow-500">Activating</Badge>
      case "DEACTIVATING":
        return <Badge className="bg-yellow-500">Deactivating</Badge>
      default:
        return <Badge variant="outline">{status.replace("_", " ").toLowerCase()}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bot Details</h1>
          <p className="text-muted-foreground mt-1">Manage bot {bot.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/bots")}>
            Back to Bots
          </Button>
          <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
            <DialogTrigger asChild>
              <Button variant={bot.isActive ? "destructive" : "default"}>
                <Power className="h-4 w-4 mr-2" />
                {bot.isActive ? "Deactivate Bot" : "Activate Bot"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{bot.isActive ? "Deactivate" : "Activate"} Bot</DialogTitle>
                <DialogDescription>
                  Are you sure you want to {bot.isActive ? "deactivate" : "activate"} this bot?
                  {bot.isActive
                    ? " This will stop the bot from running and updating."
                    : " This will start the bot and it will begin updating."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant={bot.isActive ? "destructive" : "default"}
                  onClick={handleToggleBot}
                  disabled={isLoading}
                >
                  {isLoading
                    ? bot.isActive
                      ? "Deactivating..."
                      : "Activating..."
                    : bot.isActive
                      ? "Deactivate"
                      : "Activate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Bot Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold">{bot.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {bot.type.toLowerCase()}
                </Badge>
                {getStatusBadge(bot.status)}
              </div>
            </div>

            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Owner:</span>
                <Button variant="link" className="h-auto p-0" onClick={() => router.push(`/admin/users/${bot.userId}`)}>
                  {bot.userId}
                </Button>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(bot.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Update Interval:</span>
                <span>{bot.updateIntervalSeconds} seconds</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Bot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Bot</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this bot? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteBot} disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete Bot"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="configuration">
            <TabsList>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
              <TabsTrigger value="discord">Discord Info</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Configuration</CardTitle>
                  <CardDescription>Edit bot settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Bot Name</Label>
                      <Input
                        id="name"
                        value={bot.name || ""}
                        onChange={(e) => setBot({ ...bot, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Bot Type</Label>
                      <Input id="type" value={bot.type || ""} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active-status">Active Status</Label>
                      <Switch
                        id="active-status"
                        checked={bot.isActive}
                        onCheckedChange={(checked) => setBot({ ...bot, isActive: checked })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">When disabled, the bot will not run or update.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-interval">Update Interval (seconds)</Label>
                    <Input
                      id="update-interval"
                      type="number"
                      value={bot.updateIntervalSeconds || 60}
                      onChange={(e) => setBot({ ...bot, updateIntervalSeconds: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decimal-places">Decimal Places</Label>
                    <Input
                      id="decimal-places"
                      type="number"
                      value={bot.decimalPlaces || 4}
                      onChange={(e) => setBot({ ...bot, decimalPlaces: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="config">Configuration (JSON)</Label>
                    <Textarea
                      id="config"
                      value={JSON.stringify(bot.config, null, 2)}
                      onChange={(e) => {
                        try {
                          const config = JSON.parse(e.target.value)
                          setBot({ ...bot, config })
                        } catch (error) {
                          // Don't update if invalid JSON
                        }
                      }}
                      className="font-mono text-sm"
                      rows={10}
                    />
                    <p className="text-sm text-muted-foreground">Bot configuration in JSON format.</p>
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
                <AlertTitle>Bot Configuration</AlertTitle>
                <AlertDescription>
                  Changes to the bot configuration will take effect the next time the bot updates.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Activity Logs</CardTitle>
                  <CardDescription>View bot's activity history</CardDescription>
                </CardHeader>
                <CardContent>
                  {botLogs.length === 0 ? (
                    <div className="text-center py-6">
                      <InfoIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No Activity Logs</h3>
                      <p className="text-sm text-muted-foreground mt-1">No activity has been recorded for this bot.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {botLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell>{log.status && getStatusBadge(log.status)}</TableCell>
                              <TableCell className="max-w-xs truncate">{log.details}</TableCell>
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

            <TabsContent value="discord" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Discord Information</CardTitle>
                  <CardDescription>Discord bot details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="discord-bot-token">Discord Bot Token (Encrypted)</Label>
                    <div className="flex">
                      <Input
                        id="discord-bot-token"
                        value={bot.discordBotToken || ""}
                        disabled
                        type="password"
                        className="font-mono"
                      />
                      <Button variant="outline" className="ml-2">
                        Reset Token
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">The Discord bot token is encrypted in the database.</p>
                  </div>

                  {bot.discordBotId && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Discord Bot ID</Label>
                        <div className="flex items-center">
                          <Input value={bot.discordBotId} disabled className="font-mono" />
                          <Button
                            variant="outline"
                            className="ml-2"
                            onClick={() =>
                              window.open(`https://discord.com/developers/applications/${bot.discordBotId}`, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Discord Bot Username</Label>
                        <Input value={bot.discordBotUsername || "Unknown"} disabled />
                      </div>
                    </div>
                  )}

                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Discord Integration</AlertTitle>
                    <AlertDescription>
                      For security reasons, Discord bot tokens cannot be viewed in plain text. You can reset the token
                      if needed.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
