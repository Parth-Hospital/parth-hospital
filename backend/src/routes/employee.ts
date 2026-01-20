import { FastifyInstance } from "fastify"
import { EmployeeController } from "@/controllers/employee.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const employeeController = new EmployeeController()

export default async function employeeRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Get all employees (Doctor, Manager can view all)
  fastify.get(
    "/",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.getEmployees(request, reply)
  )

  // Get single employee
  fastify.get(
    "/:id",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.getEmployeeById(request, reply)
  )

  // Create employee (Doctor, Manager)
  fastify.post(
    "/",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.createEmployee(request, reply)
  )

  // Update employee (Doctor, Manager)
  fastify.patch(
    "/:id",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.updateEmployee(request, reply)
  )

  // Generate admin credentials (Doctor, Manager)
  fastify.post(
    "/:id/generate-creds",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.generateAdminCredentials(request, reply)
  )

  // Update admin password (Doctor, Manager)
  fastify.patch(
    "/:id/update-password",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.updateAdminPassword(request, reply)
  )

  // Delete employee (Doctor, Manager)
  fastify.delete(
    "/:id",
    { preHandler: requireRole("DOCTOR", "MANAGER") },
    (request, reply) => employeeController.deleteEmployee(request, reply)
  )
}
