import { FastifyRequest, FastifyReply } from "fastify"
import { EmployeeService } from "@/services/employee.service"
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  generateAdminCredsSchema,
  updateAdminPasswordSchema,
} from "@/validators/employee"

const employeeService = new EmployeeService()

export class EmployeeController {
  async createEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createEmployeeSchema.parse(request.body)

      const employee = await employeeService.createEmployee(body)

      return reply.status(201).send({
        success: true,
        data: employee,
        message: "Employee created successfully",
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
        message: error.message || "Failed to create employee",
      })
    }
  }

  async getEmployees(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { department, role, status } = request.query as any

      const filters: any = {}
      if (department) filters.department = department
      if (role) filters.role = role
      if (status) filters.status = status

      const employees = await employeeService.getEmployees(filters)

      return reply.send({
        success: true,
        data: employees,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch employees",
      })
    }
  }

  async getEmployeeById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const employee = await employeeService.getEmployeeById(id)

      return reply.send({
        success: true,
        data: employee,
      })
    } catch (error: any) {
      return reply.status(404).send({
        success: false,
        message: error.message || "Employee not found",
      })
    }
  }

  async updateEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateEmployeeSchema.parse(request.body)

      const employee = await employeeService.updateEmployee(id, body)

      return reply.send({
        success: true,
        data: employee,
        message: "Employee updated successfully",
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
        message: error.message || "Failed to update employee",
      })
    }
  }

  async generateAdminCredentials(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = generateAdminCredsSchema.parse(request.body)

      const result = await employeeService.generateAdminCredentials(id, body)

      return reply.send({
        success: true,
        data: result,
        message: "Admin credentials generated successfully",
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
        message: error.message || "Failed to generate admin credentials",
      })
    }
  }

  async updateAdminPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateAdminPasswordSchema.parse(request.body)

      const result = await employeeService.updateAdminPassword(id, body)

      return reply.send({
        success: true,
        data: result,
        message: "Admin password updated successfully",
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
        message: error.message || "Failed to update admin password",
      })
    }
  }

  async deleteEmployee(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      await employeeService.deleteEmployee(id)

      return reply.send({
        success: true,
        message: "Employee deleted successfully",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to delete employee",
      })
    }
  }
}
