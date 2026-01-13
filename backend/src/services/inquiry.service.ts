import prisma from "@/config/database"
import { CreateInquiryInput, UpdateInquiryStatusInput } from "@/validators/inquiry"

export class InquiryService {
  async createInquiry(data: CreateInquiryInput) {
    return prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        type: data.type || "GENERAL",
      },
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
    return prisma.inquiry.update({
      where: { id },
      data: {
        status: data.status,
        response: data.response,
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
