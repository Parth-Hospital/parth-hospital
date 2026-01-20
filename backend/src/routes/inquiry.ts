import { FastifyInstance } from "fastify"
import { InquiryController } from "@/controllers/inquiry.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const inquiryController = new InquiryController()

export default async function inquiryRoutes(fastify: FastifyInstance) {
  // Public route - Create inquiry (from contact form)
  fastify.post("/", (request, reply) => inquiryController.createInquiry(request, reply))

  // Protected routes - View and manage inquiries
  fastify.get(
    "/",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER", "RECEPTIONIST")] },
    (request, reply) => inquiryController.getInquiries(request, reply)
  )

  fastify.get(
    "/:id",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER", "RECEPTIONIST")] },
    (request, reply) => inquiryController.getInquiryById(request, reply)
  )

  fastify.patch(
    "/:id/status",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER", "RECEPTIONIST")] },
    (request, reply) => inquiryController.updateInquiryStatus(request, reply)
  )

  fastify.delete(
    "/:id",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER")] },
    (request, reply) => inquiryController.deleteInquiry(request, reply)
  )
}
