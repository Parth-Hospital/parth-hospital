import prisma from "@/config/database"
import { CreateDailyAttendanceInput } from "@/validators/attendance"

export class AttendanceService {
  // Create or update a single daily attendance record
  async createOrUpdateDailyAttendance(data: CreateDailyAttendanceInput) {
    // Parse date string (YYYY-MM-DD) and create date in local timezone
    // This avoids timezone conversion issues
    const [year, month, day] = data.date.split("-").map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    date.setHours(0, 0, 0, 0)

    if (process.env.NODE_ENV === "development") {
      console.log("Creating/updating attendance:", {
        userId: data.userId,
        dateInput: data.date,
        dateObject: date.toISOString(),
        status: data.status,
      })
    }

    return prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date,
        },
      },
      update: {
        status: data.status,
      },
      create: {
        userId: data.userId,
        date,
        status: data.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
            employee: {
              select: {
                employeeId: true,
              },
            },
          },
        },
      },
    })
  }

  // Get attendance records by date range
  async getAttendanceByDateRange(params: {
    userId?: string
    startDate: Date
    endDate: Date
  }) {
    // Normalize dates to start/end of day
    const startDate = new Date(params.startDate)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(params.endDate)
    endDate.setHours(23, 59, 59, 999)

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (params.userId) {
      where.userId = params.userId
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
            employee: {
              select: {
                employeeId: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { user: { name: "asc" } },
      ],
    })

    // Normalize dates to YYYY-MM-DD format for consistent frontend handling
    return records.map((record) => ({
      ...record,
      date: record.date.toISOString().split("T")[0], // Convert Date to YYYY-MM-DD string
    }))
  }

  // Get employee's own attendance by date range
  async getEmployeeAttendance(userId: string, startDate: Date, endDate: Date) {
    // Normalize dates to start/end of day
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Normalize dates to YYYY-MM-DD format for consistent frontend handling
    return records.map((record) => ({
      ...record,
      date: record.date.toISOString().split("T")[0], // Convert Date to YYYY-MM-DD string
    }))
  }

  // Bulk create or update daily attendance records
  async bulkCreateOrUpdateAttendance(records: CreateDailyAttendanceInput[]) {
    const results = await Promise.allSettled(
      records.map((data) => this.createOrUpdateDailyAttendance(data))
    )

    const success = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length

    // Log failed records for debugging
    if (failed > 0 && process.env.NODE_ENV === "development") {
      const failedRecords = results
        .map((result, index) => {
          if (result.status === "rejected") {
            return { index, record: records[index], error: result.reason }
          }
          return null
        })
        .filter(Boolean)
      console.error("Failed attendance records:", failedRecords)
    }

    return {
      success,
      failed,
      total: records.length,
    }
  }

  // Get attendance summary for a date range (for analytics)
  async getAttendanceSummary(startDate: Date, endDate: Date) {
    const records = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const summary = {
      total: records.length,
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      onLeave: records.filter((r) => r.status === "ON_LEAVE").length,
      off: records.filter((r) => r.status === "OFF").length,
    }

    return summary
  }
}
