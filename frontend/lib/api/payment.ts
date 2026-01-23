import { apiClient } from "./client"

export interface Payment {
  id: string
  appointmentId: string
  amount: number
  method: "ONLINE" | "PAY_AT_COUNTER"
  status: "PENDING" | "SUCCESS" | "FAILED"
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  createdAt: string
  updatedAt: string
  appointment: {
    id: string
    patientName: string
    patientPhone: string
    date: string
    appointmentType: "GENERAL" | "PRIORITY"
    serialNumber?: number | null
  }
}

export interface PaymentStats {
  today: {
    amount: number
    count: number
  }
  thisMonth: {
    amount: number
    count: number
  }
  pending: {
    amount: number
    count: number
  }
  successRate: number
}

export interface GetPaymentsParams {
  status?: "PENDING" | "SUCCESS" | "FAILED"
  method?: "ONLINE" | "PAY_AT_COUNTER"
  startDate?: string
  endDate?: string
}

export const paymentApi = {
  async getPayments(params?: GetPaymentsParams): Promise<Payment[]> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.method) queryParams.append("method", params.method)
    if (params?.startDate) queryParams.append("startDate", params.startDate)
    if (params?.endDate) queryParams.append("endDate", params.endDate)

    const queryString = queryParams.toString()
    const url = `/payments${queryString ? `?${queryString}` : ""}`

    const response = await apiClient.get<Payment[]>(url)
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch payments")
    }
    return response.data
  },

  async getPaymentStats(): Promise<PaymentStats> {
    const response = await apiClient.get<PaymentStats>("/payments/stats")
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch payment stats")
    }
    return response.data
  },
}
