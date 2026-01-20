import { z } from "zod"

export const createAppointmentSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters").max(100),
  patientAge: z.number().int().min(1).max(120),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  patientCity: z.string().min(2, "City must be at least 2 characters").max(100),
  date: z.string().refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: "Invalid date format" }
  ),
  appointmentType: z.enum(["GENERAL", "PRIORITY"]),
  preferredTime: z.string().max(10).optional(),
  paymentMethod: z.enum(["ONLINE", "PAY_AT_COUNTER"]),
  reason: z.string().max(1000).optional(),
})

export const createOfflineAppointmentSchema = z.object({
  date: z.string().datetime(),
})

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "ARRIVED", "CONSULTING", "COMPLETED", "CANCELLED"]),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type CreateOfflineAppointmentInput = z.infer<typeof createOfflineAppointmentSchema>
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>
