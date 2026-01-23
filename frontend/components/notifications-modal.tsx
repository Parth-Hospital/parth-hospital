"use client"

import { useState, useEffect } from "react"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserRole } from "@/lib/auth"
import { notificationApi, Notification } from "@/lib/api/notification"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { logger } from "@/lib/utils/logger"

interface NotificationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: UserRole
}

export function NotificationsModal({
  open,
  onOpenChange,
  role,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadNotifications()
      loadUnreadCount()
    }
  }, [open])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationApi.getNotifications()
      setNotifications(data)
    } catch (error: any) {
      // Only log in development
      logger.error("Failed to load notifications:", error)
      // Don't show toast for notifications, just fail silently
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await notificationApi.getUnreadCount()
      setUnreadCount(count)
    } catch (error: any) {
      // Only log in development
      logger.error("Failed to load unread count:", error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      await loadNotifications()
      await loadUnreadCount()
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      await loadNotifications()
      await loadUnreadCount()
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark all as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id)
      await loadNotifications()
      await loadUnreadCount()
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-100 text-green-800"
      case "WARNING":
        return "bg-yellow-100 text-yellow-800"
      case "ERROR":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadNotifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unreadNotifications.length > 0 && (
                <div className="space-y-2">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getTypeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            <h4 className="font-semibold">{notification.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {readNotifications.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Read Notifications
                  </h3>
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border border-border rounded-lg opacity-75"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getTypeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            <h4 className="font-semibold">{notification.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions for backward compatibility (if used elsewhere)
export function getNotificationsForRole(role: UserRole): Notification[] {
  // This is now handled by the backend, but keeping for compatibility
  return []
}

export function getUnreadCountForRole(role: UserRole): number {
  // This is now handled by the backend, but keeping for compatibility
  return 0
}
