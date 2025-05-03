"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Users, Bot, DollarSign, RefreshCw, ArrowUpRight, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Replace the mockStats with state variables
export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState("last30days")
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBots: 0,
    activeBots: 0,
    mrr: 0,
    botsByType: {},
    revenueByMonth: [],
    userGrowth: [],
    botGrowth: [],
    subscriptionTiers: [],
  })

  // Add useEffect to fetch real data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInitial(true)
      try {
        const response = await fetch(`/api/admin/dashboard-stats?range=${dateRange}`)
        if (!response.ok) throw new Error("Failed to fetch dashboard stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingInitial(false)
      }
    }

    fetchData()
  }, [dateRange, toast])

  const refreshData = () => {
    setIsLoading(true)

    // Fetch data again with the current date range
    fetch(`/api/admin/dashboard-stats?range=${dateRange}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch dashboard stats")
        return response.json()
      })
      .then((data) => {
        setStats(data)
        toast({
          title: "Data Refreshed",
          description: "Dashboard data has been updated successfully.",
        })
      })
      .catch((error) => {
        console.error("Error refreshing data:", error)
        toast({
          title: "Error",
          description: "Failed to refresh data. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Show loading state
  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Update the JSX to use the state variables
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
          <Button className="gradient-bg border-0 hover:opacity-90">
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
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              {stats.userGrowthPercentage && (
                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                </div>
              )}
            </div>
            {stats.userGrowthPercentage && (
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500">+{stats.userGrowthPercentage}%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
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
              <div className="text-2xl font-bold">{stats.totalBots}</div>
              {stats.botGrowthPercentage && (
                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                </div>
              )}
            </div>
            {stats.botGrowthPercentage && (
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500">+{stats.botGrowthPercentage}%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>{stats.activeBots} active</span>
              <span>{stats.totalBots - stats.activeBots} inactive</span>
            </div>
            <Progress
              value={stats.totalBots > 0 ? (stats.activeBots / stats.totalBots) * 100 : 0}
              className="h-1 mt-1"
            />
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
              <div className="text-2xl font-bold">${stats.mrr.toFixed(2)}</div>
              {stats.revenueGrowthPercentage && (
                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                </div>
              )}
            </div>
            {stats.revenueGrowthPercentage && (
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500">+{stats.revenueGrowthPercentage}%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>Annual: ${(stats.mrr * 12).toFixed(2)}</span>
              <span>Avg: ${stats.totalUsers > 0 ? (stats.mrr / stats.totalUsers).toFixed(2) : "0.00"}/user</span>
            </div>
          </CardContent>
        </Card>

        {/* Keep the rest of the cards and content as they are, but update to use stats instead of mockStats */}
      </div>

      {/* Rest of the dashboard content */}
    </div>
  )
}
