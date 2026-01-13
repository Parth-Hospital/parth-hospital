import { FastifyInstance } from "fastify"
import { AuthController } from "@/controllers/auth.controller"
import { verifyToken } from "@/middleware/auth"

const authController = new AuthController()

export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post("/login", (request, reply) => authController.login(request, reply))
  fastify.post("/register", (request, reply) => authController.register(request, reply))

  // Protected routes
  fastify.get(
    "/me",
    { preHandler: verifyToken },
    (request, reply) => authController.getCurrentUser(request, reply)
  )
}
