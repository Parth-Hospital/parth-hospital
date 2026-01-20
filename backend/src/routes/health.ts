import { FastifyInstance } from "fastify"

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (_request, reply) => {
    // Minimal health check - no sensitive information
    return reply.send({
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  })
}
