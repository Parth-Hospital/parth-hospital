import { apiClient } from "./client"

export interface Note {
  id: string
  userId: string
  title?: string | null
  content: string
  color?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNoteData {
  title?: string
  content: string
  color?: string
}

export interface UpdateNoteData {
  title?: string
  content?: string
  color?: string
}

export const noteApi = {
  getNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>("/notes")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch notes")
  },

  createNote: async (data: CreateNoteData): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create note")
  },

  updateNote: async (id: string, data: UpdateNoteData): Promise<Note> => {
    const response = await apiClient.patch<Note>(`/notes/${id}`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update note")
  },

  deleteNote: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/notes/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete note")
    }
  },
}
