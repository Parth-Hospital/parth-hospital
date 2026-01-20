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
        weekStartDate: {
          lte: today,
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    const dayOfWeek = today.getDay()
    const dayMap: Record<number, keyof typeof todayAttendance[0]> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }
    const todayField = dayMap[dayOfWeek]

    const staffPresent = todayAttendance.filter(
      (a) => a[todayField] === "PRESENT"
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
        role: "EMPLOYEE",
        status: "ACTIVE",
      },
    })

    // Present today
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        weekStartDate: weekStart,
      },
    })

    const dayOfWeek = today.getDay()
    const dayMap: Record<number, keyof typeof todayAttendance[0]> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }
    const todayField = dayMap[dayOfWeek]

    const presentToday = todayAttendance.filter(
      (a) => a[todayField] === "PRESENT"
    ).length

    // Pending approvals (leave requests)
    const pendingApprovals = await prisma.leaveRequest.count({
      where: {
        status: "PENDING",
      },
    })

    // On leave today
    const onLeaveToday = todayAttendance.filter(
      (a) => a[todayField] === "ON_LEAVE"
    ).length

    // Weekly attendance trends
    const weeklyTrends = await this.getWeeklyAttendanceTrends()

    // Department distribution
    const departmentDistribution = await prisma.user.groupBy({
      by: ["department"],
      where: {
        role: "EMPLOYEE",
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
        weekStartDate: {
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
    const dayMap: Record<number, keyof typeof records[0]> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }

    records.forEach((record) => {
      Object.values(dayMap).forEach((day) => {
        if (record[day] === "PRESENT") presentDays++
        if (record[day] === "ABSENT") absentDays++
      })
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
      const weekKey = new Date(record.weekStartDate).toLocaleDateString()
      if (!weeks[weekKey]) {
        weeks[weekKey] = { present: 0, absent: 0 }
      }

      Object.values(record).forEach((day) => {
        if (day === "PRESENT") weeks[weekKey].present++
        if (day === "ABSENT") weeks[weekKey].absent++
      })
    })

    return Object.entries(weeks).map(([week, data]) => ({
      week,
      ...data,
    }))
  }

  private async getWeeklyAttendanceTrends() {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const attendance = await prisma.attendance.findMany({
      where: {
        weekStartDate: weekStart,
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
      Object.entries(trends).forEach(([day, data]) => {
        const status = record[day as keyof typeof record]
        if (status === "PRESENT") data.present++
        if (status === "ABSENT") data.absent++
        if (status === "ON_LEAVE") data.onLeave++
      })
    })

    return Object.entries(trends).map(([day, data]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      ...data,
    }))
  }
}
