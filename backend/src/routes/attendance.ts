import { FastifyInstance } from "fastify"
import { AttendanceController } from "@/controllers/attendance.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const attendanceController = new AttendanceController()

export default async function attendanceRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Upload/Update attendance (Manager only)
  fastify.post(
    "/",
    { preHandler: requireRole("MANAGER") },
    (request, reply) => attendanceController.createOrUpdateAttendance(request, reply)
  )

  // Get all attendance (Doctor, Manager)
  fastify.get(
    "/",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => attendanceController.getAttendance(request, reply)
  )

  // Get weekly attendance (Doctor, Manager)
  fastify.get(
    "/weekly",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => attendanceController.getWeeklyAttendance(request, reply)
  )

  // Get employee's own attendance (Employee, and admins using employee credentials)
  fastify.get(
    "/employee/:userId",
    { preHandler: requireRole("EMPLOYEE", "DOCTOR", "MANAGER", "ACCOUNTANT", "RECEPTIONIST") },
    (request, reply) => attendanceController.getEmployeeAttendance(request, reply)
  )

  // Bulk upload attendance (Manager only)
  fastify.post(
    "/bulk",
    { preHandler: requireRole("MANAGER") },
    (request, reply) => attendanceController.bulkCreateOrUpdateAttendance(request, reply)
  )
}
