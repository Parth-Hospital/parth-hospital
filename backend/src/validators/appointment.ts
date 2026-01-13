import { z } from "zod"

export const createAppointmentSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientAge: z.number().int().min(1).max(120),
  patientEmail: z.string().email("Invalid email address").optional(),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  date: z.string().datetime(),
  appointmentType: z.enum(["GENERAL", "PRIORITY"]),
  preferredTime: z.string().optional(),
  paymentMethod: z.enum(["ONLINE", "PAY_AT_COUNTER"]),
  reason: z.string().optional(),
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
