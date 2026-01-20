import prisma from "@/config/database"
import { CreateLeaveRequestInput, UpdateLeaveStatusInput } from "@/validators/leave"

function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Include both start and end dates
}

export class LeaveService {
  async createLeaveRequest(data: CreateLeaveRequestInput, userId: string) {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (endDate < startDate) {
      throw new Error("End date must be after start date")
    }

    const days = calculateDays(startDate, endDate)

    return prisma.leaveRequest.create({
      data: {
        userId,
        startDate,
        endDate,
        days,
        reason: data.reason,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    })
  }

  async getLeaveRequests(filters?: {
    userId?: string
    status?: string
    requesterRole?: string
    requesterId?: string
  }) {
    const where: any = {}

    // If requesterRole is MANAGER, only show non-Manager leaves
    // Also exclude the Manager's own leaves explicitly (unless querying for specific userId)
    // If requesterRole is DOCTOR, only show Manager leaves
    if (filters?.requesterRole === "MANAGER") {
      // Exclude Manager role - this should already exclude Manager's own leaves
      // But we also explicitly exclude by userId as a safety measure
      where.user = {
        role: {
          not: "MANAGER",
        },
      }
      
      // Also explicitly exclude Manager's own userId if provided and not querying for specific user
      // This is a double-check to ensure Manager's own leaves never show up
      if (filters?.requesterId && !filters?.userId) {
        // Use AND to combine user role filter with userId exclusion
        where.AND = [
          {
            user: {
              role: {
                not: "MANAGER",
              },
            },
          },
          {
            userId: {
              not: filters.requesterId,
            },
          },
        ]
        // Remove the top-level user filter since it's now in AND
        delete where.user
      }
      
      // Add status filter if provided
      if (filters?.status) {
        if (where.AND) {
          where.AND.push({ status: filters.status })
        } else {
          where.status = filters.status
        }
      }
      
      // Add userId filter if provided (for specific user queries)
      if (filters?.userId) {
        if (where.AND) {
          where.AND.push({ userId: filters.userId })
        } else {
          where.userId = filters.userId
        }
      }
    } else if (filters?.requesterRole === "DOCTOR") {
      where.user = {
        role: "MANAGER",
      }
      if (filters?.status) {
        where.status = filters.status
      }
      if (filters?.userId) {
        where.userId = filters.userId
      }
    } else {
      // For other roles or no role filter
      if (filters?.userId) {
        where.userId = filters.userId
      }
      if (filters?.status) {
        where.status = filters.status
      }
    }

    return prisma.leaveRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
            role: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getLeaveRequestById(id: string) {
    return prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async updateLeaveStatus(id: string, data: UpdateLeaveStatusInput, approverId: string, approverRole: string) {
    // Get the leave request with user info
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!leaveRequest) {
      throw new Error("Leave request not found")
    }

    // If the leave request is from a Manager, only Doctor can approve
    if (leaveRequest.user.role === "MANAGER" && approverRole !== "DOCTOR") {
      throw new Error("Only Doctor can approve Manager leave requests")
    }

    // If the leave request is from a non-Manager, only Manager can approve
    if (leaveRequest.user.role !== "MANAGER" && approverRole !== "MANAGER") {
      throw new Error("Only Manager can approve this leave request")
    }

    return prisma.leaveRequest.update({
      where: { id },
      data: {
        status: data.status,
        approvedBy: approverId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async getEmployeeLeaveRequests(userId: string) {
    return prisma.leaveRequest.findMany({
      where: { userId },
      include: {
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
