import { PrismaClient } from "@prisma/client"
import { env } from "./env"

const prisma = new PrismaClient({
  adapter: {
    url: env.DATABASE_URL,
  },
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
})

// Handle graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect()
})

export default prisma
