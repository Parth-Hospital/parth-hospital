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
    const response = await apiClient.post<Appointment>("/appointments", data)
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
}
