import prisma from "@/config/database"
import { CreateGalleryInput, UpdateGalleryInput, CreateAlbumInput, UpdateAlbumInput } from "@/validators/gallery"
import { sanitizeText, sanitizeInput } from "@/utils/sanitize"

export class GalleryService {
  async createGallery(data: CreateGalleryInput, uploadedBy?: string) {
    // Sanitize inputs
    const sanitizedData = {
      imageUrl: data.imageUrl,
      title: data.title ? sanitizeInput(data.title, 200) : null,
      description: data.description ? sanitizeText(data.description) : null,
      albumId: data.albumId || null,
      uploadedBy,
    }

    return prisma.gallery.create({
      data: sanitizedData,
    })
  }

  async createAlbum(data: CreateAlbumInput, uploadedBy?: string) {
    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeInput(data.title, 200),
      description: data.description ? sanitizeText(data.description) : null,
      coverImageUrl: data.coverImageUrl || null,
      uploadedBy,
    }

    return prisma.galleryAlbum.create({
      data: sanitizedData,
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
    })
  }

  async getGalleries() {
    // Get single images (not in albums) and albums
    const [images, albums] = await Promise.all([
      prisma.gallery.findMany({
        where: { albumId: null },
        orderBy: { createdAt: "desc" },
      }),
      prisma.galleryAlbum.findMany({
        include: {
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return { images, albums }
  }

  async getGalleryById(id: string) {
    return prisma.gallery.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            images: true,
          },
        },
      },
    })
  }

  async getAlbumById(id: string) {
    return prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
    })
  }

  async getAlbumImages(albumId: string) {
    return prisma.gallery.findMany({
      where: { albumId },
      orderBy: { createdAt: "asc" },
    })
  }

  async updateGallery(id: string, data: UpdateGalleryInput) {
    // Sanitize inputs
    const sanitizedData: any = {}
    if (data.title !== undefined) {
      sanitizedData.title = sanitizeInput(data.title, 200)
    }
    if (data.description !== undefined) {
      sanitizedData.description = sanitizeText(data.description)
    }

    return prisma.gallery.update({
      where: { id },
      data: sanitizedData,
    })
  }

  async updateAlbum(id: string, data: UpdateAlbumInput) {
    // Sanitize inputs
    const sanitizedData: any = {}
    if (data.title !== undefined) {
      sanitizedData.title = sanitizeInput(data.title, 200)
    }
    if (data.description !== undefined) {
      sanitizedData.description = sanitizeText(data.description)
    }
    if (data.coverImageUrl !== undefined) {
      sanitizedData.coverImageUrl = data.coverImageUrl || null
    }

    return prisma.galleryAlbum.update({
      where: { id },
      data: sanitizedData,
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
    })
  }

  async deleteGallery(id: string) {
    return prisma.gallery.delete({
      where: { id },
    })
  }

  async deleteAlbum(id: string) {
    // This will cascade delete all images in the album
    return prisma.galleryAlbum.delete({
      where: { id },
    })
  }
}
