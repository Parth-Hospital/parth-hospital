import prisma from "@/config/database"
import { NotificationType } from "@prisma/client"

export class NotificationService {
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO"
  ) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    })
  }

  async getUserNotifications(userId: string, filters?: { read?: boolean }) {
    const where: any = { userId }

    if (filters?.read !== undefined) {
      where.read = filters.read
    }

    return prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    })
  }

  async markAsRead(id: string, userId: string) {
    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or unauthorized")
    }

    return prisma.notification.update({
      where: { id },
      data: { read: true },
    })
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })
  }

  async deleteNotification(id: string, userId: string) {
    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or unauthorized")
    }

    return prisma.notification.delete({
      where: { id },
    })
  }
}
