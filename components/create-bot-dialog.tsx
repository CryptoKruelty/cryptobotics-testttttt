"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Zap, Shield, BarChart3, Users, Wallet, Flame, Droplet, Bell } from "lucide-react"

interface CreateBotDialogProps {
  children: React.ReactNode
  onBotCreated?: (bot: any) => void
}

const botTypes = [
  {
    id: "price",
    name: "Price Bot",
    description: "Displays the current price of a token in the bot's nickname.",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    id: "marketcap",
    name: "Market Cap Bot",
    description: "Shows the market capitalization of a token.",
    icon: BarChart3,
    color: "bg-blue-500",
  },
  {
    id: "treasury",
    name: "Treasury Bot",
    description: "Displays the balance of a treasury wallet.",
    icon: Wallet,
    color: "bg-purple-500",
  },
  {
    id: "holders",
    name: "Holders Bot",
    description: "Shows the number of token holders.",
    icon: Users,
    color: "bg-yellow-500",
  },
  {
    id: "supply",
    name: "Supply Bot",
    description: "Displays the circulating supply of a token.",
    icon: Zap,
    color: "bg-indigo-500",
  },
  {
    id: "burn",
    name: "Burn Bot",
    description: "Shows the amount of tokens in a burn wallet.",
    icon: Flame,
    color: "bg-red-500",
  },
  {
    id: "liquidity",
    name: "Liquidity Bot",
    description: "Displays the liquidity pool value.",
    icon: Droplet,
    color: "bg-cyan-500",
  },
  {
    id: "whale",
    name: "Whale Alert Bot",
    description: "Sends alerts when large transactions occur.",
    icon: Bell,
    color: "bg-amber-500",
  },
  {
    id: "custom",
    name: "Custom RPC Bot",
    description: "Create a custom bot using RPC calls to fetch any on-chain data.",
    icon: Shield,
    color: "bg-slate-500",
  },
]

