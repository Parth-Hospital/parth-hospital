import { FastifyInstance } from "fastify"
import { PaymentController } from "@/controllers/payment.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const paymentController = new PaymentController()

export default async function paymentRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Get payments (Doctor, Accountant, Receptionist)
  fastify.get(
    "/",
    { preHandler: requireRole("DOCTOR", "ACCOUNTANT", "RECEPTIONIST") },
    (request, reply) => paymentController.getPayments(request, reply)
  )

  // Get payment stats (Doctor, Accountant, Receptionist)
  fastify.get(
    "/stats",
    { preHandler: requireRole("DOCTOR", "ACCOUNTANT", "RECEPTIONIST") },
    (request, reply) => paymentController.getPaymentStats(request, reply)
  )
}
