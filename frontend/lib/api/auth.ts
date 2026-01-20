import { apiClient } from "./client"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  role: "DOCTOR" | "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST" | "EMPLOYEE"
  department?: string
  position?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  department?: string
  position?: string
  status: string
  adminEmail?: string
  hasAdminCreds: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }
    throw new Error(response.message || "Login failed")
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }
    throw new Error(response.message || "Registration failed")
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to get user")
  },

  logout: (): void => {
    apiClient.clearToken()
  },
}
