import { FastifyRequest, FastifyReply } from "fastify"
import { TodoService } from "@/services/todo.service"
import { createTodoSchema, updateTodoSchema } from "@/validators/todo"

const todoService = new TodoService()

export class TodoController {
  async createTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const body = createTodoSchema.parse(request.body)
      const todo = await todoService.createTodo(body, request.user.id)

      return reply.status(201).send({
        success: true,
        data: todo,
        message: "Todo created successfully",
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
        message: error.message || "Failed to create todo",
      })
    }
  }

  async getTodos(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      // Ensure we're using the correct user ID from the authenticated user
      const userId = request.user.id
      const todos = await todoService.getTodos(userId)

      return reply.send({
        success: true,
        data: todos,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch todos",
      })
    }
  }

  async updateTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }
      const body = updateTodoSchema.parse(request.body)

      const todo = await todoService.updateTodo(id, body, request.user.id)

      return reply.send({
        success: true,
        data: todo,
        message: "Todo updated successfully",
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
        message: error.message || "Failed to update todo",
      })
    }
  }

  async deleteTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        })
      }

      const { id } = request.params as { id: string }

      await todoService.deleteTodo(id, request.user.id)

      return reply.send({
        success: true,
        message: "Todo deleted successfully",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to delete todo",
      })
    }
  }
}
