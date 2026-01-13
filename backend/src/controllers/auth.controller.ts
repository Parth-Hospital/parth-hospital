import { FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "@/services/auth.service"
import { loginSchema, registerSchema } from "@/validators/auth"

const authService = new AuthService()

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body)

      const result = await authService.login(body)

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(401).send({
        success: false,
        message: error.message || "Login failed",
      })
    }
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerSchema.parse(request.body)

      const result = await authService.register(body)

      return reply.send({
        success: true,
        data: result,
        message: "User registered successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Registration failed",
      })
    }
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const user = await authService.getCurrentUser(request.user.id)

      return reply.send({
        success: true,
        data: user,
      })
    } catch (error: any) {
      return reply.status(404).send({
        success: false,
        message: error.message || "User not found",
      })
    }
  }
}
