"use client"

import { useState, memo } from "react"
import { Bot, Settings, Power, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface BotCardProps {
  bot: {
    id: string
    name: string
    type: string
    status: "offline_inactive" | "activating" | "running" | "deactivating" | "error"
    info: string
    config?: any
  }
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
  isLoading: boolean
}

function BotCardComponent({ bot, onActivate, onDeactivate, onDelete, isLoading }: BotCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const getStatusColor = () => {
    switch (bot.status) {
      case "running":
        return "bg-green-500"
      case "activating":
        return "bg-yellow-500"
      case "deactivating":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (bot.status) {
      case "offline_inactive":
        return "Offline (Inactive)"
      case "activating":
        return "Activating..."
      case "running":
        return "Running"
      case "deactivating":
        return "Deactivating..."
      case "error":
        return "Error"
    }
  }

  const getBotTypeIcon = () => {
    switch (bot.type) {
      case "price":
        return (
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "marketcap":
        return (
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        )
      case "whale":
        return (
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      default:
        return <Bot className="h-5 w-5 text-primary" />
    }
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">{getBotTypeIcon()}</div>
            <div>
              <h3 className="font-medium">{bot.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{bot.type} Bot</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor()} status-pulse`}></span>
            <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Info: </span>
            <span>{bot.info}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Updates every 60s</span>
            {bot.config?.decimalPlaces !== undefined && (
              <Badge variant="outline" className="text-xs">
                {bot.config.decimalPlaces} decimals
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/50">
        <div className="flex justify-between w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setShowDetailsDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View bot details and configuration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex gap-2">
            {bot.status === "offline_inactive" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500 hover:text-green-600 hover:border-green-600"
                      onClick={onActivate}
                      disabled={isLoading}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start this bot</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-500 hover:text-amber-600 hover:border-amber-600"
                      onClick={onDeactivate}
                      disabled={isLoading || bot.status === "deactivating"}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stop this bot</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:border-red-600"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Bot</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{bot.name}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDelete()
                      setShowDeleteDialog(false)
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardFooter>

      {/* Bot Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bot Details: {bot.name}</DialogTitle>
            <DialogDescription>Configuration and status information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`}></span>
                  <span>{getStatusText()}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Type</h4>
                <p className="capitalize">{bot.type} Bot</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Configuration</h4>
              <div className="bg-muted p-4 rounded-md space-y-2">
                {bot.config?.tokenAddress && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Token Address:</span>
                    <span className="text-sm font-mono col-span-2 truncate">{bot.config.tokenAddress}</span>
                  </div>
                )}
                {bot.config?.pairedTokenAddress && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Paired Token:</span>
                    <span className="text-sm font-mono col-span-2 truncate">{bot.config.pairedTokenAddress}</span>
                  </div>
                )}
                {bot.config?.displayFormat && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Display Format:</span>
                    <span className="text-sm col-span-2">{bot.config.displayFormat}</span>
                  </div>
                )}
                {bot.config?.decimalPlaces !== undefined && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Decimal Places:</span>
                    <span className="text-sm col-span-2">{bot.config.decimalPlaces}</span>
                  </div>
                )}
                {bot.config?.thresholdAmount && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Threshold Amount:</span>
                    <span className="text-sm col-span-2">{bot.config.thresholdAmount}</span>
                  </div>
                )}
                {bot.config?.webhookUrl && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Webhook URL:</span>
                    <div className="text-sm font-mono col-span-2 flex items-center gap-1 truncate">
                      <span className="truncate">{bot.config.webhookUrl}</span>
                      <a
                        href={bot.config.webhookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Update Interval:</span>
                  <span className="text-sm col-span-2">60 seconds</span>
                </div>
              </div>
            </div>

            {bot.status === "error" && (
              <div>
                <h4 className="text-sm font-medium text-red-500 mb-1">Error Information</h4>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-md">
                  <p className="text-sm text-red-500">
                    Failed to connect to Discord API. Please check your bot token and try again.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button className="gradient-bg border-0 hover:opacity-90">Edit Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const BotCard = memo(BotCardComponent)
