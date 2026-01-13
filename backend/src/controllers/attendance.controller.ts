import { FastifyRequest, FastifyReply } from "fastify"
import { AttendanceService } from "@/services/attendance.service"
import { createAttendanceSchema } from "@/validators/attendance"

const attendanceService = new AttendanceService()

export class AttendanceController {
  async createOrUpdateAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createAttendanceSchema.parse(request.body)

      const attendance = await attendanceService.createOrUpdateAttendance(body)

      return reply.send({
        success: true,
        data: attendance,
        message: "Attendance saved successfully",
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
        message: error.message || "Failed to save attendance",
      })
    }
  }

  async getAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, weekStartDate } = request.query as any

      const filters: any = {}
      if (userId) filters.userId = userId
      if (weekStartDate) filters.weekStartDate = new Date(weekStartDate)

      const attendance = await attendanceService.getAttendance(filters)

      return reply.send({
        success: true,
        data: attendance,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch attendance",
      })
    }
  }

  async getEmployeeAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params as { userId: string }
      const { weekStartDate } = request.query as any

      const attendance = await attendanceService.getEmployeeAttendance(
        userId,
        weekStartDate ? new Date(weekStartDate) : undefined
      )

      return reply.send({
        success: true,
        data: attendance,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch employee attendance",
      })
    }
  }

  async getWeeklyAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { weekStartDate } = request.query as { weekStartDate?: string }

      if (!weekStartDate) {
        return reply.status(400).send({
          success: false,
          message: "weekStartDate parameter is required",
        })
      }

      const attendance = await attendanceService.getWeeklyAttendance(new Date(weekStartDate))

      return reply.send({
        success: true,
        data: attendance,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch weekly attendance",
      })
    }
  }

  async bulkCreateOrUpdateAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { records: any[] }
      
      if (!Array.isArray(body.records)) {
        return reply.status(400).send({
          success: false,
          message: "Records array is required",
        })
      }

      // Validate all records
      const validatedRecords = body.records.map((record) =>
        createAttendanceSchema.parse(record)
      )

      const attendance = await attendanceService.bulkCreateOrUpdateAttendance(validatedRecords)

      return reply.send({
        success: true,
        data: attendance,
        message: "Bulk attendance saved successfully",
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
        message: error.message || "Failed to save bulk attendance",
      })
    }
  }
}
