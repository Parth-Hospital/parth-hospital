import { FastifyRequest, FastifyReply } from "fastify"
import { NotificationService } from "@/services/notification.service"

const notificationService = new NotificationService()

export class NotificationController {
  async getUserNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { read } = request.query as { read?: string }

      const filters: any = {}
      if (read !== undefined) {
        filters.read = read === "true"
      }

      const notifications = await notificationService.getUserNotifications(
        request.user.id,
        filters
      )

      return reply.send({
        success: true,
        data: notifications,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch notifications",
      })
    }
  }

  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const count = await notificationService.getUnreadCount(request.user.id)

      return reply.send({
        success: true,
        data: { count },
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch unread count",
      })
    }
  }

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }

      const notification = await notificationService.markAsRead(id, request.user.id)

      return reply.send({
        success: true,
        data: notification,
        message: "Notification marked as read",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to mark notification as read",
      })
    }
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      await notificationService.markAllAsRead(request.user.id)

      return reply.send({
        success: true,
        message: "All notifications marked as read",
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to mark all notifications as read",
      })
    }
  }

  async deleteNotification(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }

      await notificationService.deleteNotification(id, request.user.id)

      return reply.send({
        success: true,
        message: "Notification deleted successfully",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to delete notification",
      })
    }
  }
}
