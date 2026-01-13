import prisma from "@/config/database"

export class DoctorAvailabilityService {
  async getAvailability(date: Date) {
    const availability = await prisma.doctorAvailability.findUnique({
      where: {
        date,
      },
    })

    // Default to available (true) if no record exists
    if (!availability) {
      return {
        date,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return availability
  }

  async setAvailability(date: Date, available: boolean) {
    // Check if current time is before 5 PM
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    const windowOpenTime = 17 * 60 // 5 PM

    if (currentTime >= windowOpenTime) {
      throw new Error("Cannot update availability after 5 PM. Booking window is now open.")
    }

    // Only create/update if marking as NOT available
    // If marking as available, we can delete the record to use default (available)
    if (available) {
      // If marking as available, delete the record if it exists (to use default)
      // Or update it to true
      return prisma.doctorAvailability.upsert({
        where: {
          date,
        },
        update: {
          available: true,
        },
        create: {
          date,
          available: true,
        },
      })
    } else {
      // Only mark as not available if explicitly set to false
      return prisma.doctorAvailability.upsert({
        where: {
          date,
        },
        update: {
          available: false,
        },
        create: {
          date,
          available: false,
        },
      })
    }
  }

  async getAvailabilityRange(startDate: Date, endDate: Date) {
    return prisma.doctorAvailability.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })
  }
}
