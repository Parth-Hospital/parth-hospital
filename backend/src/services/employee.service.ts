import prisma from "@/config/database"
import { hashPassword } from "@/utils/bcrypt"
import { CreateEmployeeInput, UpdateEmployeeInput, GenerateAdminCredsInput, UpdateAdminPasswordInput } from "@/validators/employee"

// Generate admin email from name
function generateAdminEmail(name: string): string {
  const emailName = name
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "")
  return `${emailName}@parthhospital.co.in`
}

export class EmployeeService {
  async createEmployee(data: CreateEmployeeInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password if provided
    const passwordHash = data.password ? await hashPassword(data.password) : await hashPassword("temp123")

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
        role: data.role,
        department: data.department,
        position: data.position,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        department: true,
        position: true,
        status: true,
        adminEmail: true,
        hasAdminCreds: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Generate employee ID
    const employeeId = `EMP${String(user.id).slice(-6).toUpperCase()}`

    // Create employee record
    await prisma.employee.create({
      data: {
        userId: user.id,
        employeeId,
      },
    })

    return {
      ...user,
      employeeId,
    }
  }

  async getEmployees(filters?: {
    department?: string
    role?: string
    status?: string
  }) {
    const where: any = {}

    if (filters?.department) {
      where.department = filters.department
    }

    if (filters?.role) {
      where.role = filters.role
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      department: user.department,
      position: user.position,
      status: user.status,
      adminEmail: user.adminEmail,
      hasAdminCreds: user.hasAdminCreds || !!user.employeePasswordHash,
      employeeId: user.employee?.employeeId || `EMP${String(user.id).slice(-6).toUpperCase()}`,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }

  async getEmployeeById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    })

    if (!user) {
      throw new Error("Employee not found")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      department: user.department,
      position: user.position,
      status: user.status,
      adminEmail: user.adminEmail,
      hasAdminCreds: user.hasAdminCreds || !!user.employeePasswordHash,
      employeeId: user.employee?.employeeId || `EMP${String(user.id).slice(-6).toUpperCase()}`,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async updateEmployee(id: string, data: UpdateEmployeeInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        department: true,
        position: true,
        status: true,
        adminEmail: true,
        hasAdminCreds: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async generateAdminCredentials(id: string, data: GenerateAdminCredsInput) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Cannot generate employee credentials for Owner
    if (user.role === "OWNER") {
      throw new Error("Cannot generate employee credentials for Owner")
    }

    // Check if employee credentials already exist
    if (user.employeePasswordHash) {
      throw new Error("Employee credentials already generated for this user")
    }

    const employeePasswordHash = await hashPassword(data.password)
    const adminEmail = generateAdminEmail(user.name)
    
    // Check if admin email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { adminEmail },
    })

    if (existingAdmin && existingAdmin.id !== id) {
      throw new Error("Admin email already exists for another user")
    }

    // For all users (EMPLOYEE, MANAGER, ACCOUNTANT, RECEPTIONIST):
    // Set employeePasswordHash and adminEmail for employee dashboard login
    // Do NOT update passwordHash (keeps admin credentials separate)
    return prisma.user.update({
      where: { id },
      data: {
        employeePasswordHash,
        adminEmail: adminEmail, // Set adminEmail for employee dashboard login
        hasAdminCreds: true, // Mark that employee credentials exist
      },
      select: {
        id: true,
        email: true,
        name: true,
        adminEmail: true,
        hasAdminCreds: true,
      },
    })
  }

  async updateAdminPassword(id: string, data: UpdateAdminPasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.hasAdminCreds) {
      throw new Error("Admin credentials not generated for this employee")
    }

    const passwordHash = await hashPassword(data.password)

    return prisma.user.update({
      where: { id },
      data: {
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        adminEmail: true,
        hasAdminCreds: true,
      },
    })
  }

  async deleteEmployee(id: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error("Employee not found")
    }

    // Delete user (cascade will delete employee record)
    await prisma.user.delete({
      where: { id },
    })

    return { message: "Employee deleted successfully" }
  }
}
