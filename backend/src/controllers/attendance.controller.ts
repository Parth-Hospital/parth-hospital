import { FastifyRequest, FastifyReply } from "fastify"
import { AttendanceService } from "@/services/attendance.service"
import { logger } from "@/utils/logger"
import { 
  createDailyAttendanceSchema, 
  bulkCreateAttendanceSchema,
  getAttendanceByDateRangeSchema 
} from "@/validators/attendance"

const attendanceService = new AttendanceService()

export class AttendanceController {
  // Create or update a single daily attendance record
  async createOrUpdateAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createDailyAttendanceSchema.parse(request.body)

      const attendance = await attendanceService.createOrUpdateDailyAttendance(body)

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

  // Get attendance by date range
  async getAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, startDate, endDate } = request.query as any

      if (!startDate || !endDate) {
        return reply.status(400).send({
          success: false,
          message: "startDate and endDate parameters are required",
        })
      }

      const query = getAttendanceByDateRangeSchema.parse({
        userId,
        startDate,
        endDate,
      })

      const attendance = await attendanceService.getAttendanceByDateRange({
        userId: query.userId,
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      })

      return reply.send({
        success: true,
        data: attendance,
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      // Log error for debugging
      logger.error("Error in getAttendance:", {
        error: error.message,
        stack: error.stack,
        query: request.query,
      })

      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch attendance",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Get employee's own attendance by date range
  async getEmployeeAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params as { userId: string }
      const { startDate, endDate } = request.query as any

      if (!startDate || !endDate) {
        return reply.status(400).send({
          success: false,
          message: "startDate and endDate parameters are required",
        })
      }

      const attendance = await attendanceService.getEmployeeAttendance(
        userId,
        new Date(startDate),
        new Date(endDate)
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

  // Deprecated: For backward compatibility, redirects to getAttendance
  async getWeeklyAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { weekStartDate } = request.query as { weekStartDate?: string }

      if (!weekStartDate) {
        return reply.status(400).send({
          success: false,
          message: "weekStartDate parameter is required (deprecated - use startDate/endDate instead)",
        })
      }

      // Calculate week range from weekStartDate
      const startDate = new Date(weekStartDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6) // 7 days total (Monday-Sunday)

      const attendance = await attendanceService.getAttendanceByDateRange({
        startDate,
        endDate,
      })

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

  // Bulk create or update daily attendance records
  async bulkCreateOrUpdateAttendance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = bulkCreateAttendanceSchema.parse(request.body)

      const result = await attendanceService.bulkCreateOrUpdateAttendance(body.records)

      return reply.send({
        success: true,
        data: result,
        message: `Successfully processed ${result.success} records (${result.failed} failed)`,
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
