"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Bot,
  DollarSign,
  Search,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  LineChart,
  Activity,
  UserPlus,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const mockStats = {
  totalUsers: 125,
  activeUsers: 87,
  totalBots: 342,
  activeBots: 213,
  mrr: 2130.0,
  botsByType: {
    price: 120,
    marketcap: 45,
    treasury: 30,
    holders: 25,
    supply: 20,
    burn: 15,
    liquidity: 35,
    whale: 40,
    custom: 12,
  },
  revenueByMonth: [
    { month: "Jan", value: 1200 },
    { month: "Feb", value: 1350 },
    { month: "Mar", value: 1500 },
    { month: "Apr", value: 1750 },
    { month: "May", value: 1900 },
    { month: "Jun", value: 2130 },
  ],
  userGrowth: [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 95 },
    { month: "May", value: 110 },
    { month: "Jun", value: 125 },
  ],
  botGrowth: [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 165 },
    { month: "Mar", value: 210 },
    { month: "Apr", value: 250 },
    { month: "May", value: 295 },
    { month: "Jun", value: 342 },
  ],
  subscriptionTiers: [
    { name: "Basic (1 bot)", users: 45, percentage: 36 },
    { name: "Standard (3 bots)", users: 62, percentage: 50 },
    { name: "Premium (10 bots)", users: 18, percentage: 14 },
  ],
}

const mockUsers = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    discordUsername: "alex#1234",
    role: "user",
    activeBotQuota: 3,
    status: "active",
    subscription: "Standard",
    createdAt: "2023-01-15",
  },
  {
    id: "user2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    discordUsername: "sarah#5678",
    role: "user",
    activeBotQuota: 1,
    status: "active",
    subscription: "Basic",
    createdAt: "2023-02-20",
  },
  {
    id: "user3",
    name: "Michael Brown",
    email: "michael@example.com",
    discordUsername: "michael#9012",
    role: "admin",
    activeBotQuota: 10,
    status: "active",
    subscription: "Premium",
    createdAt: "2022-11-05",
  },
  {
    id: "user4",
    name: "Emily Davis",
    email: "emily@example.com",
    discordUsername: "emily#3456",
    role: "user",
    activeBotQuota: 0,
    status: "inactive",
    subscription: "Canceled",
    createdAt: "2023-03-10",
  },
  {
    id: "user5",
    name: "David Wilson",
    email: "david@example.com",
    discordUsername: "david#7890",
    role: "user",
    activeBotQuota: 3,
    status: "active",
    subscription: "Standard",
    createdAt: "2023-01-25",
  },
]

const mockBots = [
  {
    id: "bot1",
    name: "ETH Price Bot",
    type: "price",
    status: "running",
    owner: "Alex Johnson",
    createdAt: "2023-01-20",
  },
  {
    id: "bot2",
    name: "BTC Market Cap",
    type: "marketcap",
    status: "running",
    owner: "Sarah Williams",
    createdAt: "2023-02-25",
  },
  {
    id: "bot3",
    name: "ETH Whale Alert",
    type: "whale",
    status: "error",
    owner: "Michael Brown",
    createdAt: "2022-12-10",
  },
  {
    id: "bot4",
    name: "USDC Supply",
    type: "supply",
    status: "offline_inactive",
    owner: "David Wilson",
    createdAt: "2023-02-05",
  },
  {
    id: "bot5",
    name: "Custom RPC Bot",
    type: "custom",
    status: "running",
    owner: "Michael Brown",
    createdAt: "2023-03-15",
  },
]

