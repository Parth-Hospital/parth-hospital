import { FastifyRequest, FastifyReply } from "fastify"
import { GalleryService } from "@/services/gallery.service"
import { updateGallerySchema, createAlbumSchema, updateAlbumSchema } from "@/validators/gallery"
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary"

const galleryService = new GalleryService()

export class GalleryController {
  // Create single image
  async createGallery(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file()
      if (!data) {
        return reply.status(400).send({
          success: false,
          message: "Image file is required",
        })
      }

      const buffer = await data.toBuffer()
      const title = (data.fields.title as any)?.value || ""
      const description = (data.fields.description as any)?.value || ""
      const albumId = (data.fields.albumId as any)?.value || null

      // Title is required only for single images (not in albums)
      if (!albumId && !title) {
        return reply.status(400).send({
          success: false,
          message: "Title is required for single images",
        })
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(buffer, {
        folder: "parth-hospital/gallery",
        resourceType: "image",
      })

      const uploadedBy = request.user?.id

      const gallery = await galleryService.createGallery(
        {
          imageUrl: uploadResult.secure_url,
          title: title || undefined,
          description: description || undefined,
          albumId: albumId || undefined,
        },
        uploadedBy
      )

      return reply.status(201).send({
        success: true,
        data: gallery,
        message: "Gallery image added successfully",
      })
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to create gallery",
      })
    }
  }

  // Create album
  async createAlbum(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createAlbumSchema.parse(request.body)
      const uploadedBy = request.user?.id

      const album = await galleryService.createAlbum(body, uploadedBy)

      return reply.status(201).send({
        success: true,
        data: album,
        message: "Album created successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to create album",
      })
    }
  }

  // Get all galleries (images and albums)
  async getGalleries(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await galleryService.getGalleries()

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch galleries",
      })
    }
  }

  // Get single image
  async getGalleryById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const gallery = await galleryService.getGalleryById(id)

      if (!gallery) {
        return reply.status(404).send({
          success: false,
          message: "Gallery not found",
        })
      }

      return reply.send({
        success: true,
        data: gallery,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch gallery",
      })
    }
  }

  // Get album by ID
  async getAlbumById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const album = await galleryService.getAlbumById(id)

      if (!album) {
        return reply.status(404).send({
          success: false,
          message: "Album not found",
        })
      }

      return reply.send({
        success: true,
        data: album,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch album",
      })
    }
  }

  // Get album images
  async getAlbumImages(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { albumId } = request.params as { albumId: string }

      const images = await galleryService.getAlbumImages(albumId)

      return reply.send({
        success: true,
        data: images,
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to fetch album images",
      })
    }
  }

  // Update single image
  async updateGallery(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateGallerySchema.parse(request.body)

      const gallery = await galleryService.updateGallery(id, body)

      return reply.send({
        success: true,
        data: gallery,
        message: "Gallery updated successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to update gallery",
      })
    }
  }

  // Update album
  async updateAlbum(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = updateAlbumSchema.parse(request.body)

      const album = await galleryService.updateAlbum(id, body)

      return reply.send({
        success: true,
        data: album,
        message: "Album updated successfully",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          errors: error.errors,
        })
      }

      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to update album",
      })
    }
  }

  // Delete single image
  async deleteGallery(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      // Get gallery to extract Cloudinary public_id
      const gallery = await galleryService.getGalleryById(id)
      if (gallery) {
        // Extract public_id from Cloudinary URL
        const urlParts = gallery.imageUrl.split("/")
        const publicIdWithExt = urlParts.slice(-2).join("/").split(".")[0]
        const publicId = `parth-hospital/gallery/${publicIdWithExt}`

        // Delete from Cloudinary
        try {
          await deleteFromCloudinary(publicId)
        } catch (cloudinaryError) {
          // Log but don't fail if Cloudinary delete fails
          console.error("Failed to delete from Cloudinary:", cloudinaryError)
        }
      }

      await galleryService.deleteGallery(id)

      return reply.send({
        success: true,
        message: "Gallery deleted successfully",
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to delete gallery",
      })
    }
  }

  // Delete album (cascades to images)
  async deleteAlbum(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      // Get album to delete cover image from Cloudinary if exists
      const album = await galleryService.getAlbumById(id)
      if (album?.coverImageUrl) {
        try {
          const urlParts = album.coverImageUrl.split("/")
          const publicIdWithExt = urlParts.slice(-2).join("/").split(".")[0]
          const publicId = `parth-hospital/gallery/${publicIdWithExt}`
          await deleteFromCloudinary(publicId)
        } catch (cloudinaryError) {
          console.error("Failed to delete cover image from Cloudinary:", cloudinaryError)
        }
      }

      // Delete all images in album from Cloudinary
      if (album?.images) {
        for (const image of album.images) {
          try {
            const urlParts = image.imageUrl.split("/")
            const publicIdWithExt = urlParts.slice(-2).join("/").split(".")[0]
            const publicId = `parth-hospital/gallery/${publicIdWithExt}`
            await deleteFromCloudinary(publicId)
          } catch (cloudinaryError) {
            console.error("Failed to delete image from Cloudinary:", cloudinaryError)
          }
        }
      }

      await galleryService.deleteAlbum(id)

      return reply.send({
        success: true,
        message: "Album deleted successfully",
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to delete album",
      })
    }
  }
}
