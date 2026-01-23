import { apiClient } from "./client"

// Daily attendance record
export interface DailyAttendance {
  id: string
  userId: string
  date: string
  status: "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF"
  user?: {
    id: string
    name: string
    email: string
    department: string
    position: string
    employee?: {
      employeeId: string
    }
  }
  createdAt: string
  updatedAt: string
}

// Create daily attendance data
export interface CreateDailyAttendanceData {
  userId: string
  date: string
  status: "PRESENT" | "ABSENT"
}

// For backward compatibility
export interface WeeklyAttendance extends DailyAttendance {}
export interface CreateWeeklyAttendanceData extends CreateDailyAttendanceData {}

export const attendanceApi = {
  // Get attendance by date range
  getAttendanceByDateRange: async (params: {
    startDate: string
    endDate: string
    userId?: string
  }): Promise<DailyAttendance[]> => {
    const response = await apiClient.get<DailyAttendance[]>("/attendance", params)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch attendance")
  },

  // For backward compatibility - converts weekStartDate to date range
  getWeeklyAttendance: async (weekStartDate: string): Promise<DailyAttendance[]> => {
    const startDate = new Date(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6) // 7 days total

    return attendanceApi.getAttendanceByDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    })
  },

  // For backward compatibility
  getAttendance: async (filters?: {
    userId?: string
    startDate?: string
    endDate?: string
  }): Promise<DailyAttendance[]> => {
    if (!filters?.startDate || !filters?.endDate) {
      throw new Error("startDate and endDate are required")
    }
    return attendanceApi.getAttendanceByDateRange(filters as any)
  },

  // Get employee's own attendance by date range
  getEmployeeAttendance: async (
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<DailyAttendance[]> => {
    const response = await apiClient.get<DailyAttendance[]>(
      `/attendance/employee/${userId}`,
      { startDate, endDate }
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch employee attendance")
  },

  // Create or update a single daily attendance record
  createOrUpdateAttendance: async (
    data: CreateDailyAttendanceData
  ): Promise<DailyAttendance> => {
    const response = await apiClient.post<DailyAttendance>("/attendance", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create/update attendance")
  },

  // Bulk create or update daily attendance records
  bulkCreateOrUpdateAttendance: async (
    records: CreateDailyAttendanceData[]
  ): Promise<{ success: number; failed: number; total: number }> => {
    const response = await apiClient.post<{ success: number; failed: number; total: number }>(
      "/attendance/bulk",
      { records }
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to bulk upload attendance")
  },
}
