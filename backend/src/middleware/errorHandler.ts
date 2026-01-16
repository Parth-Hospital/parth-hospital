import { FastifyRequest, FastifyReply, FastifyError } from "fastify"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: "Validation error",
      errors: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return reply.status(409).send({
        success: false,
        message: "Duplicate entry. This record already exists.",
      })
    }

    if (error.code === "P2025") {
      return reply.status(404).send({
        success: false,
        message: "Record not found",
      })
    }

    return reply.status(500).send({
      success: false,
      message: "Database error",
    })
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return reply.status(401).send({
      success: false,
      message: "Invalid authentication token",
    })
  }

  if (error.name === "TokenExpiredError") {
    return reply.status(401).send({
      success: false,
      message: "Authentication token expired",
    })
  }

  // Default error
  const statusCode = error.statusCode || 500
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message

  return reply.status(statusCode).send({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
