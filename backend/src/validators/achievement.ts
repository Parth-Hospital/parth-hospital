import { z } from "zod"

export const createAchievementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string(),
  type: z.enum(["OWNER", "HOSPITAL"]),
})

export const updateAchievementSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  type: z.enum(["OWNER", "HOSPITAL"]).optional(),
})

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>
