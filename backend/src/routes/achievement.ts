import { FastifyInstance } from "fastify"
import { AchievementController } from "@/controllers/achievement.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const achievementController = new AchievementController()

export default async function achievementRoutes(fastify: FastifyInstance) {
  // Public routes - Get achievements
  fastify.get("/", (request, reply) => achievementController.getAchievements(request, reply))
  fastify.get("/:id", (request, reply) => achievementController.getAchievementById(request, reply))

  // Protected routes - Manage achievements
  fastify.post(
    "/",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER")] },
    (request, reply) => achievementController.createAchievement(request, reply)
  )

  fastify.patch(
    "/:id",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER")] },
    (request, reply) => achievementController.updateAchievement(request, reply)
  )

  fastify.delete(
    "/:id",
    { preHandler: [verifyToken, requireRole("DOCTOR", "MANAGER")] },
    (request, reply) => achievementController.deleteAchievement(request, reply)
  )
}
