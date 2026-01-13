import { FastifyInstance } from "fastify"
import { TodoController } from "@/controllers/todo.controller"
import { verifyToken } from "@/middleware/auth"

const todoController = new TodoController()

export default async function todoRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("onRequest", verifyToken)

  fastify.post("/", (request, reply) => todoController.createTodo(request, reply))
  fastify.get("/", (request, reply) => todoController.getTodos(request, reply))
  fastify.patch("/:id", (request, reply) => todoController.updateTodo(request, reply))
  fastify.delete("/:id", (request, reply) => todoController.deleteTodo(request, reply))
}
