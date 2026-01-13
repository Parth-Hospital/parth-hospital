import { apiClient } from "./client"

export interface WeeklyAttendance {
  id: string
  userId: string
  weekStartDate: string
  monday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  tuesday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  wednesday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  thursday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  friday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  saturday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  sunday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" | null
  user?: {
    id: string
    name: string
    email: string
    department: string
    position: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateWeeklyAttendanceData {
  userId: string
  weekStartDate: string
  monday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  tuesday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  wednesday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  thursday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  friday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  saturday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  sunday: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
}

export const attendanceApi = {
  getWeeklyAttendance: async (weekStartDate: string): Promise<WeeklyAttendance[]> => {
    const response = await apiClient.get<WeeklyAttendance[]>("/attendance/weekly", {
      weekStartDate,
    })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch weekly attendance")
  },

  getAttendance: async (filters?: {
    userId?: string
    weekStartDate?: string
  }): Promise<WeeklyAttendance[]> => {
    const response = await apiClient.get<WeeklyAttendance[]>("/attendance", filters)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch attendance")
  },

  getEmployeeAttendance: async (
    userId: string,
    weekStartDate?: string
  ): Promise<WeeklyAttendance[]> => {
    const response = await apiClient.get<WeeklyAttendance[]>(
      `/attendance/employee/${userId}`,
      weekStartDate ? { weekStartDate } : undefined
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch employee attendance")
  },

  createOrUpdateAttendance: async (
    data: CreateWeeklyAttendanceData
  ): Promise<WeeklyAttendance> => {
    const response = await apiClient.post<WeeklyAttendance>("/attendance", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create/update attendance")
  },

  bulkCreateOrUpdateAttendance: async (
    records: CreateWeeklyAttendanceData[]
  ): Promise<{ success: number; failed: number }> => {
    const response = await apiClient.post<AttendanceRecord[]>(
      "/attendance/bulk",
      { records }
    )
    if (response.success && response.data) {
      // Backend returns array of created/updated records
      return {
        success: response.data.length,
        failed: records.length - response.data.length,
      }
    }
    throw new Error(response.message || "Failed to bulk upload attendance")
  },
}
