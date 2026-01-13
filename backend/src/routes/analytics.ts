import { FastifyInstance } from "fastify"
import { AnalyticsController } from "@/controllers/analytics.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const analyticsController = new AnalyticsController()

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Owner dashboard stats
  fastify.get(
    "/owner",
    { preHandler: requireRole("OWNER") },
    (request, reply) => analyticsController.getOwnerDashboardStats(request, reply)
  )

  // Manager dashboard stats
  fastify.get(
    "/manager",
    { preHandler: requireRole("MANAGER", "OWNER") },
    (request, reply) => analyticsController.getManagerDashboardStats(request, reply)
  )

  // Receptionist dashboard stats
  fastify.get(
    "/receptionist",
    { preHandler: requireRole("RECEPTIONIST", "MANAGER", "OWNER") },
    (request, reply) => analyticsController.getReceptionistDashboardStats(request, reply)
  )

  // Employee dashboard stats (accessible to all roles when using employee credentials)
  fastify.get(
    "/employee",
    { preHandler: requireRole("EMPLOYEE", "OWNER", "MANAGER", "ACCOUNTANT", "RECEPTIONIST") },
    (request, reply) => analyticsController.getEmployeeDashboardStats(request, reply)
  )
}
