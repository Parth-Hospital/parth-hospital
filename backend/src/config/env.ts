import { z } from "zod"
import dotenv from "dotenv"
import { logger } from "@/utils/logger"

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("5000"),
  API_PREFIX: z.string().default("/api"),
  
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  
  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  
  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  
  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default("100"),
  RATE_LIMIT_TIME_WINDOW: z.string().transform(Number).default("60000"),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  logger.log("🔍 Validating environment variables...")
  env = envSchema.parse(process.env)
  logger.log("✅ Environment variables validated successfully")
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error("❌ Invalid environment variables:")
    error.errors.forEach((err) => {
      logger.error(`  - ${err.path.join(".")}: ${err.message}`)
      logger.error(`    Current value: ${process.env[err.path[0] as string] || 'undefined'}`)
    })
    logger.error("\n📋 Available environment variables:", Object.keys(process.env).filter(k => !k.includes('PASSWORD')).sort())
    process.exit(1)
  }
  logger.error("❌ Unexpected error during env validation:", error)
  throw error
}

export { env }
