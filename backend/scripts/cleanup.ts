import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Cleaning up database...")

  // Delete all records in order (respecting foreign key constraints)
  console.log("Deleting all attendance records...")
  await prisma.attendance.deleteMany()

  console.log("Deleting all leave requests...")
  await prisma.leaveRequest.deleteMany()

  console.log("Deleting all appointments...")
  await prisma.appointment.deleteMany()

  console.log("Deleting all inquiries...")
  await prisma.inquiry.deleteMany()

  console.log("Deleting all gallery items...")
  await prisma.gallery.deleteMany()

  console.log("Deleting all gallery albums...")
  await prisma.galleryAlbum.deleteMany()

  console.log("Deleting all achievements...")
  await prisma.achievement.deleteMany()

  console.log("Deleting all notifications...")
  await prisma.notification.deleteMany()

  console.log("Deleting all employees...")
  await prisma.employee.deleteMany()

  console.log("Deleting all users...")
  await prisma.user.deleteMany()

  console.log("✅ Database cleanup completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error cleaning up database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
