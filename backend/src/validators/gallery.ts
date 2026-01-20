import { z } from "zod"

export const createGallerySchema = z.object({
  imageUrl: z.string().url("Invalid image URL").max(500),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
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
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().max(500).optional(),
})

export const updateGallerySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
})

export const updateAlbumSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().max(500).optional(),
})

export type CreateGalleryInput = z.infer<typeof createGallerySchema>
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>