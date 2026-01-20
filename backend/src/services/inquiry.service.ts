import prisma from "@/config/database"
import { CreateInquiryInput, UpdateInquiryStatusInput } from "@/validators/inquiry"
import { sanitizeText, sanitizeInput, sanitizeEmail, sanitizePhone } from "@/utils/sanitize"

export class InquiryService {
  async createInquiry(data: CreateInquiryInput) {
    // Sanitize all user inputs
    const sanitizedData = {
      name: sanitizeInput(data.name, 100),
      email: sanitizeEmail(data.email),
      phone: sanitizePhone(data.phone),
      subject: sanitizeInput(data.subject, 200),
      message: sanitizeText(data.message), // Sanitize HTML in messages
      type: data.type || "GENERAL",
    }

    return prisma.inquiry.create({
      data: sanitizedData,
    })
  }

  async getInquiries(filters?: {
    status?: string
    type?: string
  }) {
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.type) {
      where.type = filters.type
    }

    return prisma.inquiry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async getInquiryById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async updateInquiryStatus(id: string, data: UpdateInquiryStatusInput, userId: string) {
    // Sanitize response if provided
    const sanitizedResponse = data.response ? sanitizeText(data.response) : null

    return prisma.inquiry.update({
      where: { id },
      data: {
        status: data.status,
        response: sanitizedResponse,
        respondedBy: userId,
      },
    })
  }

  async deleteInquiry(id: string) {
    return prisma.inquiry.delete({
      where: { id },
    })
  }
}
