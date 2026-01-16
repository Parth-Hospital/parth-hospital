const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  private removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Handle 401 - Unauthorized (token expired/invalid)
        // Only redirect if not already on login page and not a login request
        if (response.status === 401) {
          const isLoginRequest = endpoint.includes("/auth/login")
          const isOnLoginPage = typeof window !== "undefined" && window.location.pathname === "/login"
          
          this.removeAuthToken()
          
          // Only redirect if it's not a login attempt and not already on login page
          if (!isLoginRequest && !isOnLoginPage && typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }

        // Try to parse error response, but handle if it fails
        let errorMessage = "Request failed"
        let errorDetails: any = null
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          errorDetails = errorData.errors || errorData.error || null
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage
        }

        // Create error with details
        const error = new Error(errorMessage) as any
        if (errorDetails) {
          error.details = errorDetails
        }
        throw error
      }

      // Parse JSON only if response is ok
      const data = await response.json()
      return data
    } catch (error: any) {
      // Handle network errors (fetch failed completely)
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("API Error: Backend server is not reachable. Is it running?", {
          baseURL: this.baseURL,
          endpoint,
        })
        throw new Error(
          "Unable to connect to the server. Please check if the backend is running."
        )
      }

      // Re-throw other errors (including our custom Error from above)
      console.error("API Error:", error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : ""
    return this.request<T>(`${endpoint}${queryString}`, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Auth helpers
  setToken(token: string): void {
    this.setAuthToken(token)
  }

  clearToken(): void {
    this.removeAuthToken()
  }

  getToken(): string | null {
    return this.getAuthToken()
  }

  // File upload helper
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const headers: Record<string, string> = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          const isOnLoginPage = typeof window !== "undefined" && window.location.pathname === "/login"
          
          this.removeAuthToken()
          
          // Only redirect if not already on login page
          if (!isOnLoginPage && typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }

        let errorMessage = "Request failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("API Error: Backend server is not reachable. Is it running?", {
          baseURL: this.baseURL,
          endpoint,
        })
        throw new Error(
          "Unable to connect to the server. Please check if the backend is running."
        )
      }

      console.error("API Error:", error)
      throw error
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
