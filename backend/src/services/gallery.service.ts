import prisma from "@/config/database"
import { CreateGalleryInput, UpdateGalleryInput, CreateAlbumInput, UpdateAlbumInput } from "@/validators/gallery"

export class GalleryService {
  async createGallery(data: CreateGalleryInput, uploadedBy?: string) {
    return prisma.gallery.create({
      data: {
        imageUrl: data.imageUrl,
        title: data.title,
        description: data.description,
        albumId: data.albumId,
        uploadedBy,
      },
    })
  }

  async createAlbum(data: CreateAlbumInput, uploadedBy?: string) {
    return prisma.galleryAlbum.create({
      data: {
        title: data.title,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        uploadedBy,
      },
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
    return prisma.gallery.update({
      where: { id },
      data,
    })
  }

  async updateAlbum(id: string, data: UpdateAlbumInput) {
    return prisma.galleryAlbum.update({
      where: { id },
      data,
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
