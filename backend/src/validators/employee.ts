import { z } from "zod"

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  role: z.enum(["OWNER", "MANAGER", "ACCOUNTANT", "RECEPTIONIST", "EMPLOYEE"]),
  department: z.string().optional(),
  position: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export const generateAdminCredsSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const updateAdminPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type GenerateAdminCredsInput = z.infer<typeof generateAdminCredsSchema>
export type UpdateAdminPasswordInput = z.infer<typeof updateAdminPasswordSchema>