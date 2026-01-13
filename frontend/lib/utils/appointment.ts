/**
 * Appointment utility functions
 * Handles time slot generation based on 30 patients per 30-minute window
 * Supports General and Priority appointment types
 */

export interface TimeSlot {
  id: string
  time: string
  date: string
  availableSlots: number
  totalSlots: number
}

export type AppointmentType = "general" | "priority"
export type PaymentMethod = "online" | "pay-at-counter"

export interface AppointmentFormData {
  appointmentType: AppointmentType
  patientName: string
  patientAge: string
  phoneNumber: string
  email?: string
  date: string // Auto-set to next available date
  preferredTime?: string // Only for priority appointments
  paymentMethod: PaymentMethod
  reason?: string
}

/**
 * Calculate serial number and arrival time based on total bookings
 * 30 patients per 30-minute slot
 * Slot 1 (1-30): 11:00 AM
 * Slot 2 (31-60): 11:30 AM
 * Slot 3 (61-90): 12:00 PM
 * And so on until 5:00 PM
 */
export function calculateSerialNumberAndTime(totalBookings: number): {
  serialNumber: number
  arrivalTime: string
  slotTime: string
} {
  const serialNumber = totalBookings + 1
  const slotIndex = Math.floor((serialNumber - 1) / 30)
  const slotHour = 11 + Math.floor(slotIndex * 0.5) // 11 AM + (slotIndex * 30 min)
  const slotMinute = (slotIndex % 2) * 30 // 0 or 30 minutes
  
  // Ensure we don't go beyond 5 PM (17:00)
  const maxHour = 17
  const finalHour = Math.min(slotHour, maxHour)
  const finalMinute = finalHour === maxHour ? 0 : slotMinute
  
  const slotTime = `${String(finalHour).padStart(2, "0")}:${String(finalMinute).padStart(2, "0")}`
  const arrivalTime = slotTime // For general appointments, arrival time = slot time

  return {
    serialNumber,
    arrivalTime: slotTime,
    slotTime,
  }
}

/**
 * Generate time slots for a given date
 * Each slot can accommodate 30 patients (30 minutes)
 */
export function generateTimeSlots(date: Date, existingBookings: number = 0): TimeSlot[] {
  const slots: TimeSlot[] = []
  const startHour = 11 // 11 AM
  const endHour = 17 // 5 PM
  const slotDuration = 30 // minutes
  const patientsPerSlot = 30

  const dateString = date.toISOString().split("T")[0]

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      const slotId = `${dateString}-${time}`
      
      // Calculate available slots based on serial numbers
      // Slot 1 (1-30): 11:00 AM, Slot 2 (31-60): 11:30 AM, etc.
      const slotIndex = ((hour - startHour) * 2) + (minute / 30)
      const slotStartNumber = slotIndex * patientsPerSlot + 1
      const slotEndNumber = (slotIndex + 1) * patientsPerSlot
      
      // Calculate booked slots in this range (mock - in real app, check database)
      const bookedInSlot = Math.max(0, Math.min(existingBookings - slotStartNumber + 1, patientsPerSlot))
      const availableSlots = Math.max(0, patientsPerSlot - bookedInSlot)

      slots.push({
        id: slotId,
        time,
        date: dateString,
        availableSlots,
        totalSlots: patientsPerSlot,
      })
    }
  }

  return slots
}

/**
 * Get arrival time for a patient
 * Patients should arrive 30 minutes before their slot time
 */
