import { z } from "zod"

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
