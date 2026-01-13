import { FastifyRequest, FastifyReply } from "fastify"
import { LeaveService } from "@/services/leave.service"
import { createLeaveRequestSchema, updateLeaveStatusSchema } from "@/validators/leave"

const leaveService = new LeaveService()

export class LeaveController {
  async createLeaveRequest(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const body = createLeaveRequestSchema.parse(request.body)

      const leaveRequest = await leaveService.createLeaveRequest(body, request.user.id)

      return reply.status(201).send({
        success: true,
        data: leaveRequest,
        message: "Leave request submitted successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to create leave request",
      })
    }
  }

  async getLeaveRequests(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { userId, status } = request.query as any

      const filters: any = {}
      if (userId) filters.userId = userId
      if (status) filters.status = status
      // Add requester role to filter leaves appropriately
      filters.requesterRole = request.user.role
      // Add requester ID to exclude their own leaves when viewing as Manager
      filters.requesterId = request.user.id

      const leaveRequests = await leaveService.getLeaveRequests(filters)

      return reply.send({
        success: true,
        data: leaveRequests,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch leave requests",
      })
    }
  }

  async getLeaveRequestById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const leaveRequest = await leaveService.getLeaveRequestById(id)

      if (!leaveRequest) {
        return reply.status(404).send({
          success: false,
          message: "Leave request not found",
        })
      }

      return reply.send({
        success: true,
        data: leaveRequest,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch leave request",
      })
    }
  }

  async updateLeaveStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }
      const body = updateLeaveStatusSchema.parse(request.body)

      const leaveRequest = await leaveService.updateLeaveStatus(id, body, request.user.id, request.user.role)

      return reply.send({
        success: true,
        data: leaveRequest,
        message: `Leave request ${body.status.toLowerCase()} successfully`,
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to update leave request",
      })
    }
  }

  async getEmployeeLeaveRequests(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const leaveRequests = await leaveService.getEmployeeLeaveRequests(request.user.id)

      return reply.send({
        success: true,
        data: leaveRequests,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch leave requests",
      })
    }
  }
}
