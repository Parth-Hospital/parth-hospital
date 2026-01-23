import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔄 Updating employee IDs to sequential format (EMP01, EMP02, etc.)...")

  // Get all employees with their users
  const employees = await prisma.employee.findMany({
    include: {
      user: {
        select: {
          role: true,
          name: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      user: {
        createdAt: "asc", // Order by creation date to maintain consistency
      },
    },
  })

  if (employees.length === 0) {
    console.log("✅ No employees found. Nothing to update.")
    return
  }

  console.log(`\n📋 Found ${employees.length} employees to update\n`)

  // Separate doctor from other employees
  const doctor = employees.find((emp) => emp.user.role === "DOCTOR")
  const otherEmployees = employees.filter((emp) => emp.user.role !== "DOCTOR")

  // Track assigned IDs
  const assignedIds = new Set<string>()
  const updates: Array<{ id: string; oldId: string; newId: string; name: string }> = []

  // Assign EMP01 to doctor first
  if (doctor) {
    const newId = "EMP01"
    if (doctor.employeeId !== newId) {
      updates.push({
        id: doctor.id,
        oldId: doctor.employeeId,
        newId,
        name: doctor.user.name,
      })
      assignedIds.add(newId)
      console.log(`👨‍⚕️  Doctor: ${doctor.user.name}`)
      console.log(`   ${doctor.employeeId} → ${newId}`)
    } else {
      assignedIds.add(newId)
      console.log(`👨‍⚕️  Doctor: ${doctor.user.name} (already has ${newId})`)
    }
  }

  // Assign sequential IDs to other employees
  let nextNumber = 2
  for (const emp of otherEmployees) {
    // Find next available number
    while (assignedIds.has(`EMP${String(nextNumber).padStart(2, "0")}`)) {
      nextNumber++
    }

    const newId = `EMP${String(nextNumber).padStart(2, "0")}`
    
    if (emp.employeeId !== newId) {
      updates.push({
        id: emp.id,
        oldId: emp.employeeId,
        newId,
        name: emp.user.name,
      })
    }
    
    assignedIds.add(newId)
    console.log(`👤 ${emp.user.role}: ${emp.user.name}`)
    console.log(`   ${emp.employeeId} → ${newId}`)
    nextNumber++
  }

  // Perform updates in transaction
  if (updates.length > 0) {
    console.log(`\n💾 Updating ${updates.length} employee IDs...`)

    for (const update of updates) {
      // Check if new ID already exists (to avoid conflicts)
      const existing = await prisma.employee.findUnique({
        where: { employeeId: update.newId },
      })

      if (existing && existing.id !== update.id) {
        console.log(`⚠️  Warning: ${update.newId} already exists. Skipping ${update.name}`)
        continue
      }

      await prisma.employee.update({
        where: { id: update.id },
        data: { employeeId: update.newId },
      })
    }

    console.log(`\n✅ Successfully updated ${updates.length} employee IDs!`)
  } else {
    console.log(`\n✅ All employee IDs are already in the correct format!`)
  }

  console.log("\n📊 Final Employee ID Summary:")
  const finalEmployees = await prisma.employee.findMany({
    include: {
      user: {
        select: {
          role: true,
          name: true,
        },
      },
    },
    orderBy: {
      employeeId: "asc",
    },
  })

  for (const emp of finalEmployees) {
    console.log(`   ${emp.employeeId} - ${emp.user.name} (${emp.user.role})`)
  }
}

main()
  .catch((e) => {
    console.error("❌ Error updating employee IDs:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