export function CreateBotDialog({ children, onBotCreated }: CreateBotDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [botType, setBotType] = useState("")
  const [botName, setBotName] = useState("")
  const [botToken, setBotToken] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [pairedTokenAddress, setPairedTokenAddress] = useState("")
  const [displayFormat, setDisplayFormat] = useState("")
  const [decimalPlaces, setDecimalPlaces] = useState("4")
  const [thresholdAmount, setThresholdAmount] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = useCallback(() => {
    setStep(1)
    setBotType("")
    setBotName("")
    setBotToken("")
    setTokenAddress("")
    setPairedTokenAddress("")
    setDisplayFormat("")
    setDecimalPlaces("4")
    setThresholdAmount("")
    setWebhookUrl("")
  }, [])

  const handleNext = useCallback(() => {
    setStep((prevStep) => prevStep + 1)
  }, [])

  const handleBack = useCallback(() => {
    setStep((prevStep) => prevStep - 1)
  }, [])

  const handleCreate = useCallback(() => {
    setIsLoading(true)

    // In a real implementation, this would be an API call
    setTimeout(() => {
      const newBot = {
        id: `bot${Date.now()}`,
        name: botName,
        type: botType,
        status: "offline_inactive",
        info:
          botType === "price"
            ? `Displays price for ${tokenAddress.substring(0, 6)}...`
            : botType === "whale"
              ? `Alerts on transactions over ${thresholdAmount} ETH`
              : "Custom configuration",
        config: {
          tokenAddress,
          pairedTokenAddress: pairedTokenAddress || undefined,
          displayFormat,
          decimalPlaces: Number.parseInt(decimalPlaces),
          thresholdAmount: thresholdAmount ? Number.parseInt(thresholdAmount) : undefined,
          webhookUrl: webhookUrl || undefined,
        },
      }

      setIsLoading(false)
      setOpen(false)
      resetForm()

      if (onBotCreated) {
        onBotCreated(newBot)
      }

      toast({
        title: "Bot Created",
        description: "Your bot has been created successfully. Activate it to start receiving updates.",
      })
    }, 1000)
  }, [
    botName,
    botType,
    tokenAddress,
    pairedTokenAddress,
    displayFormat,
    decimalPlaces,
    thresholdAmount,
    webhookUrl,
    resetForm,
    onBotCreated,
    toast,
  ])

  const isNextDisabled = useMemo(() => {
    if (step === 1) return !botType
    if (step === 2) return !botName || !botToken
    if (step === 3) {
      if (botType === "price" || botType === "marketcap") {
        return !tokenAddress
      }
      if (botType === "whale") {
        return !tokenAddress || !thresholdAmount || !webhookUrl
      }
    }
    return false
  }, [step, botType, botName, botToken, tokenAddress, thresholdAmount, webhookUrl])

  // Handle dialog open state changes
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      // We no longer need to manage scrollbar width manually 
      // as it's handled by our global CSS
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    },
    [resetForm],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create a New Bot</DialogTitle>
          <DialogDescription>Set up a new Discord bot to display cryptocurrency data</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Select Bot Type</h3>
              <p className="text-sm text-muted-foreground">Choose the type of bot you want to create</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {botTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${botType === type.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setBotType(type.id)}
                >
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center mb-2`}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-md">{type.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bot-token">Discord Bot Token</Label>
              <Input
                id="bot-token"
                type="password"
                placeholder="Enter your Discord bot token"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can create a bot and get its token from the{" "}
                <a
                  href="https://discord.com/developers/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Discord Developer Portal
                </a>
                .
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name</Label>
              <Input
                id="bot-name"
                placeholder="Enter a name for your bot"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 pt-4">
                {(botType === "price" ||
                  botType === "marketcap" ||
                  botType === "supply" ||
                  botType === "burn" ||
                  botType === "liquidity" ||
                  botType === "whale" ||
                  botType === "holders") && (
                  <div className="space-y-2">
                    <Label htmlFor="token-address">Token Contract Address</Label>
                    <Input
                      id="token-address"
                      placeholder="0x..."
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                    />
                  </div>
                )}

                {(botType === "price" || botType === "liquidity") && (
                  <div className="space-y-2">
                    <Label htmlFor="paired-token-address">Paired Token Address (Optional)</Label>
                    <Input
                      id="paired-token-address"
                      placeholder="0x..."
                      value={pairedTokenAddress}
                      onChange={(e) => setPairedTokenAddress(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      For price pairs like ETH/USDT, enter the paired token address
                    </p>
                  </div>
                )}

                {(botType === "price" ||
                  botType === "marketcap" ||
                  botType === "supply" ||
                  botType === "burn" ||
                  botType === "liquidity") && (
                  <div className="space-y-2">
                    <Label htmlFor="display-format">Display Format</Label>
                    <Input
                      id="display-format"
                      placeholder={botType === "price" ? "$SYMBOL: $PRICE" : "$SYMBOL: $VALUE"}
                      value={displayFormat}
                      onChange={(e) => setDisplayFormat(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {botType === "price" && "Use $SYMBOL, $PRICE, $CHANGE24H as placeholders"}
                      {botType === "marketcap" && "Use $SYMBOL, $MARKETCAP as placeholders"}
                      {botType === "supply" && "Use $SYMBOL, $SUPPLY as placeholders"}
                      {botType === "burn" && "Use $SYMBOL, $BURNED as placeholders"}
                      {botType === "liquidity" && "Use $SYMBOL, $LIQUIDITY as placeholders"}
                    </p>
                  </div>
                )}

                {botType === "whale" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Threshold Amount</Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="1000"
                        value={thresholdAmount}
                        onChange={(e) => setThresholdAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Discord webhook URL where alerts will be sent</p>
                    </div>
                  </>
                )}

                {botType === "custom" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rpc-url">RPC URL</Label>
                      <Input id="rpc-url" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rpc-method">RPC Method</Label>
                      <Input id="rpc-method" placeholder="eth_call" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rpc-params">RPC Parameters (JSON)</Label>
                      <Textarea id="rpc-params" placeholder='[{"to": "0x...", "data": "0x..."}]' />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display-template">Display Template</Label>
                      <Input id="display-template" placeholder="Balance: $RESULT" />
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="update-interval">Update Interval</Label>
                  <div className="flex items-center">
                    <Input id="update-interval" value="60" disabled />
                    <span className="ml-2">seconds</span>
                  </div>
                  <p className="text-xs text-muted-foreground">All bots update every 60 seconds (fixed)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Input
                    id="decimal-places"
                    type="number"
                    min="0"
                    max="18"
                    placeholder="4"
                    value={decimalPlaces}
                    onChange={(e) => setDecimalPlaces(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of decimal places to display for numeric values (e.g., 4 would show 0.0001)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-2">Bot Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{botName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{botType} Bot</span>
                </div>
                {tokenAddress && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token:</span>
                    <span className="truncate max-w-[200px]">{tokenAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decimal Places:</span>
                  <span>{decimalPlaces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Update Interval:</span>
                  <span>60 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>Inactive (will be offline after creation)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Please review the configuration above. Once you create the bot, you'll need to activate it separately.
            </p>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled || isLoading}
              className="gradient-bg border-0 hover:opacity-90"
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isLoading} className="gradient-bg border-0 hover:opacity-90">
              {isLoading ? "Creating..." : "Create Bot"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
