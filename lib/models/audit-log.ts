export interface AuditLog {
  id: string
  userId: string
  action: string
  resourceType: "user" | "bot" | "system_config" | "billing"
  resourceId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}