export function getArrivalTime(slotTime: string): string {
  const [hours, minutes] = slotTime.split(":").map(Number)
  const slotDate = new Date()
  slotDate.setHours(hours, minutes, 0, 0)
  
  // Subtract 30 minutes
  slotDate.setMinutes(slotDate.getMinutes() - 30)
  
  return `${String(slotDate.getHours()).padStart(2, "0")}:${String(slotDate.getMinutes()).padStart(2, "0")}`
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Get next available appointment date (tomorrow)
 * Booking window: 5 PM previous day to 8:15 AM same day
 * Example: To book for 11th Jan, window opens at 5 PM on 10th Jan and closes at 8:15 AM on 11th Jan
 */
export function getNextAppointmentDate(): Date | null {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Check if booking window is open
  // Window opens at 5 PM previous day (17:00)
  // Window closes at 8:15 AM same day (08:15)
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute // minutes since midnight
  
  const windowOpenTime = 17 * 60 // 5 PM = 1020 minutes
  const windowCloseTime = 8 * 60 + 15 // 8:15 AM = 495 minutes
  
  // If current time is after 5 PM today, booking window is open for tomorrow
  // If current time is before 8:15 AM today, booking window is open for today
  const isWindowOpen = currentTime >= windowOpenTime || currentTime < windowCloseTime
  
  if (!isWindowOpen) {
    return null // Booking window is closed (between 8:15 AM and 5 PM)
  }
  
  // If it's after 5 PM, book for tomorrow
  // If it's before 8:15 AM, book for today
  const appointmentDate = currentTime >= windowOpenTime ? tomorrow : today
  
  // Skip Sundays
  if (appointmentDate.getDay() === 0) {
    appointmentDate.setDate(appointmentDate.getDate() + 1)
  }
  
  return appointmentDate
}

/**
 * Check doctor availability for tomorrow
 * Fetches from the backend API
 */
export async function checkDoctorAvailability(date: Date): Promise<boolean> {
  try {
    const { doctorAvailabilityApi } = await import("@/lib/api/doctorAvailability")
    const availability = await doctorAvailabilityApi.getAvailability(date.toISOString())
    return availability?.available || false
  } catch (error) {
    console.error("Error checking doctor availability:", error)
    // Return false if API call fails
    return false
  }
}

/**
 * Check if booking window is currently open and doctor is available
 * Logic:
 * - Before 5 PM: Booking window not opened yet (doctor updates availability before 5 PM)
 * - After 5 PM: Check doctor availability - only open if doctor is attending tomorrow
 */
export async function isBookingWindowOpen(): Promise<{
  isOpen: boolean
  message: string
  nextDate: Date | null
  doctorAvailable: boolean
  doctorAvailabilityMessage: string
  isBefore5PM: boolean
}> {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute // minutes since midnight
  
  const windowOpenTime = 17 * 60 // 5 PM = 1020 minutes
  const windowCloseTime = 8 * 60 + 15 // 8:15 AM = 495 minutes
  
  const isBefore5PM = currentTime < windowOpenTime
  const isAfter8_15AM = currentTime >= windowCloseTime
  
  // Before 5 PM: Booking window not opened yet
  if (isBefore5PM && isAfter8_15AM) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    // Skip Sundays
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1)
    }
    
    return {
      isOpen: false,
      message: "Booking window will open at 5 PM today. Doctor availability will be updated before then.",
      nextDate: tomorrow,
      doctorAvailable: false,
      doctorAvailabilityMessage: "",
      isBefore5PM: true,
    }
  }
  
  // After 5 PM or before 8:15 AM: Check if booking window should be open
  const nextDate = getNextAppointmentDate()
  
  if (!nextDate) {
    return {
      isOpen: false,
      message: "Booking window is closed. It opens at 5 PM the day before your appointment.",
      nextDate: null,
      doctorAvailable: false,
      doctorAvailabilityMessage: "",
      isBefore5PM: false,
    }
  }
  
  // After 5 PM: Check doctor availability
  let doctorAvailable = false
  try {
    doctorAvailable = await checkDoctorAvailability(nextDate)
  } catch (error) {
    console.error("Error checking doctor availability:", error)
    doctorAvailable = false
  }
  
  if (!doctorAvailable) {
    return {
      isOpen: false,
      message: "Doctor is not attending tomorrow. Booking window is closed.",
      nextDate: null,
      doctorAvailable: false,
      doctorAvailabilityMessage: "Dr. Subash Singh is not attending tomorrow. Please check back later for future appointments.",
      isBefore5PM: false,
    }
  }
  
  return {
    isOpen: true,
    message: `Booking window is open for ${formatDate(nextDate)}`,
    nextDate,
    doctorAvailable: true,
    doctorAvailabilityMessage: `Dr. Subash Singh is available for consultations tomorrow (${formatDate(nextDate)}).`,
    isBefore5PM: false,
  }
}

/**
 * Get next available dates (excluding past dates and Sundays)
 * @deprecated Use getNextAppointmentDate() instead
 */
export function getAvailableDates(count: number = 7): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentDate = new Date(today)
  let added = 0

  while (added < count) {
    // Skip Sundays (0) and past dates
    if (currentDate.getDay() !== 0 && currentDate >= today) {
      dates.push(new Date(currentDate))
      added++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

/**
 * Validate appointment form
 */
export function validateAppointmentForm(data: Partial<AppointmentFormData>): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!data.appointmentType) {
    errors.appointmentType = "Please select appointment type"
  }

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = "Please enter a valid name (at least 2 characters)"
  }

  if (!data.patientAge || isNaN(Number(data.patientAge)) || Number(data.patientAge) < 1 || Number(data.patientAge) > 120) {
    errors.patientAge = "Please enter a valid age"
  }

  if (!data.phoneNumber || !/^[6-9]\d{9}$/.test(data.phoneNumber.replace(/\D/g, ""))) {
    errors.phoneNumber = "Please enter a valid 10-digit mobile number"
  }

  if (!data.date) {
    errors.date = "Please select a date"
  }

  // Validation based on appointment type
  if (data.appointmentType === "general") {
    if (!data.paymentMethod) {
      errors.paymentMethod = "Please select a payment method"
    }
  } else if (data.appointmentType === "priority") {
    // Priority appointments must pay online
    if (data.paymentMethod !== "online") {
      errors.paymentMethod = "Priority appointments require online payment"
    }
    // Preferred time is optional for priority
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

