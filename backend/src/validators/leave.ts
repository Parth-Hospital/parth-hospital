import { z } from "zod"

export const createLeaveRequestSchema = z.object({
  startDate: z.string().refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: "Invalid date format" }
  ),
  endDate: z.string().refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: "Invalid date format" }
  ),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
})

export const updateLeaveStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
})

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>
