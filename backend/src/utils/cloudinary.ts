import cloudinary from "@/config/cloudinary"
import { UploadApiResponse } from "cloudinary"

export interface UploadOptions {
  folder?: string
  resourceType?: "image" | "video" | "raw" | "auto"
  transformation?: any[]
}

export const uploadToCloudinary = async (
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "parth-hospital",
      resource_type: options.resourceType || "auto",
      ...(options.transformation && { transformation: options.transformation }),
    }

    if (Buffer.isBuffer(file)) {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error)
          else resolve(result as UploadApiResponse)
        })
        .end(file)
    } else {
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) reject(error)
        else resolve(result as UploadApiResponse)
      })
    }
  })
}

export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  return cloudinary.uploader.destroy(publicId)
}
