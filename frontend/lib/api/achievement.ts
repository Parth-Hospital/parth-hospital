import { apiClient } from "./client"

export interface Achievement {
  id: string
  title: string
  description?: string
  date: string
  type: "DOCTOR" | "HOSPITAL"
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAchievementData {
  title: string
  description?: string
  date: string
  type: "DOCTOR" | "HOSPITAL"
}

export interface UpdateAchievementData {
  title?: string
  description?: string
  date?: string
}

export const achievementApi = {
  getAchievements: async (type?: "DOCTOR" | "HOSPITAL"): Promise<Achievement[]> => {
    const params = type ? { type } : {}
    const response = await apiClient.get<Achievement[]>("/achievements", params)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch achievements")
  },

  getAchievementById: async (id: string): Promise<Achievement> => {
    const response = await apiClient.get<Achievement>(`/achievements/${id}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch achievement")
  },

  createAchievement: async (data: CreateAchievementData): Promise<Achievement> => {
    const response = await apiClient.post<Achievement>("/achievements", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create achievement")
  },

  updateAchievement: async (
    id: string,
    data: UpdateAchievementData
  ): Promise<Achievement> => {
    const response = await apiClient.patch<Achievement>(`/achievements/${id}`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update achievement")
  },

  deleteAchievement: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/achievements/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete achievement")
    }
  },
}
