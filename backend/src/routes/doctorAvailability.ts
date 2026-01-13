import { FastifyInstance } from "fastify"
import { DoctorAvailabilityController } from "@/controllers/doctorAvailability.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const doctorAvailabilityController = new DoctorAvailabilityController()

export default async function doctorAvailabilityRoutes(fastify: FastifyInstance) {
  // Public route - Check availability (for booking page)
  fastify.get("/", (request, reply) =>
    doctorAvailabilityController.getAvailability(request, reply)
  )

  // Protected route - Set availability (Owner only)
  fastify.post(
    "/",
    { preHandler: [verifyToken, requireRole("OWNER")] },
    (request, reply) => doctorAvailabilityController.setAvailability(request, reply)
  )

  // Get availability range
  fastify.get("/range", (request, reply) =>
    doctorAvailabilityController.getAvailabilityRange(request, reply)
  )
}
