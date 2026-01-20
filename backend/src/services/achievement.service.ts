import prisma from "@/config/database"
import { CreateAchievementInput, UpdateAchievementInput } from "@/validators/achievement"

export class AchievementService {
  async createAchievement(data: CreateAchievementInput, createdBy?: string) {
    return prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        type: data.type,
        createdBy,
      },
    })
  }

  async getAchievements(type?: "DOCTOR" | "HOSPITAL") {
    const where = type ? { type } : {}
    return prisma.achievement.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    })
  }

  async getAchievementById(id: string) {
    return prisma.achievement.findUnique({
      where: { id },
    })
  }

  async updateAchievement(id: string, data: UpdateAchievementInput) {
    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.date) updateData.date = new Date(data.date)
    if (data.type) updateData.type = data.type

    return prisma.achievement.update({
      where: { id },
      data: updateData,
    })
  }

  async deleteAchievement(id: string) {
    return prisma.achievement.delete({
      where: { id },
    })
  }
}
