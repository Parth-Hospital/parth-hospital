import prisma from "@/config/database"
import { CreateTodoInput, UpdateTodoInput } from "@/validators/todo"

export class TodoService {
  async createTodo(data: CreateTodoInput, userId: string) {
    const todoData: any = {
      userId,
      title: data.title,
      priority: data.priority || "MEDIUM",
    }

    if (data.dueDate) {
      todoData.dueDate = new Date(data.dueDate)
    }

    return prisma.todo.create({
      data: todoData,
    })
  }

  async getTodos(userId: string) {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: [
        { completed: "asc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    })
  }

  async getTodoById(id: string, userId: string) {
    return prisma.todo.findFirst({
      where: { id, userId },
    })
  }

  async updateTodo(id: string, data: UpdateTodoInput, userId: string) {
    const todo = await this.getTodoById(id, userId)
    if (!todo) {
      throw new Error("Todo not found")
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.completed !== undefined) updateData.completed = data.completed
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
    }

    return prisma.todo.update({
      where: { id },
      data: updateData,
    })
  }

  async deleteTodo(id: string, userId: string) {
    const todo = await this.getTodoById(id, userId)
    if (!todo) {
      throw new Error("Todo not found")
    }

    return prisma.todo.delete({
      where: { id },
    })
  }
}
