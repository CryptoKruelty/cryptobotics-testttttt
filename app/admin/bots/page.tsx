"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, Download, MoreHorizontal, BotIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminBotsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [bots, setBots] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInitial(true)
      try {
        const response = await fetch("/api/admin/bots")
        if (!response.ok) throw new Error("Failed to fetch bots")
        const data = await response.json()
        setBots(data.bots)
      } catch (error) {
        console.error("Error fetching bots:", error)
        toast({
          title: "Error",
          description: "Failed to load bot data. Please try again.",
          variant: "destructive",
        })
        setBots([])
      } finally {
        setIsLoadingInitial(false)
      }
    }

    fetchData()
  }, [toast])

  const refreshData = () => {
    setIsLoading(true)

    fetch("/api/admin/bots")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch bots")
        return response.json()
      })
      .then((data) => {
        setBots(data.bots)
        toast({
          title: "Data Refreshed",
          description: "Bot data has been updated successfully.",
        })
      })
      .catch((error) => {
        console.error("Error refreshing bots:", error)
        toast({
          title: "Error",
          description: "Failed to refresh bots. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleExport = () => {
    setIsLoading(true)

    // Create CSV content
    const headers = ["ID", "Name", "Type", "Status", "Owner", "Owner ID", "Created At", "Last Active"]
    const csvContent = [
      headers.join(","),
      ...filteredBots.map((bot) =>
        [bot.id, bot.name, bot.type, bot.status, bot.owner, bot.ownerId, bot.createdAt, bot.lastActive].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `bots-export-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsLoading(false)
    toast({
      title: "Export Complete",
      description: "Bot data has been exported successfully.",
    })
  }

  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && bot.status === "running") ||
      (statusFilter === "inactive" && bot.status === "offline_inactive") ||
      (statusFilter === "error" && bot.status === "error")

    const matchesType = typeFilter === "all" || bot.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500">Running</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "offline_inactive":
        return <Badge variant="secondary">Offline</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {isLoadingInitial ? (
        <p>Loading bots...</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Bots</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor all Discord bots</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleExport} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bot Management</CardTitle>
              <CardDescription>View and manage all Discord bots on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bots by name, owner, or type..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="marketcap">Market Cap</SelectItem>
                    <SelectItem value="whale">Whale Alert</SelectItem>
                    <SelectItem value="supply">Supply</SelectItem>
                    <SelectItem value="holders">Holders</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No bots found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-1 rounded-md">
                                <BotIcon className="h-4 w-4 text-primary" />
                              </div>
                              {bot.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {bot.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(bot.status)}</TableCell>
                          <TableCell>{bot.owner}</TableCell>
                          <TableCell>{bot.createdAt}</TableCell>
                          <TableCell>{new Date(bot.lastActive).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>View Logs</DropdownMenuItem>
                                <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {bot.status === "running" ? (
                                  <DropdownMenuItem>Deactivate Bot</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>Activate Bot</DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">Delete Bot</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
