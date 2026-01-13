import { apiClient } from "./client"

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  type: "GENERAL" | "APPOINTMENT" | "EMERGENCY"
  status: "PENDING" | "RESPONDED"
  response?: string
  createdAt: string
  updatedAt: string
}

export interface CreateInquiryData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  type?: "GENERAL" | "APPOINTMENT" | "EMERGENCY"
}

export interface UpdateInquiryStatusData {
  status: "PENDING" | "RESPONDED"
  response?: string
}

export const inquiryApi = {
  createInquiry: async (data: CreateInquiryData): Promise<Inquiry> => {
    const response = await apiClient.post<Inquiry>("/inquiries", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create inquiry")
  },

  getInquiries: async (filters?: {
    status?: string
    type?: string
  }): Promise<Inquiry[]> => {
    const response = await apiClient.get<Inquiry[]>("/inquiries", filters)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch inquiries")
  },

  getInquiryById: async (id: string): Promise<Inquiry> => {
    const response = await apiClient.get<Inquiry>(`/inquiries/${id}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch inquiry")
  },

  updateInquiryStatus: async (
    id: string,
    data: UpdateInquiryStatusData
  ): Promise<Inquiry> => {
    const response = await apiClient.patch<Inquiry>(`/inquiries/${id}/status`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update inquiry status")
  },

  deleteInquiry: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/inquiries/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete inquiry")
    }
  },
}
