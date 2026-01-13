import prisma from "@/config/database"
import { CreateNoteInput, UpdateNoteInput } from "@/validators/note"

export class NoteService {
  async createNote(data: CreateNoteInput, userId: string) {
    return prisma.note.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        color: data.color || "#fff9c4",
      },
    })
  }

  async getNotes(userId: string) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })
  }

  async getNoteById(id: string, userId: string) {
    return prisma.note.findFirst({
      where: { id, userId },
    })
  }

  async updateNote(id: string, data: UpdateNoteInput, userId: string) {
    const note = await this.getNoteById(id, userId)
    if (!note) {
      throw new Error("Note not found")
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.color !== undefined) updateData.color = data.color

    return prisma.note.update({
      where: { id },
      data: updateData,
    })
  }

  async deleteNote(id: string, userId: string) {
    const note = await this.getNoteById(id, userId)
    if (!note) {
      throw new Error("Note not found")
    }

    return prisma.note.delete({
      where: { id },
    })
  }
}
