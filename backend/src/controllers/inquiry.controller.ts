import { FastifyRequest, FastifyReply } from "fastify"
import { InquiryService } from "@/services/inquiry.service"
import { createInquirySchema, updateInquiryStatusSchema } from "@/validators/inquiry"

const inquiryService = new InquiryService()

export class InquiryController {
  async createInquiry(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createInquirySchema.parse(request.body)

      const inquiry = await inquiryService.createInquiry(body)

      return reply.status(201).send({
        success: true,
        data: inquiry,
        message: "Inquiry submitted successfully",
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
        message: error.message || "Failed to create inquiry",
      })
    }
  }

  async getInquiries(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { status, type } = request.query as any

      const filters: any = {}
      if (status) filters.status = status
      if (type) filters.type = type

      const inquiries = await inquiryService.getInquiries(filters)

      return reply.send({
        success: true,
        data: inquiries,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch inquiries",
      })
    }
  }

  async getInquiryById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const inquiry = await inquiryService.getInquiryById(id)

      if (!inquiry) {
        return reply.status(404).send({
          success: false,
          message: "Inquiry not found",
        })
      }

      return reply.send({
        success: true,
        data: inquiry,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch inquiry",
      })
    }
  }

  async updateInquiryStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateInquiryStatusSchema.parse(request.body)

      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const inquiry = await inquiryService.updateInquiryStatus(id, body, request.user.id)

      return reply.send({
        success: true,
        data: inquiry,
        message: "Inquiry status updated successfully",
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
        message: error.message || "Failed to update inquiry status",
      })
    }
  }

  async deleteInquiry(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      await inquiryService.deleteInquiry(id)

      return reply.send({
        success: true,
        message: "Inquiry deleted successfully",
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to delete inquiry",
      })
    }
  }
}
