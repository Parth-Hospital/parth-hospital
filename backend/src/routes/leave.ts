import { FastifyInstance } from "fastify"
import { LeaveController } from "@/controllers/leave.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const leaveController = new LeaveController()

export default async function leaveRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Create leave request (Employee)
  fastify.post("/", (request, reply) => leaveController.createLeaveRequest(request, reply))

  // Get all leave requests (Manager, Owner)
  fastify.get(
    "/",
    { preHandler: requireRole("OWNER", "MANAGER") },
    (request, reply) => leaveController.getLeaveRequests(request, reply)
  )

  // Get single leave request
  fastify.get("/:id", (request, reply) => leaveController.getLeaveRequestById(request, reply))

  // Get employee's own leave requests
  fastify.get("/employee/my", (request, reply) =>
    leaveController.getEmployeeLeaveRequests(request, reply)
  )

  // Approve/Reject leave request (Manager for non-Manager leaves, Owner for Manager leaves)
  fastify.patch(
    "/:id/status",
    { preHandler: requireRole("MANAGER", "OWNER") },
    (request, reply) => leaveController.updateLeaveStatus(request, reply)
  )
}
