import { FastifyRequest, FastifyReply } from "fastify"
import { DoctorAvailabilityService } from "@/services/doctorAvailability.service"
import { z } from "zod"

const doctorAvailabilityService = new DoctorAvailabilityService()

const setAvailabilitySchema = z.object({
  date: z.string().refine(
    (val) => {
      // Accept both date strings (YYYY-MM-DD) and ISO datetime strings
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: "Invalid date format" }
  ),
  available: z.boolean(),
})

export class DoctorAvailabilityController {
  async getAvailability(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { date } = request.query as { date?: string }

      if (!date) {
        return reply.status(400).send({
          success: false,
          message: "Date parameter is required",
        })
      }

      const availability = await doctorAvailabilityService.getAvailability(new Date(date))

      return reply.send({
        success: true,
        data: availability,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch availability",
      })
    }
  }

  async setAvailability(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = setAvailabilitySchema.parse(request.body)

      const availability = await doctorAvailabilityService.setAvailability(
        new Date(body.date),
        body.available
      )

      return reply.send({
        success: true,
        data: availability,
        message: "Availability updated successfully",
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
        message: error.message || "Failed to update availability",
      })
    }
  }

  async getAvailabilityRange(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { startDate, endDate } = request.query as { startDate?: string; endDate?: string }

      if (!startDate || !endDate) {
        return reply.status(400).send({
          success: false,
          message: "startDate and endDate parameters are required",
        })
      }

      const availability = await doctorAvailabilityService.getAvailabilityRange(
        new Date(startDate),
        new Date(endDate)
      )

      return reply.send({
        success: true,
        data: availability,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch availability range",
      })
    }
  }
}
