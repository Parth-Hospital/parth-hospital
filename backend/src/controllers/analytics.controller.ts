import { FastifyRequest, FastifyReply } from "fastify"
import { AnalyticsService } from "@/services/analytics.service"

const analyticsService = new AnalyticsService()

export class AnalyticsController {
  async getDoctorDashboardStats(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await analyticsService.getDoctorDashboardStats()
      return reply.send({
        success: true,
        data: stats,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch doctor dashboard stats",
      })
    }
  }

  async getManagerDashboardStats(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await analyticsService.getManagerDashboardStats()
      return reply.send({
        success: true,
        data: stats,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch manager dashboard stats",
      })
    }
  }

  async getReceptionistDashboardStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { date } = request.query as { date?: string }
      const targetDate = date ? new Date(date) : undefined
      const stats = await analyticsService.getReceptionistDashboardStats(targetDate)
      return reply.send({
        success: true,
        data: stats,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch receptionist dashboard stats",
      })
    }
  }

  async getEmployeeDashboardStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }
      const stats = await analyticsService.getEmployeeDashboardStats(userId)
      return reply.send({
        success: true,
        data: stats,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch employee dashboard stats",
      })
    }
  }
}
