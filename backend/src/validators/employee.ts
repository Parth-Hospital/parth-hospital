import { z } from "zod"
import { validatePassword } from "@/utils/passwordValidation"

// Enhanced password schema with complexity requirements
// Uses custom validation to provide a single, user-friendly error message
const passwordSchema = z
  .string()
  .refine(
    (password) => {
      const result = validatePassword(password)
      return result.isValid
    },
    {
      message: "Password must fulfil all the requirements",
    }
  )

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  role: z.enum(["DOCTOR", "MANAGER", "ACCOUNTANT", "RECEPTIONIST", "EMPLOYEE"]),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  password: passwordSchema.optional(),
})

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export const generateAdminCredsSchema = z.object({
  password: passwordSchema,
})

export const updateAdminPasswordSchema = z.object({
  password: passwordSchema,
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type GenerateAdminCredsInput = z.infer<typeof generateAdminCredsSchema>
export type UpdateAdminPasswordInput = z.infer<typeof updateAdminPasswordSchema>