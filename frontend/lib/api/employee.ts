import { apiClient } from "./client"

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  status: "ACTIVE" | "INACTIVE"
  role?: "OWNER" | "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST" | "EMPLOYEE"
  adminEmail?: string
  hasAdminCredentials: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeData {
  name: string
  email: string
  phone?: string
  department?: string
  position?: string
  role?: "OWNER" | "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST" | "EMPLOYEE"
  password?: string
}

export interface GenerateCredentialsResponse {
  adminEmail: string
  password: string
}

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get<any[]>("/employees")
    if (response.success && response.data) {
      // Map backend field names to frontend interface
      return response.data.map((emp: any) => ({
        ...emp,
        hasAdminCredentials: emp.hasAdminCreds || false,
        role: emp.role,
      }))
    }
    throw new Error(response.message || "Failed to fetch employees")
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<any>(`/employees/${id}`)
    if (response.success && response.data) {
      // Map backend field names to frontend interface
      return {
        ...response.data,
        hasAdminCredentials: response.data.hasAdminCreds || false,
      }
    }
    throw new Error(response.message || "Failed to fetch employee")
  },

  createEmployee: async (data: CreateEmployeeData): Promise<Employee> => {
    const response = await apiClient.post<any>("/employees", data)
    if (response.success && response.data) {
      // Map backend field names to frontend interface
      return {
        ...response.data,
        hasAdminCredentials: response.data.hasAdminCreds || false,
      }
    }
    throw new Error(response.message || "Failed to create employee")
  },

  updateEmployee: async (id: string, data: Partial<CreateEmployeeData>): Promise<Employee> => {
    const response = await apiClient.patch<any>(`/employees/${id}`, data)
    if (response.success && response.data) {
      // Map backend field names to frontend interface
      return {
        ...response.data,
        hasAdminCredentials: response.data.hasAdminCreds || false,
      }
    }
    throw new Error(response.message || "Failed to update employee")
  },

  deleteEmployee: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/employees/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete employee")
    }
  },

  generateAdminCredentials: async (id: string, password: string): Promise<GenerateCredentialsResponse> => {
    const response = await apiClient.post<GenerateCredentialsResponse>(
      `/employees/${id}/generate-creds`,
      { password }
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to generate credentials")
  },

  updateAdminPassword: async (id: string, password: string): Promise<GenerateCredentialsResponse> => {
    const response = await apiClient.patch<GenerateCredentialsResponse>(
      `/employees/${id}/update-password`,
      { password }
    )
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update password")
  },
}
