import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Helper function to generate sequential employee ID
  async function generateEmployeeId(role: string, assignedIds: Set<string>): Promise<string> {
    // Doctor always gets EMP01
    if (role === "DOCTOR") {
      if (assignedIds.has("EMP01")) {
        throw new Error("EMP01 is already assigned. Only one doctor can have EMP01.")
      }
      return "EMP01"
    }

    // For other roles, find the next available number
    let nextNumber = 2 // Start from 2 since EMP01 is for doctor
    
    // Find the first available number
    while (assignedIds.has(`EMP${String(nextNumber).padStart(2, "0")}`)) {
      nextNumber++
    }

    return `EMP${String(nextNumber).padStart(2, "0")}`
  }

  // Helper function to create user with employee record
  async function createUserWithEmployee(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: "DOCTOR" | "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST" | "EMPLOYEE",
    department: string,
    position: string,
    assignedIds: Set<string>
  ) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { employee: true },
    })

    if (existing) {
      console.log(`⚠️  User ${email} already exists, skipping...`)
      if (existing.employee) {
        assignedIds.add(existing.employee.employeeId)
      }
      return existing
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate employee ID
    const employeeId = await generateEmployeeId(role, assignedIds)
    assignedIds.add(employeeId)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role,
        department,
        position,
        status: "ACTIVE",
      },
    })

    // Create employee record
    await prisma.employee.create({
      data: {
        userId: user.id,
        employeeId,
      },
    })

    console.log(`✅ Created ${role.toLowerCase()}:`)
    console.log(`   Name: ${name}`)
    console.log(`   Email: ${email}`)
    console.log(`   Phone: ${phone}`)
    console.log(`   Department: ${department}`)
    console.log(`   Position: ${position}`)
    console.log(`   Employee ID: ${employeeId}`)
    console.log(`   Password: ${password}`)

    return user
  }

  // Track assigned employee IDs to ensure uniqueness
  const assignedIds = new Set<string>()

  // Create Doctor (always gets EMP01)
  await createUserWithEmployee(
    "Dr. Subash Singh",
    "doctor@parthhospital.co.in",
    "doctor123",
    "9876543210",
    "DOCTOR",
    "Orthopedics",
    "Doctor & Chief Surgeon",
    assignedIds
  )

  // Create Manager (gets EMP02)
  await createUserWithEmployee(
    "Rajesh Kumar",
    "manager@parthhospital.co.in",
    "manager123",
    "9876543211",
    "MANAGER",
    "Administration",
    "Hospital Manager",
    assignedIds
  )

  // Create Accountant (gets EMP03)
  await createUserWithEmployee(
    "Priya Sharma",
    "accountant@parthhospital.co.in",
    "accountant123",
    "9876543212",
    "ACCOUNTANT",
    "Finance",
    "Senior Accountant",
    assignedIds
  )

  // Create Receptionist (gets EMP04)
  await createUserWithEmployee(
    "Anjali Verma",
    "receptionist@parthhospital.co.in",
    "receptionist123",
    "9876543213",
    "RECEPTIONIST",
    "Reception",
    "Receptionist",
    assignedIds
  )

  console.log("\n🎉 Seeding completed!")
  console.log("\n📝 Admin Credentials (for Admin Dashboard Login):")
  console.log("   Doctor: doctor@parthhospital.co.in / doctor123")
  console.log("   Manager: manager@parthhospital.co.in / manager123")
  console.log("   Accountant: accountant@parthhospital.co.in / accountant123")
  console.log("   Receptionist: receptionist@parthhospital.co.in / receptionist123")
  console.log("\n💡 Note: Generate employee credentials from Manager/Doctor dashboard to enable Employee Dashboard login.")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
