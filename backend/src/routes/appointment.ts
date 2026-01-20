import { FastifyInstance } from "fastify"
import { AppointmentController } from "@/controllers/appointment.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const appointmentController = new AppointmentController()

export default async function appointmentRoutes(fastify: FastifyInstance) {
  // Public route - Create appointment (from website)
  fastify.post("/", (request, reply) => appointmentController.createAppointment(request, reply))

  // Get appointments (public or protected based on your needs)
  fastify.get("/", (request, reply) => appointmentController.getAppointments(request, reply))

  // Get single appointment
  fastify.get("/:id", (request, reply) => appointmentController.getAppointmentById(request, reply))

  // Protected routes - Receptionist and above
  fastify.get(
    "/current/bookings",
    { preHandler: [verifyToken, requireRole("RECEPTIONIST", "MANAGER", "DOCTOR")] },
    (request, reply) => appointmentController.getCurrentBookings(request, reply)
  )

  fastify.post(
    "/offline",
    { preHandler: [verifyToken, requireRole("RECEPTIONIST", "MANAGER", "DOCTOR")] },
    (request, reply) => appointmentController.createOfflineAppointment(request, reply)
  )

  fastify.patch(
    "/:id/status",
    { preHandler: [verifyToken, requireRole("RECEPTIONIST", "MANAGER", "DOCTOR")] },
    (request, reply) => appointmentController.updateAppointmentStatus(request, reply)
  )
}
