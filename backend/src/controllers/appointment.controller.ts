import { FastifyRequest, FastifyReply } from "fastify"
import { AppointmentService } from "@/services/appointment.service"
import {
  createAppointmentSchema,
  createOfflineAppointmentSchema,
  updateAppointmentStatusSchema,
} from "@/validators/appointment"

const appointmentService = new AppointmentService()

export class AppointmentController {
  async createAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createAppointmentSchema.parse(request.body)
      const userId = request.user?.id

      // Check for QA mode from query parameter or header
      const qaMode =
        (request.query as any)?.qa === "true" ||
        request.headers["x-qa-mode"] === "true"

      const appointment = await appointmentService.createAppointment(body, userId, qaMode)

      return reply.status(201).send({
        success: true,
        data: appointment,
        message: "Appointment created successfully",
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
        message: error.message || "Failed to create appointment",
      })
    }
  }

  async createOfflineAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createOfflineAppointmentSchema.parse(request.body)

      const appointment = await appointmentService.createOfflineAppointment(body)

      return reply.status(201).send({
        success: true,
        data: appointment,
        message: "Offline appointment created successfully",
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
        message: error.message || "Failed to create offline appointment",
      })
    }
  }

  async getAppointments(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { date, status, appointmentType } = request.query as any

      const filters: any = {}
      if (date) filters.date = new Date(date)
      if (status) filters.status = status
      if (appointmentType) filters.appointmentType = appointmentType

      const appointments = await appointmentService.getAppointments(filters)

      return reply.send({
        success: true,
        data: appointments,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch appointments",
      })
    }
  }

  async getCurrentBookings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { date } = request.query as any
      const targetDate = date ? new Date(date) : undefined

      const result = await appointmentService.getCurrentBookings(targetDate)

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch current bookings",
      })
    }
  }

  async getAppointmentById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const appointment = await appointmentService.getAppointmentById(id)

      if (!appointment) {
        return reply.status(404).send({
          success: false,
          message: "Appointment not found",
        })
      }

      return reply.send({
        success: true,
        data: appointment,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch appointment",
      })
    }
  }

  async updateAppointmentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateAppointmentStatusSchema.parse(request.body)

      const appointment = await appointmentService.updateAppointmentStatus(id, body.status)

      return reply.send({
        success: true,
        data: appointment,
        message: "Appointment status updated successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to update appointment status",
      })
    }
  }

  async markDailyAppointmentsAsCompleted(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { date } = request.body as { date: string }
      const targetDate = date ? new Date(date) : new Date()

      const result = await appointmentService.markDailyAppointmentsAsCompleted(targetDate)

      return reply.send({
        success: true,
        data: result,
        message: `Successfully marked ${result.count} appointments as completed`,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to update appointments",
      })
    }
  }
}
