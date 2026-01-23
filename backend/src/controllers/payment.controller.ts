import { FastifyRequest, FastifyReply } from "fastify"
import { PaymentService } from "@/services/payment.service"
import { PaymentStatus, PaymentMethod } from "@prisma/client"

const paymentService = new PaymentService()

export class PaymentController {
  async getPayments(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any
      const filters: any = {}

      if (query.status) {
        filters.status = query.status as PaymentStatus
      }

      if (query.method) {
        filters.method = query.method as PaymentMethod
      }

      if (query.startDate) {
        filters.startDate = new Date(query.startDate)
      }

      if (query.endDate) {
        filters.endDate = new Date(query.endDate)
      }

      const payments = await paymentService.getPayments(filters)

      return reply.send({
        success: true,
        data: payments,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch payments",
      })
    }
  }

  async getPaymentStats(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await paymentService.getPaymentStats()

      return reply.send({
        success: true,
        data: stats,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch payment stats",
      })
    }
  }
}
