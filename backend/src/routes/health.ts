import { FastifyInstance } from "fastify"

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (_request, reply) => {
    return reply.send({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    })
  })
}
