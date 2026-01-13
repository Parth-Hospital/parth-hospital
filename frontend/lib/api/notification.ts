import { apiClient } from "./client"

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface UnreadCountResponse {
  count: number
}

export const notificationApi = {
  getNotifications: async (filters?: { read?: boolean }): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/notifications", filters)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch notifications")
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>("/notifications/unread-count")
    if (response.success && response.data) {
      return response.data.count
    }
    throw new Error(response.message || "Failed to fetch unread count")
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`, {})
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to mark notification as read")
  },

  markAllAsRead: async (): Promise<void> => {
    const response = await apiClient.patch<void>("/notifications/read-all", {})
    if (!response.success) {
      throw new Error(response.message || "Failed to mark all notifications as read")
    }
  },

  deleteNotification: async (id: string): Promise<void> => {
    const response = await apiClient.delete<void>(`/notifications/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete notification")
    }
  },
}
