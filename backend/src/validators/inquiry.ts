import { z } from "zod"

export const createInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["GENERAL", "APPOINTMENT", "EMERGENCY"]).optional(),
})

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["PENDING", "RESPONDED"]),
  response: z.string().optional(),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>
