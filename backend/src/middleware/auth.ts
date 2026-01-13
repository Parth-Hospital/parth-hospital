import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken"
import { env } from "@/config/env"
import prisma from "@/config/database"

export interface AuthUser {
  id: string
  email: string
  role: string
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

export const verifyToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: "Authentication token required",
      })
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    })

    if (!user || user.status !== "ACTIVE") {
      return reply.status(401).send({
        success: false,
        message: "Invalid or inactive user",
      })
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        success: false,
        message: "Invalid authentication token",
      })
    }
    throw error
  }
}

export const requireRole = (...roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        message: "Authentication required",
      })
    }

    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        message: "Insufficient permissions",
      })
    }
  }
}
