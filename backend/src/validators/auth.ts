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

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  role: z.enum(["DOCTOR", "MANAGER", "ACCOUNTANT", "RECEPTIONIST", "EMPLOYEE"]),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
