export interface Bot {
  id: string
  userId: string
  name: string
  type: "price" | "marketcap" | "treasury" | "holders" | "supply" | "burn" | "liquidity" | "whale" | "custom"
  status: "offline_inactive" | "activating" | "running" | "deactivating" | "error"
  isActive: boolean
  discordBotToken: string // Encrypted
  updateIntervalSeconds: number // Fixed at 60
  config: BotConfig
  paidUpTillEpoch?: number
  lastRunEpoch?: number
  lastErrorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface BotConfig {
  // Common fields
  chainId?: string

  // Price Bot
  tokenAddress?: string
  displayFormat?: string

  // Whale Alert Bot
  thresholdAmount?: number
  targetChannelId?: string

  // Custom RPC Bot
  rpcUrl?: string
  rpcMethod?: string
  rpcParams?: string
  displayTemplate?: string
}
