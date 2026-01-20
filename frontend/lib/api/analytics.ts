import { apiClient } from "./client"

export interface DoctorDashboardStats {
  today: {
    generalAppointments: number
    priorityAppointments: number
    staffPresent: number
    revenue: number
  }
  monthlyTrends: Array<{
    appointmentType: string
    _count: number
  }>
}

export interface ManagerDashboardStats {
  totalEmployees: number
  presentToday: number
  pendingApprovals: number
  onLeaveToday: number
  weeklyTrends: Array<{
    day: string
    present: number
    absent: number
    onLeave: number
  }>
  departmentDistribution: Array<{
    department: string
    count: number
  }>
}

export interface ReceptionistDashboardStats {
  patientFlow: Array<{
    hour: string
    patients: number
    completed: number
  }>
  collectionData: Array<{
    date: string
    collections: number
  }>
  paymentMethods: Array<{
    method: string
    count: number
  }>
}

export interface EmployeeDashboardStats {
  employee: any
  attendanceSummary: {
    presentDays: number
    absentDays: number
    attendanceRate: number
  }
  leaveSummary: {
    pending: number
    approved: number
    rejected: number
  }
  weeklyAttendance: Array<{
    week: string
    present: number
    absent: number
  }>
}

export const analyticsApi = {
  getDoctorDashboardStats: async (): Promise<DoctorDashboardStats> => {
    const response = await apiClient.get<DoctorDashboardStats>("/analytics/doctor")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch doctor dashboard stats")
  },

  getManagerDashboardStats: async (): Promise<ManagerDashboardStats> => {
    const response = await apiClient.get<ManagerDashboardStats>("/analytics/manager")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch manager dashboard stats")
  },

  getReceptionistDashboardStats: async (
    date?: string
  ): Promise<ReceptionistDashboardStats> => {
    const response = await apiClient.get<ReceptionistDashboardStats>(
      "/analytics/receptionist",
      date ? { date } : undefined
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch receptionist dashboard stats")
  },

  getEmployeeDashboardStats: async (): Promise<EmployeeDashboardStats> => {
    const response = await apiClient.get<EmployeeDashboardStats>("/analytics/employee")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch employee dashboard stats")
  },
}
