import prisma from "@/config/database"
import { PaymentStatus, PaymentMethod } from "@prisma/client"

export class PaymentService {
  async getPayments(filters?: {
    status?: PaymentStatus
    method?: PaymentMethod
    startDate?: Date
    endDate?: Date
  }) {
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.method) {
      where.method = filters.method
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = endDate
      }
    }

    return prisma.payment.findMany({
      where,
      include: {
        appointment: {
          select: {
            id: true,
            patientName: true,
            patientPhone: true,
            date: true,
            appointmentType: true,
            serialNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getPaymentStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Today's payments
    const todayPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: PaymentStatus.SUCCESS,
      },
    })

    // This month's payments
    const thisMonthPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: thisMonthStart,
        },
        status: PaymentStatus.SUCCESS,
      },
    })

    // Pending payments
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.PENDING,
      },
    })

    // Success rate (last 30 days)
    const last30DaysPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    const successCount = last30DaysPayments.filter(
      (p) => p.status === PaymentStatus.SUCCESS
    ).length
    const successRate =
      last30DaysPayments.length > 0
        ? (successCount / last30DaysPayments.length) * 100
        : 0

    return {
      today: {
        amount: todayPayments.reduce((sum, p) => sum + p.amount, 0),
        count: todayPayments.length,
      },
      thisMonth: {
        amount: thisMonthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: thisMonthPayments.length,
      },
      pending: {
        amount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
        count: pendingPayments.length,
      },
      successRate: Math.round(successRate * 10) / 10,
    }
  }
}
