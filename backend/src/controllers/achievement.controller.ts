import { FastifyRequest, FastifyReply } from "fastify"
import { AchievementService } from "@/services/achievement.service"
import { createAchievementSchema, updateAchievementSchema } from "@/validators/achievement"

const achievementService = new AchievementService()

export class AchievementController {
  async createAchievement(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createAchievementSchema.parse(request.body)
      const createdBy = request.user?.id

      const achievement = await achievementService.createAchievement(body, createdBy)

      return reply.status(201).send({
        success: true,
        data: achievement,
        message: "Achievement created successfully",
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
        message: error.message || "Failed to create achievement",
      })
    }
  }

  async getAchievements(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { type } = request.query as { type?: "OWNER" | "HOSPITAL" }
      const achievements = await achievementService.getAchievements(type)

      return reply.send({
        success: true,
        data: achievements,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch achievements",
      })
    }
  }

  async getAchievementById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const achievement = await achievementService.getAchievementById(id)

      if (!achievement) {
        return reply.status(404).send({
          success: false,
          message: "Achievement not found",
        })
      }

      return reply.send({
        success: true,
        data: achievement,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch achievement",
      })
    }
  }

  async updateAchievement(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateAchievementSchema.parse(request.body)

      const achievement = await achievementService.updateAchievement(id, body)

      return reply.send({
        success: true,
        data: achievement,
        message: "Achievement updated successfully",
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
        message: error.message || "Failed to update achievement",
      })
    }
  }

  async deleteAchievement(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      await achievementService.deleteAchievement(id)

      return reply.send({
        success: true,
        message: "Achievement deleted successfully",
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to delete achievement",
      })
    }
  }
}
