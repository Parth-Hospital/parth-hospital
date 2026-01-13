import { FastifyInstance } from "fastify"
import { NoteController } from "@/controllers/note.controller"
import { verifyToken } from "@/middleware/auth"

const noteController = new NoteController()

export default async function noteRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  fastify.post("/", (request, reply) => noteController.createNote(request, reply))
  fastify.get("/", (request, reply) => noteController.getNotes(request, reply))
  fastify.patch("/:id", (request, reply) => noteController.updateNote(request, reply))
  fastify.delete("/:id", (request, reply) => noteController.deleteNote(request, reply))
}
