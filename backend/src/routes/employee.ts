import { FastifyInstance } from "fastify"
import { EmployeeController } from "@/controllers/employee.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const employeeController = new EmployeeController()

export default async function employeeRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Get all employees (Owner, Manager can view all)
  fastify.get(
    "/",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.getEmployees(request, reply)
  )

  // Get single employee
  fastify.get(
    "/:id",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.getEmployeeById(request, reply)
  )

  // Create employee (Owner, Manager)
  fastify.post(
    "/",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.createEmployee(request, reply)
  )

  // Update employee (Owner, Manager)
  fastify.patch(
    "/:id",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.updateEmployee(request, reply)
  )

  // Generate admin credentials (Owner, Manager)
  fastify.post(
    "/:id/generate-creds",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.generateAdminCredentials(request, reply)
  )

  // Update admin password (Owner, Manager)
  fastify.patch(
    "/:id/update-password",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.updateAdminPassword(request, reply)
  )

  // Delete employee (Owner, Manager)
  fastify.delete(
    "/:id",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => employeeController.deleteEmployee(request, reply)
  )
}
