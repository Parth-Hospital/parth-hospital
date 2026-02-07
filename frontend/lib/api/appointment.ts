import { apiClient } from "./client"

export interface CreateAppointmentData {
  patientName: string
  patientAge: number
  patientPhone: string
  patientCity: string
  date: string
  appointmentType: "GENERAL" | "PRIORITY"
  preferredTime?: string
  paymentMethod: "ONLINE" | "PAY_AT_COUNTER"
  reason?: string
}

export interface Appointment {
  id: string
  serialNumber?: number
  patientName: string
  patientAge: number
  patientEmail?: string
  patientPhone: string
  patientCity: string
  date: string
  appointmentType: "GENERAL" | "PRIORITY"
  timeSlot?: string
  preferredTime?: string
  arrivalTime?: string
  slotTime?: string
  paymentMethod: "ONLINE" | "PAY_AT_COUNTER"
  bookingType: "ONLINE" | "OFFLINE"
  status: "PENDING" | "ARRIVED" | "CONSULTING" | "COMPLETED" | "CANCELLED"
  reason?: string
  createdAt: string
  updatedAt: string
}

export interface CurrentBookingsResponse {
  appointments: Appointment[]
  summary: {
    total: number
    online: number
    offline: number
    priority: number
    general: number
  }
}

export const appointmentApi = {
  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    // Check if QA mode is enabled
    const isQAMode =
      (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("qa") === "true") ||
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_QA_MODE === "true")

    // Pass QA mode as query parameter
    const endpoint = isQAMode ? "/appointments?qa=true" : "/appointments"
    const response = await apiClient.post<Appointment>(endpoint, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create appointment")
  },

  getAppointments: async (filters?: {
    date?: string
    status?: string
    appointmentType?: string
  }): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>("/appointments", filters)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch appointments")
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch appointment")
  },

  getCurrentBookings: async (date?: string): Promise<CurrentBookingsResponse> => {
    const response = await apiClient.get<CurrentBookingsResponse>(
      "/appointments/current/bookings",
      date ? { date } : undefined
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch current bookings")
  },

  createOfflineAppointment: async (date: string): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>("/appointments/offline", { date })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create offline appointment")
  },

  updateAppointmentStatus: async (
    id: string,
    status: Appointment["status"]
  ): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update appointment status")
  },

  markDailyAppointmentsAsCompleted: async (date: string): Promise<{ count: number }> => {
    const response = await apiClient.patch<{ count: number }>("/appointments/current/bookings/complete", { date })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to complete appointments")
  },
}
