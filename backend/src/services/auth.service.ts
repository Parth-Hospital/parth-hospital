import prisma from "@/config/database"
import { hashPassword, comparePassword } from "@/utils/bcrypt"
import { generateToken } from "@/utils/jwt"
import { LoginInput, RegisterInput } from "@/validators/auth"

export class AuthService {
  async login(data: LoginInput) {
    const { email, password } = data

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase()

    // Find user by email (check both email and adminEmail fields)
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    let isAdminEmailLogin = false

    // If not found by email, try adminEmail
    if (!user) {
      user = await prisma.user.findUnique({
        where: { adminEmail: normalizedEmail },
      })
      if (user) {
        isAdminEmailLogin = true
      }
    }

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      throw new Error("Account is inactive")
    }

    // Determine which password to check based on login type
    let passwordToCheck: string | null = null

    // If logging in with adminEmail (employee dashboard login)
    if (isAdminEmailLogin) {
      // For employee dashboard login, use employeePasswordHash
      if (!user.employeePasswordHash) {
        throw new Error("Employee credentials not generated. Please contact your manager.")
      }
      passwordToCheck = user.employeePasswordHash
    } else {
      // If logging in with regular email (admin dashboard login)
      // For MANAGER/ACCOUNTANT/RECEPTIONIST/OWNER: use regular passwordHash (admin credentials)
      // For EMPLOYEE: reject (they must use adminEmail)
      if (user.role === "EMPLOYEE") {
        throw new Error("Employees must use employee credentials to login. Please use your employee email.")
      }
      passwordToCheck = user.passwordHash
    }

    // Verify password
    if (!passwordToCheck) {
      throw new Error("Invalid email or password")
    }

    const isPasswordValid = await comparePassword(password, passwordToCheck)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Return user data (without passwords)
    const { passwordHash, employeePasswordHash, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    }
  }

  async register(data: RegisterInput) {
    const { email, password, ...userData } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        ...userData,
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

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user,
      token,
    }
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }
}