const mockSubscriptions = [
  {
    id: "sub1",
    user: "Alex Johnson",
    plan: "Standard",
    status: "active",
    amount: "$15.00",
    nextBilling: "2023-07-15",
    startDate: "2023-01-15",
  },
  {
    id: "sub2",
    user: "Sarah Williams",
    plan: "Basic",
    status: "active",
    amount: "$5.00",
    nextBilling: "2023-07-20",
    startDate: "2023-02-20",
  },
  {
    id: "sub3",
    user: "Michael Brown",
    plan: "Premium",
    status: "active",
    amount: "$45.00",
    nextBilling: "2023-07-05",
    startDate: "2022-11-05",
  },
  {
    id: "sub4",
    user: "Emily Davis",
    plan: "Basic",
    status: "canceled",
    amount: "$0.00",
    nextBilling: "N/A",
    startDate: "2023-03-10",
  },
  {
    id: "sub5",
    user: "David Wilson",
    plan: "Standard",
    status: "active",
    amount: "$15.00",
    nextBilling: "2023-07-25",
    startDate: "2023-01-25",
  },
]

const mockAuditLogs = [
  {
    id: "log1",
    action: "Bot Created",
    user: "Alex Johnson",
    resourceType: "bot",
    resourceId: "bot1",
    timestamp: "2023-01-20T14:30:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log2",
    action: "Bot Activated",
    user: "Sarah Williams",
    resourceType: "bot",
    resourceId: "bot2",
    timestamp: "2023-02-25T10:15:00Z",
    ipAddress: "192.168.1.2",
  },
  {
    id: "log3",
    action: "User Created",
    user: "System",
    resourceType: "user",
    resourceId: "user4",
    timestamp: "2023-03-10T09:45:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log4",
    action: "Bot Deactivated",
    user: "David Wilson",
    resourceType: "bot",
    resourceId: "bot4",
    timestamp: "2023-03-05T16:20:00Z",
    ipAddress: "192.168.1.4",
  },
  {
    id: "log5",
    action: "System Config Updated",
    user: "Michael Brown",
    resourceType: "system_config",
    resourceId: "price_id",
    timestamp: "2023-03-15T11:30:00Z",
    ipAddress: "192.168.1.5",
  },
]

