"use client"

import { useState, useEffect, useMemo } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationsModal } from "@/components/notifications-modal"
import { notificationApi } from "@/lib/api/notification"
import { UserRole } from "@/lib/auth"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  role: UserRole
}

// Stable empty array for useEffect dependencies
const EMPTY_DEPS: never[] = []

export function DashboardHeader({ title, subtitle, role }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load unread count from API
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await notificationApi.getUnreadCount()
        setUnreadCount(count)
      } catch (error: any) {
        // Silently fail - don't show error for notification count
        // This prevents console spam if backend is not running
        console.debug("Failed to load unread count:", error.message)
        // Set to 0 on error to avoid showing stale count
        setUnreadCount(0)
      }
    }

    loadUnreadCount()
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, EMPTY_DEPS)

  return (
    <>
      <div className="border-b border-border bg-white p-4 lg:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1 pl-16 lg:pl-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative flex-shrink-0"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      <NotificationsModal
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        role={role}
      />
    </>
  )
}
