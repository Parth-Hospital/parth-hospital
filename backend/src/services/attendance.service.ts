import prisma from "@/config/database"
import { CreateAttendanceInput } from "@/validators/attendance"

export class AttendanceService {
  async createOrUpdateAttendance(data: CreateAttendanceInput) {
    const weekStartDate = new Date(data.weekStartDate)

    return prisma.attendance.upsert({
      where: {
        userId_weekStartDate: {
          userId: data.userId,
          weekStartDate,
        },
      },
      update: {
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      },
      create: {
        userId: data.userId,
        weekStartDate,
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    })
  }

  async getAttendance(filters?: {
    userId?: string
    weekStartDate?: Date
  }) {
    const where: any = {}

    if (filters?.userId) {
      where.userId = filters.userId
    }

    if (filters?.weekStartDate) {
      where.weekStartDate = filters.weekStartDate
    }

    return prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        weekStartDate: "desc",
      },
    })
  }

  async getEmployeeAttendance(userId: string, weekStartDate?: Date) {
    const where: any = { userId }

    if (weekStartDate) {
      where.weekStartDate = weekStartDate
    }

    return prisma.attendance.findMany({
      where,
      orderBy: {
        weekStartDate: "desc",
      },
    })
  }

  async getWeeklyAttendance(weekStartDate: Date) {
    return prisma.attendance.findMany({
      where: {
        weekStartDate,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    })
  }

  async bulkCreateOrUpdateAttendance(records: CreateAttendanceInput[]) {
    const results = await Promise.all(
      records.map((data) => this.createOrUpdateAttendance(data))
    )
    return results
  }
}
