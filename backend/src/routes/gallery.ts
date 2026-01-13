import { FastifyInstance } from "fastify"
import { GalleryController } from "@/controllers/gallery.controller"
import { verifyToken, requireRole } from "@/middleware/auth"

const galleryController = new GalleryController()

export default async function galleryRoutes(fastify: FastifyInstance) {
  // Public routes - Get galleries
  fastify.get("/", (request, reply) => galleryController.getGalleries(request, reply))
  fastify.get("/images/:id", (request, reply) => galleryController.getGalleryById(request, reply))
  fastify.get("/albums/:id", (request, reply) => galleryController.getAlbumById(request, reply))
  fastify.get("/albums/:albumId/images", (request, reply) => galleryController.getAlbumImages(request, reply))

  // Protected routes - Manage images
  fastify.post(
    "/images",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.createGallery(request, reply)
  )

  fastify.patch(
    "/images/:id",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.updateGallery(request, reply)
  )

  fastify.delete(
    "/images/:id",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.deleteGallery(request, reply)
  )

  // Protected routes - Manage albums
  fastify.post(
    "/albums",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.createAlbum(request, reply)
  )

  fastify.patch(
    "/albums/:id",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.updateAlbum(request, reply)
  )

  fastify.delete(
    "/albums/:id",
    { preHandler: [verifyToken, requireRole("OWNER", "MANAGER")] },
    (request, reply) => galleryController.deleteAlbum(request, reply)
  )
}
