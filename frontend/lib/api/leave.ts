import { apiClient } from "./client"

export interface LeaveRequest {
  id: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
    department?: string
    position?: string
  }
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  approvedBy?: string
  approver?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateLeaveRequestData {
  startDate: string
  endDate: string
  reason: string
}

export interface UpdateLeaveStatusData {
  status: "APPROVED" | "REJECTED"
  comments?: string
}

export const leaveApi = {
  getLeaveRequests: async (filters?: {
    employeeId?: string
    status?: string
  }): Promise<LeaveRequest[]> => {
    const response = await apiClient.get<LeaveRequest[]>("/leaves", filters)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch leave requests")
  },

  getMyLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await apiClient.get<LeaveRequest[]>("/leaves/employee/my")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch leave requests")
  },

  createLeaveRequest: async (data: CreateLeaveRequestData): Promise<LeaveRequest> => {
    const response = await apiClient.post<LeaveRequest>("/leaves", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create leave request")
  },

  updateLeaveStatus: async (
    id: string,
    data: UpdateLeaveStatusData
  ): Promise<LeaveRequest> => {
    const response = await apiClient.patch<LeaveRequest>(`/leaves/${id}/status`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update leave status")
  },
}
