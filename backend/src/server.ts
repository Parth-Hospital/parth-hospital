import app from "./app"
import { env } from "./config/env"
import prisma from "./config/database"

const start = async () => {
  try {
    console.log("🚀 Starting server initialization...")
    console.log(`📝 Environment: ${env.NODE_ENV}`)
    console.log(`🔌 Port: ${env.PORT}`)
    
    // Test database connection
    console.log("🔌 Connecting to database...")
    await prisma.$connect()
    console.log("✅ Database connected")

    // Start server
    console.log("🎧 Starting Fastify server...")
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    })

    console.log(`✅ Server running on http://localhost:${env.PORT}`)
    console.log(`📡 API available at: http://localhost:${env.PORT}${env.API_PREFIX}`)
  } catch (error) {
    console.error("❌ Server startup failed:")
    console.error(error)
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error("Failed to disconnect from database:", disconnectError)
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
