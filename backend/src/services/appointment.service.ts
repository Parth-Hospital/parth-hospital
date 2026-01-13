import prisma from "@/config/database"
import { CreateAppointmentInput, CreateOfflineAppointmentInput } from "@/validators/appointment"
import { AppointmentType, BookingType } from "@prisma/client"

// Calculate serial number and time based on total bookings
function calculateSerialNumberAndTime(totalBookings: number): {
  serialNumber: number
  arrivalTime: string
  slotTime: string
} {
  const serialNumber = totalBookings + 1
  const slotIndex = Math.floor((serialNumber - 1) / 30)
  const slotHour = 11 + Math.floor(slotIndex * 0.5)
  const slotMinute = (slotIndex % 2) * 30

  const maxHour = 17
  const finalHour = Math.min(slotHour, maxHour)
  const finalMinute = finalHour === maxHour ? 0 : slotMinute

  const slotTime = `${String(finalHour).padStart(2, "0")}:${String(finalMinute).padStart(2, "0")}`
  const arrivalTime = slotTime

  return {
    serialNumber,
    arrivalTime,
    slotTime,
  }
}

export class AppointmentService {
  async createAppointment(data: CreateAppointmentInput, userId?: string) {
    // Normalize appointment date to start of day (midnight) to match how availability is stored
    const appointmentDate = new Date(data.date)
    appointmentDate.setHours(0, 0, 0, 0)

    // Check if booking window is open
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const windowOpenTime = 17 * 60 // 5 PM
    const windowCloseTime = 8 * 60 + 15 // 8:15 AM

    const isBefore5PM = currentTime < windowOpenTime && currentTime >= windowCloseTime

    if (isBefore5PM) {
      throw new Error("Booking window is not open yet. It opens at 5 PM.")
    }

    // Check doctor availability for the date (normalized to start of day)
    const availability = await prisma.doctorAvailability.findUnique({
      where: {
        date: appointmentDate,
      },
    })

    // Default to available if no record exists (doctor is available by default)
    const isAvailable = !availability || availability.available

    if (!isAvailable) {
      throw new Error("Doctor is not available on this date")
    }

    // For general appointments, calculate serial number
    let serialNumber: number | null = null
    let arrivalTime: string | null = null
    let slotTime: string | null = null

    if (data.appointmentType === "GENERAL") {
      // Get total bookings for the date (online + offline)
      const totalBookings = await prisma.appointment.count({
        where: {
          date: appointmentDate,
          appointmentType: "GENERAL",
        },
      })

      const calculated = calculateSerialNumberAndTime(totalBookings)
      serialNumber = calculated.serialNumber
      arrivalTime = calculated.arrivalTime
      slotTime = calculated.slotTime
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientPhone: data.patientPhone,
        patientCity: data.patientCity,
        date: appointmentDate,
        appointmentType: data.appointmentType,
        preferredTime: data.preferredTime,
        paymentMethod: data.paymentMethod,
        bookingType: "ONLINE",
        reason: data.reason,
        serialNumber,
        arrivalTime,
        slotTime,
        createdBy: userId,
      },
      include: {
        payment: true,
      },
    })

    return appointment
  }

  async createOfflineAppointment(data: CreateOfflineAppointmentInput) {
    const appointmentDate = new Date(data.date)

    // For offline appointments, always calculate serial number
    const totalBookings = await prisma.appointment.count({
      where: {
        date: appointmentDate,
        appointmentType: "GENERAL",
      },
    })

    const calculated = calculateSerialNumberAndTime(totalBookings)

    // Create offline appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientName: "Offline Booking",
        patientAge: 0,
        patientPhone: "0000000000",
        date: appointmentDate,
        appointmentType: "GENERAL",
        paymentMethod: "PAY_AT_COUNTER",
        bookingType: "OFFLINE",
        serialNumber: calculated.serialNumber,
        arrivalTime: calculated.arrivalTime,
        slotTime: calculated.slotTime,
      },
    })

    return appointment
  }

  async getAppointments(filters?: {
    date?: Date
    status?: string
    appointmentType?: string
  }) {
    const where: any = {}

    if (filters?.date) {
      where.date = filters.date
    }

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.appointmentType) {
      where.appointmentType = filters.appointmentType
    }

    return prisma.appointment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        payment: true,
      },
    })
  }

  async getAppointmentById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        payment: true,
      },
    })
  }

  async getCurrentBookings(date?: Date) {
    const targetDate = date || new Date()
    targetDate.setHours(0, 0, 0, 0)

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: [
        { appointmentType: "asc" },
        { serialNumber: "asc" },
      ],
      include: {
        payment: true,
      },
    })

    // Calculate summary
    const total = appointments.length
    const online = appointments.filter((a) => a.bookingType === "ONLINE").length
    const offline = appointments.filter((a) => a.bookingType === "OFFLINE").length
    const priority = appointments.filter((a) => a.appointmentType === "PRIORITY").length

    return {
      appointments,
      summary: {
        total,
        online,
        offline,
        priority,
        general: total - priority,
      },
    }
  }

  async updateAppointmentStatus(id: string, status: string) {
    return prisma.appointment.update({
      where: { id },
      data: { status },
    })
  }
}
