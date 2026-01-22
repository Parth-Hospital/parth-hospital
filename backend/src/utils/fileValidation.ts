import sharp from "sharp"

// Allowed MIME types for images
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const

// Allowed file extensions
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const

// Maximum file size (5MB for images)
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Maximum image dimensions
export const MAX_IMAGE_WIDTH = 5000
export const MAX_IMAGE_HEIGHT = 5000

// Minimum image dimensions
export const MIN_IMAGE_WIDTH = 10
export const MIN_IMAGE_HEIGHT = 10

export interface FileValidationResult {
  isValid: boolean
  error?: string
  metadata?: {
    width: number
    height: number
    format: string
    size: number
  }
}

/**
 * Validate file MIME type
 */
export function validateMimeType(mimetype: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimetype.toLowerCase() as any)
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))
  return ALLOWED_EXTENSIONS.includes(ext as any)
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE
}

/**
 * Validate image file using magic number (file signature) and Sharp
 * This provides comprehensive validation:
 * - Checks actual file content (not just extension/MIME type)
 * - Validates image dimensions
 * - Ensures file is a valid image
 */
export async function validateImageFile(
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<FileValidationResult> {
  // 1. Validate MIME type
  if (!validateMimeType(mimetype)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    }
  }

  // 2. Validate file extension
  if (!validateFileExtension(filename)) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
    }
  }

  // 3. Validate file size
  if (!validateFileSize(buffer.length)) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // 4. Validate magic number (file signature) - first few bytes
  const magicNumber = buffer.slice(0, 12).toString("hex").toUpperCase()
  const isValidMagicNumber =
    magicNumber.startsWith("FFD8FF") || // JPEG
    magicNumber.startsWith("89504E47") || // PNG
    magicNumber.startsWith("52494646") || // WebP (RIFF)
    magicNumber.startsWith("57454250") // WebP (WEBP)

  if (!isValidMagicNumber) {
    return {
      isValid: false,
      error: "Invalid file format. File signature does not match image format.",
    }
  }

  try {
    // 5. Validate and get image metadata using Sharp
    const metadata = await sharp(buffer).metadata()

    if (!metadata.width || !metadata.height) {
      return {
        isValid: false,
        error: "Unable to read image dimensions. File may be corrupted.",
      }
    }

    // 6. Validate dimensions
    if (metadata.width < MIN_IMAGE_WIDTH || metadata.height < MIN_IMAGE_HEIGHT) {
      return {
        isValid: false,
        error: `Image dimensions too small. Minimum: ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px`,
      }
    }

    if (metadata.width > MAX_IMAGE_WIDTH || metadata.height > MAX_IMAGE_HEIGHT) {
      return {
        isValid: false,
        error: `Image dimensions too large. Maximum: ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px`,
      }
    }

    // 7. Validate format matches MIME type
    const format = metadata.format?.toLowerCase()
    const expectedFormat = mimetype.split("/")[1]?.toLowerCase()

    if (format && expectedFormat && format !== expectedFormat && format !== "jpeg" && expectedFormat !== "jpg") {
      return {
        isValid: false,
        error: "File format does not match MIME type. Possible file type mismatch.",
      }
    }

    return {
      isValid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format || "unknown",
        size: buffer.length,
      },
    }
  } catch (error: any) {
    return {
      isValid: false,
      error: `Invalid image file: ${error.message || "Unable to process image"}`,
    }
  }
}

/**
 * Sanitize filename to prevent directory traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  let sanitized = filename.replace(/^.*[\\/]/, "")
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "")
  
  // Remove special characters except dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, "_")
  
  // Limit length
  sanitized = sanitized.substring(0, 255)
  
  return sanitized
}
