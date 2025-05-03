export interface SystemConfig {
  id: string
  key: string
  value: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChainConfig {
  id: string
  name: string
  rpcUrl: string
  explorerUrl: string
  currencySymbol: string
  isActive: boolean
}