export default function AdminPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("last30days")

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully.",
      })
    }, 1000)
  }

  const handleExport = () => {
    setIsLoading(true)

    // Create CSV content for dashboard stats
    const headers = ["Metric", "Value"]
    const csvContent = [
      headers.join(","),
      ["Total Users", mockStats.totalUsers].join(","),
      ["Active Users", mockStats.activeUsers].join(","),
      ["Total Bots", mockStats.totalBots].join(","),
      ["Active Bots", mockStats.activeBots].join(","),
      ["Monthly Recurring Revenue", `$${mockStats.mrr.toFixed(2)}`].join(","),
      ["", ""].join(","),
      ["Bot Types", "Count"].join(","),
      ...Object.entries(mockStats.botsByType).map(([type, count]) => [type, count].join(",")),
      ["", ""].join(","),
      ["Month", "Revenue"].join(","),
      ...mockStats.revenueByMonth.map((item) => [item.month, item.value].join(",")),
      ["", ""].join(","),
      ["Month", "User Growth"].join(","),
      ...mockStats.userGrowth.map((item) => [item.month, item.value].join(",")),
      ["", ""].join(","),
      ["Subscription Tier", "Users", "Percentage"].join(","),
      ...mockStats.subscriptionTiers.map((tier) => [tier.name, tier.users, `${tier.percentage}%`].join(",")),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `dashboard-stats-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsLoading(false)
    toast({
      title: "Export Complete",
      description: "Dashboard data has been exported successfully.",
    })
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.discordUsername.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBots = mockBots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your platform and monitor performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500">+13.2%</span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
            <Progress value={70} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{mockStats.totalBots}</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500">+8.7%</span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>{mockStats.activeBots} active</span>
              <span>{mockStats.totalBots - mockStats.activeBots} inactive</span>
            </div>
            <Progress value={(mockStats.activeBots / mockStats.totalBots) * 100} className="h-1 mt-1" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">${mockStats.mrr.toFixed(2)}</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500">+12.5%</span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>Annual: ${(mockStats.mrr * 12).toFixed(2)}</span>
              <span>Avg: $17.04/user</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">24.3%</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20">
                <ArrowUpRight className="h-3 w-3 text-red-500" />
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-red-500">-2.1%</span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>Visitors: 514</span>
              <span>Sign-ups: 125</span>
            </div>
            <Progress value={24.3} className="h-1 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Distribution</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStats.subscriptionTiers.map((tier) => (
                <div key={tier.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tier.name}</span>
                    <span className="text-sm font-medium">
                      {tier.users} ({tier.percentage}%)
                    </span>
                  </div>
                  <Progress value={tier.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {[3, 7, 5, 12, 4, 8, 15].map((value, i) => (
                <div key={i} className="bg-primary/10 rounded-sm" style={{ height: `${value * 4}px` }}></div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">3.2%</div>
              <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <ArrowDownRight className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
            <div className="mt-4 grid grid-cols-6 gap-1">
              {[4.1, 3.8, 4.3, 3.5, 3.2, 3.2].map((value, i) => (
                <div key={i} className="bg-primary/10 rounded-sm" style={{ height: `${value * 10}px` }}></div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-6 gap-1 text-xs text-muted-foreground text-center">
              <div>Jan</div>
              <div>Feb</div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>Jun</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
        <CardHeader>
          <CardTitle>Platform Management</CardTitle>
          <CardDescription>Manage users, bots, subscriptions, and system configurations</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, bots, subscriptions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bots">Bots</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Discord</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Bot Quota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.discordUsername}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.subscription === "Premium"
                                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                : user.subscription === "Standard"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : user.subscription === "Basic"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : ""
                            }
                          >
                            {user.subscription}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.activeBotQuota}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={user.status === "active" ? "bg-green-500" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="bots" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {bot.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              bot.status === "running"
                                ? "default"
                                : bot.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={bot.status === "running" ? "bg-green-500" : ""}
                          >
                            {bot.status === "running" ? "Running" : bot.status === "error" ? "Error" : "Offline"}
                          </Badge>
                        </TableCell>
                        <TableCell>{bot.owner}</TableCell>
                        <TableCell>{bot.createdAt}</TableCell>
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
                              <DropdownMenuItem>Edit Bot</DropdownMenuItem>
                              <DropdownMenuItem>View Logs</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete Bot</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              sub.plan === "Premium"
                                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                : sub.plan === "Standard"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : sub.plan === "Basic"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : ""
                            }
                          >
                            {sub.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={sub.status === "active" ? "default" : "secondary"}
                            className={sub.status === "active" ? "bg-green-500" : ""}
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.amount}</TableCell>
                        <TableCell>{sub.nextBilling}</TableCell>
                        <TableCell>{sub.startDate}</TableCell>
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
                              <DropdownMenuItem>Change Plan</DropdownMenuItem>
                              <DropdownMenuItem>View Invoices</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="config" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage global system settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stripe Price ID</label>
                        <Input value="price_1NcJjKLkjDFG8976HJKLmnop" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Bot Quota</label>
                        <Input type="number" value="1" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supported Chains</label>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>RPC URL</TableHead>
                              <TableHead>Currency</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Ethereum</TableCell>
                              <TableCell className="font-mono text-xs">
                                https://eth-mainnet.g.alchemy.com/v2/...
                              </TableCell>
                              <TableCell>ETH</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Polygon</TableCell>
                              <TableCell className="font-mono text-xs">
                                https://polygon-mainnet.g.alchemy.com/v2/...
                              </TableCell>
                              <TableCell>MATIC</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Arbitrum</TableCell>
                              <TableCell className="font-mono text-xs">
                                https://arb-mainnet.g.alchemy.com/v2/...
                              </TableCell>
                              <TableCell>ARB</TableCell>
                              <TableCell>
                                <Badge variant="secondary">Inactive</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="gradient-bg border-0 hover:opacity-90">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.resourceType}
                          </Badge>
                          <span className="ml-2 text-xs text-muted-foreground">{log.resourceId}</span>
                        </TableCell>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bot Type Distribution */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
        <CardHeader>
          <CardTitle>Bot Type Distribution</CardTitle>
          <CardDescription>Breakdown of bots by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(mockStats.botsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="capitalize">{type}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
