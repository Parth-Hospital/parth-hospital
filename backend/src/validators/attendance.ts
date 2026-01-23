import { z } from "zod"

// Schema for a single daily attendance record
export const createDailyAttendanceSchema = z.object({
  userId: z.string(),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  status: z.enum(["PRESENT", "ABSENT", "ON_LEAVE", "OFF"]),
})

// Schema for bulk upload (array of daily records)
export const bulkCreateAttendanceSchema = z.object({
  records: z.array(createDailyAttendanceSchema).min(1).max(1000), // Max 1000 records per upload
})

// Schema for querying attendance by date range
export const getAttendanceByDateRangeSchema = z.object({
  userId: z.string().optional(),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid start date format" }
  ),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid end date format" }
  ),
}).refine(
  (data) => {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 30 // Max 31 days (0-30 inclusive)
  },
  { message: "Date range must be between 1 and 31 days" }
).refine(
  (data) => {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    return start <= end
  },
  { message: "Start date must be before or equal to end date" }
)

// Export types
export type CreateDailyAttendanceInput = z.infer<typeof createDailyAttendanceSchema>
export type BulkCreateAttendanceInput = z.infer<typeof bulkCreateAttendanceSchema>
export type GetAttendanceByDateRangeInput = z.infer<typeof getAttendanceByDateRangeSchema>
