import { FastifyRequest, FastifyReply } from "fastify"
import { NoteService } from "@/services/note.service"
import { createNoteSchema, updateNoteSchema } from "@/validators/note"

const noteService = new NoteService()

export class NoteController {
  async createNote(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const body = createNoteSchema.parse(request.body)
      const note = await noteService.createNote(body, request.user.id)

      return reply.status(201).send({
        success: true,
        data: note,
        message: "Note created successfully",
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
        message: error.message || "Failed to create note",
      })
    }
  }

  async getNotes(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      // Ensure we're using the correct user ID from the authenticated user
      const userId = request.user.id
      const notes = await noteService.getNotes(userId)

      return reply.send({
        success: true,
        data: notes,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch notes",
      })
    }
  }

  async updateNote(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }
      const body = updateNoteSchema.parse(request.body)

      const note = await noteService.updateNote(id, body, request.user.id)

      return reply.send({
        success: true,
        data: note,
        message: "Note updated successfully",
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
        message: error.message || "Failed to update note",
      })
    }
  }

  async deleteNote(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }

      await noteService.deleteNote(id, request.user.id)

      return reply.send({
        success: true,
        message: "Note deleted successfully",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to delete note",
      })
    }
  }
}
