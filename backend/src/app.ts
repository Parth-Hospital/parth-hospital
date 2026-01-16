console.log("📦 Loading app modules...")

import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import multipart from "@fastify/multipart"
import { env } from "@/config/env"
import { errorHandler } from "@/middleware/errorHandler"
import healthRoutes from "@/routes/health"
import authRoutes from "@/routes/auth"
import appointmentRoutes from "@/routes/appointment"
import doctorAvailabilityRoutes from "@/routes/doctorAvailability"
import inquiryRoutes from "@/routes/inquiry"
import employeeRoutes from "@/routes/employee"
import attendanceRoutes from "@/routes/attendance"
import leaveRoutes from "@/routes/leave"
import galleryRoutes from "@/routes/gallery"
import achievementRoutes from "@/routes/achievement"
import notificationRoutes from "@/routes/notification"
import analyticsRoutes from "@/routes/analytics"
import todoRoutes from "@/routes/todo"
import noteRoutes from "@/routes/note"

console.log("✅ All modules loaded successfully")
console.log("🏗️  Creating Fastify app instance...")

const app = Fastify({
  logger: env.NODE_ENV === "development",
})

console.log("✅ Fastify app created")

// Register plugins
app.register(helmet, {
  global: true,
})

app.register(cors, {
  origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  credentials: true,
})

app.register(rateLimit, {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_TIME_WINDOW,
})

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

// Register routes
app.register(healthRoutes)
app.register(authRoutes, { prefix: `${env.API_PREFIX}/auth` })
app.register(appointmentRoutes, { prefix: `${env.API_PREFIX}/appointments` })
app.register(doctorAvailabilityRoutes, { prefix: `${env.API_PREFIX}/doctor-availability` })
app.register(inquiryRoutes, { prefix: `${env.API_PREFIX}/inquiries` })
app.register(employeeRoutes, { prefix: `${env.API_PREFIX}/employees` })
app.register(attendanceRoutes, { prefix: `${env.API_PREFIX}/attendance` })
app.register(leaveRoutes, { prefix: `${env.API_PREFIX}/leaves` })
app.register(galleryRoutes, { prefix: `${env.API_PREFIX}/gallery` })
app.register(achievementRoutes, { prefix: `${env.API_PREFIX}/achievements` })
app.register(notificationRoutes, { prefix: `${env.API_PREFIX}/notifications` })
app.register(analyticsRoutes, { prefix: `${env.API_PREFIX}/analytics` })
app.register(todoRoutes, { prefix: `${env.API_PREFIX}/todos` })
app.register(noteRoutes, { prefix: `${env.API_PREFIX}/notes` })

// Error handler
app.setErrorHandler(errorHandler)

// 404 handler
app.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    success: false,
    message: "Route not found",
  })
})

export default app
