import { apiClient } from "./client"

export interface Todo {
  id: string
  userId: string
  title: string
  completed: boolean
  dueDate?: string | null
  priority: "LOW" | "MEDIUM" | "HIGH"
  createdAt: string
  updatedAt: string
}

export interface CreateTodoData {
  title: string
  dueDate?: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
}

export interface UpdateTodoData {
  title?: string
  completed?: boolean
  dueDate?: string | null
  priority?: "LOW" | "MEDIUM" | "HIGH"
}

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>("/todos")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch todos")
  },

  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    const response = await apiClient.post<Todo>("/todos", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create todo")
  },

  updateTodo: async (id: string, data: UpdateTodoData): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/todos/${id}`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update todo")
  },

  deleteTodo: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/todos/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete todo")
    }
  },
}
