import { FastifyInstance } from "fastify"
import { AnalyticsController } from "@/controllers/analytics.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const analyticsController = new AnalyticsController()

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  // Doctor dashboard stats
  fastify.get(
    "/doctor",
    { preHandler: requireRole("DOCTOR") },
    (request, reply) => analyticsController.getDoctorDashboardStats(request, reply)
  )

  // Manager dashboard stats
  fastify.get(
    "/manager",
    { preHandler: requireRole("MANAGER", "DOCTOR") },
    (request, reply) => analyticsController.getManagerDashboardStats(request, reply)
  )

  // Receptionist dashboard stats
  fastify.get(
    "/receptionist",
    { preHandler: requireRole("RECEPTIONIST", "MANAGER", "DOCTOR") },
    (request, reply) => analyticsController.getReceptionistDashboardStats(request, reply)
  )

  // Employee dashboard stats (accessible to all roles when using employee credentials)
  fastify.get(
    "/employee",
    { preHandler: requireRole("EMPLOYEE", "DOCTOR", "MANAGER", "ACCOUNTANT", "RECEPTIONIST") },
    (request, reply) => analyticsController.getEmployeeDashboardStats(request, reply)
  )
}
