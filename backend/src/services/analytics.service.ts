import prisma from "@/config/database"
import { PaymentStatus } from "@prisma/client"

export class AnalyticsService {
  // Doctor Dashboard Analytics
  async getDoctorDashboardStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // General and Priority appointments today
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    const generalAppointments = todayAppointments.filter(
      (a) => a.appointmentType === "GENERAL"
    ).length
    const priorityAppointments = todayAppointments.filter(
      (a) => a.appointmentType === "PRIORITY"
    ).length

    // Staff present today
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: today,
      },
    })

    const staffPresent = todayAttendance.filter(
      (a) => a.status === "PRESENT"
    ).length

    // Revenue (from payments - will be 0 until payments are integrated)
    const revenue = 0

    // Monthly appointment trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyAppointments = await prisma.appointment.groupBy({
      by: ["appointmentType"],
      where: {
        date: {
          gte: sixMonthsAgo,
        },
      },
      _count: true,
    })

    return {
      today: {
        generalAppointments,
        priorityAppointments,
        staffPresent,
        revenue,
      },
      monthlyTrends: monthlyAppointments,
    }
  }

  // Manager Dashboard Analytics
  async getManagerDashboardStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Total employees
    const totalEmployees = await prisma.user.count({
      where: {
        role: {
          not: "DOCTOR",
        },
        status: "ACTIVE",
      },
    })

    // Present today
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: today,
        user: {
          role: {
            not: "DOCTOR",
          },
        },
      },
    })

    const presentToday = todayAttendance.filter(
      (a) => a.status === "PRESENT"
    ).length

    // Pending approvals (leave requests)
    const pendingApprovals = await prisma.leaveRequest.count({
      where: {
        status: "PENDING",
      },
    })

    // On leave today
    const onLeaveToday = todayAttendance.filter(
      (a) => a.status === "ON_LEAVE"
    ).length

    // Weekly attendance trends
    const weeklyTrends = await this.getWeeklyAttendanceTrends()

    // Department distribution
    const departmentDistribution = await prisma.user.groupBy({
      by: ["department"],
      where: {
        role: {
          not: "DOCTOR",
        },
        status: "ACTIVE",
      },
      _count: true,
    })

    return {
      totalEmployees,
      presentToday,
      pendingApprovals,
      onLeaveToday,
      weeklyTrends,
      departmentDistribution: departmentDistribution.map((d) => ({
        department: d.department || "Unknown",
        count: d._count,
      })),
    }
  }

  // Receptionist Dashboard Analytics
  async getReceptionistDashboardStats(date?: Date) {
    const targetDate = date || new Date()
    targetDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        payment: true,
      },
    })

    // Patient flow by hour
    const patientFlow = this.calculatePatientFlow(appointments)

    // Collection data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: PaymentStatus.SUCCESS,
      },
      include: {
        appointment: {
          select: {
            date: true,
          },
        },
      },
    })

    const collectionData = this.calculateCollectionData(recentPayments)

    // Payment method distribution
    const paymentMethods = await prisma.payment.groupBy({
      by: ["method"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: PaymentStatus.SUCCESS,
      },
      _count: true,
    })

    return {
      patientFlow,
      collectionData,
      paymentMethods: paymentMethods.map((pm) => ({
        method: pm.method,
        count: pm._count,
      })),
    }
  }

  // Employee Dashboard Analytics
  async getEmployeeDashboardStats(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Employee details
    const employee = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
      },
    })

    // Attendance summary (current month)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
        },
      },
    })

    const attendanceSummary = this.calculateAttendanceSummary(attendanceRecords)

    // Leave summary
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        userId: userId,
      },
    })

    const leaveSummary = {
      pending: leaveRequests.filter((l) => l.status === "PENDING").length,
      approved: leaveRequests.filter((l) => l.status === "APPROVED").length,
      rejected: leaveRequests.filter((l) => l.status === "REJECTED").length,
    }

    // Weekly attendance data
    const weeklyAttendance = this.calculateWeeklyAttendance(attendanceRecords)

    return {
      employee,
      attendanceSummary,
      leaveSummary,
      weeklyAttendance,
    }
  }

  // Helper methods
  private calculatePatientFlow(appointments: any[]) {
    const flow: Record<string, { patients: number; completed: number }> = {}

    appointments.forEach((apt) => {
      const hour = apt.arrivalTime ? apt.arrivalTime.split(":")[0] : "11"
      const hourKey = `${hour} AM`
      if (!flow[hourKey]) {
        flow[hourKey] = { patients: 0, completed: 0 }
      }
      flow[hourKey].patients++
      if (apt.status === "COMPLETED") {
        flow[hourKey].completed++
      }
    })

    return Object.entries(flow).map(([hour, data]) => ({
      hour,
      ...data,
    }))
  }

  private calculateCollectionData(payments: any[]) {
    const collections: Record<string, number> = {}

    payments.forEach((payment) => {
      const date = new Date(payment.appointment.date)
      const dayKey = date.toLocaleDateString("en-US", { weekday: "short" })
      if (!collections[dayKey]) {
        collections[dayKey] = 0
      }
      collections[dayKey] += Number(payment.amount) || 0
    })

    return Object.entries(collections).map(([date, collections]) => ({
      date,
      collections,
    }))
  }

  private calculateAttendanceSummary(records: any[]) {
    let presentDays = 0
    let absentDays = 0

    records.forEach((record) => {
      if (record.status === "PRESENT") presentDays++
      if (record.status === "ABSENT") absentDays++
    })

    const totalDays = presentDays + absentDays
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    return {
      presentDays,
      absentDays,
      attendanceRate: Math.round(attendanceRate),
    }
  }

  private calculateWeeklyAttendance(records: any[]) {
    const weeks: Record<string, { present: number; absent: number }> = {}

    records.forEach((record) => {
      // Group by week (Monday of the week)
      const recordDate = new Date(record.date)
      const weekStart = new Date(recordDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1))
      const weekKey = weekStart.toLocaleDateString()

      if (!weeks[weekKey]) {
        weeks[weekKey] = { present: 0, absent: 0 }
      }

      if (record.status === "PRESENT") weeks[weekKey].present++
      if (record.status === "ABSENT") weeks[weekKey].absent++
    })

    return Object.entries(weeks).map(([week, data]) => ({
      week,
      ...data,
    }))
  }

  private async getWeeklyAttendanceTrends() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
        user: {
          role: {
            not: "DOCTOR",
          },
        },
      },
    })

    const trends = {
      monday: { present: 0, absent: 0, onLeave: 0 },
      tuesday: { present: 0, absent: 0, onLeave: 0 },
      wednesday: { present: 0, absent: 0, onLeave: 0 },
      thursday: { present: 0, absent: 0, onLeave: 0 },
      friday: { present: 0, absent: 0, onLeave: 0 },
      saturday: { present: 0, absent: 0, onLeave: 0 },
    }

    attendance.forEach((record) => {
      const recordDate = new Date(record.date)
      const dayOfWeek = recordDate.getDay()
      const dayMap: Record<number, keyof typeof trends> = {
        0: "monday", // Sunday maps to Monday for display (adjust if needed)
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      }
      const dayKey = dayMap[dayOfWeek] || "monday"
      const data = trends[dayKey]

      if (record.status === "PRESENT") data.present++
      if (record.status === "ABSENT") data.absent++
      if (record.status === "ON_LEAVE") data.onLeave++
    })

    return Object.entries(trends).map(([day, data]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      ...data,
    }))
  }
}
