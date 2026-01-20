import DOMPurify from "isomorphic-dompurify"
import validator from "validator"

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous HTML tags and attributes while preserving safe formatting
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return ""
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Sanitize plain text - removes HTML and escapes special characters
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") {
    return ""
  }

  // Remove HTML tags
  const withoutHtml = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
  
  // Escape special characters
  return validator.escape(withoutHtml)
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return ""
  }

  // Normalize and validate email
  const normalized = validator.normalizeEmail(email)
  
  if (!normalized || !validator.isEmail(normalized)) {
    throw new Error("Invalid email address")
  }

  return normalized
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") {
    return ""
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "")
  
  // Validate length (assuming 10-digit Indian phone numbers)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    throw new Error("Invalid phone number format")
  }

  return digitsOnly
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return ""
  }

  // Validate and sanitize URL
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new Error("Invalid URL format")
  }

  return validator.escape(url)
}

/**
 * Sanitize user input for database storage
 * Removes null bytes, trims whitespace, and limits length
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "")
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length
  sanitized = sanitized.substring(0, maxLength)
  
  return sanitized
}

/**
 * Sanitize object with string values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: {
    sanitizeHtml?: boolean
    maxLength?: number
  } = {}
): T {
  const { sanitizeHtml: shouldSanitizeHtml = false, maxLength = 1000 } = options

  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      if (shouldSanitizeHtml) {
        sanitized[key] = sanitizeHtml(sanitized[key]) as any
      } else {
        sanitized[key] = sanitizeInput(sanitized[key], maxLength) as any
      }
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key], options) as any
    }
  }

  return sanitized
}
