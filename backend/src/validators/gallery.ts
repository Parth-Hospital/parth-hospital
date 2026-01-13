import { z } from "zod"

export const createGallerySchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  title: z.string().optional(),
  description: z.string().optional(),
  albumId: z.string().optional(),
}).refine((data) => {
  // Title is required only if not part of an album
  if (!data.albumId && !data.title) {
    return false
  }
  return true
}, {
  message: "Title is required for single images",
  path: ["title"],
})

export const createAlbumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
})

export const updateGallerySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
})

export const updateAlbumSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
})

export type CreateGalleryInput = z.infer<typeof createGallerySchema>
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>