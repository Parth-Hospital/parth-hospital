import { apiClient } from "./client"

export interface DoctorAvailability {
  id: string
  date: string
  available: boolean
  createdAt: string
  updatedAt: string
}

export const doctorAvailabilityApi = {
  getAvailability: async (date: string): Promise<DoctorAvailability | null> => {
    const response = await apiClient.get<DoctorAvailability>("/doctor-availability", { date })
    if (response.success) {
      return response.data || null
    }
    throw new Error(response.message || "Failed to fetch availability")
  },

  setAvailability: async (date: string, available: boolean): Promise<DoctorAvailability> => {
    const response = await apiClient.post<DoctorAvailability>("/doctor-availability", {
      date,
      available,
    })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to set availability")
  },

  getAvailabilityRange: async (
    startDate: string,
    endDate: string
  ): Promise<DoctorAvailability[]> => {
    const response = await apiClient.get<DoctorAvailability[]>("/doctor-availability/range", {
      startDate,
      endDate,
    })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch availability range")
  },
}
