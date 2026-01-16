import { defineConfig } from "prisma"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "",
    },
  },
})
