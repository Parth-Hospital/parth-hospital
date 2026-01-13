import app from "./app"
import { env } from "./config/env"
import prisma from "./config/database"

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connected")

    // Start server
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    })

    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
    console.log(`📝 Environment: ${env.NODE_ENV}`)
  } catch (error) {
    app.log.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  await app.close()
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGINT", async () => {
  await app.close()
  await prisma.$disconnect()
  process.exit(0)
})

start()
