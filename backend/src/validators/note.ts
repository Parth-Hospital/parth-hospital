import { z } from "zod"

export const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  color: z.string().optional(),
})

export const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  color: z.string().optional(),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
