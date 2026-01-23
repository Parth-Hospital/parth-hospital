import app from "./app"
import { env } from "./config/env"
import prisma from "./config/database"
import { logger } from "./utils/logger"

const start = async () => {
  try {
    logger.log("🚀 Starting server initialization...")
    logger.log(`📝 Environment: ${env.NODE_ENV}`)
    logger.log(`🔌 Port: ${env.PORT}`)
    
    // Test database connection
    logger.log("🔌 Connecting to database...")
    await prisma.$connect()
    logger.log("✅ Database connected")

    // Start server
    logger.log("🎧 Starting Fastify server...")
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    })

    logger.log(`✅ Server running on http://localhost:${env.PORT}`)
    logger.log(`📡 API available at: http://localhost:${env.PORT}${env.API_PREFIX}`)
  } catch (error) {
    logger.error("❌ Server startup failed:")
    logger.error(error)
    if (error instanceof Error) {
      logger.error("Error name:", error.name)
      logger.error("Error message:", error.message)
      logger.error("Error stack:", error.stack)
    }
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      logger.error("Failed to disconnect from database:", disconnectError)
    }
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
