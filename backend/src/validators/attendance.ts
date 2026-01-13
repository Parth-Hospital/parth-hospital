import { z } from "zod"

export const createAttendanceSchema = z.object({
  userId: z.string(),
  weekStartDate: z.string().datetime(),
  monday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  tuesday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  wednesday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  thursday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  friday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  saturday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
  sunday: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
})

export const getAttendanceSchema = z.object({
  userId: z.string().optional(),
  weekStartDate: z.string().datetime().optional(),
})

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>
export type GetAttendanceInput = z.infer<typeof getAttendanceSchema>
