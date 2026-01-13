import { FastifyInstance } from "fastify"
import { NotificationController } from "@/controllers/notification.controller"
import { verifyToken } from "@/middleware/auth"

const notificationController = new NotificationController()

export default async function notificationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Get user notifications
  fastify.get("/", (request, reply) =>
    notificationController.getUserNotifications(request, reply)
  )

  // Get unread count
  fastify.get("/unread-count", (request, reply) =>
    notificationController.getUnreadCount(request, reply)
  )

  // Mark as read
  fastify.patch("/:id/read", (request, reply) =>
    notificationController.markAsRead(request, reply)
  )

  // Mark all as read
  fastify.patch("/read-all", (request, reply) =>
    notificationController.markAllAsRead(request, reply)
  )

  // Delete notification
  fastify.delete("/:id", (request, reply) =>
    notificationController.deleteNotification(request, reply)
  )
}
