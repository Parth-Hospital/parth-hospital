import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Helper function to create user with employee record
  async function createUserWithEmployee(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: "OWNER" | "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST" | "EMPLOYEE",
    department: string,
    position: string
  ) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`⚠️  User ${email} already exists, skipping...`)
      return existing
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

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

    // Generate employee ID
    const employeeId = `EMP${String(user.id).slice(-6).toUpperCase()}`

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

  // Create Owner
  await createUserWithEmployee(
    "Dr. Subash Singh",
    "owner@parthhospital.co.in",
    "owner123",
    "9876543210",
    "OWNER",
    "Orthopedics",
    "Owner & Chief Surgeon"
  )

  // Create Manager
  await createUserWithEmployee(
    "Rajesh Kumar",
    "manager@parthhospital.co.in",
    "manager123",
    "9876543211",
    "MANAGER",
    "Administration",
    "Hospital Manager"
  )

  // Create Accountant
  await createUserWithEmployee(
    "Priya Sharma",
    "accountant@parthhospital.co.in",
    "accountant123",
    "9876543212",
    "ACCOUNTANT",
    "Finance",
    "Senior Accountant"
  )

  // Create Receptionist
  await createUserWithEmployee(
    "Anjali Verma",
    "receptionist@parthhospital.co.in",
    "receptionist123",
    "9876543213",
    "RECEPTIONIST",
    "Reception",
    "Receptionist"
  )

  console.log("\n🎉 Seeding completed!")
  console.log("\n📝 Admin Credentials (for Admin Dashboard Login):")
  console.log("   Owner: owner@parthhospital.co.in / owner123")
  console.log("   Manager: manager@parthhospital.co.in / manager123")
  console.log("   Accountant: accountant@parthhospital.co.in / accountant123")
  console.log("   Receptionist: receptionist@parthhospital.co.in / receptionist123")
  console.log("\n💡 Note: Generate employee credentials from Manager/Owner dashboard to enable Employee Dashboard login.")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
