/**
 * Simple password validation utility for frontend
 * Returns validation result with error message
 */
export function validatePassword(password: string): {
  isValid: boolean
  error?: string
} {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    }
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password must be less than 128 characters",
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    }
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    }
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    }
  }

  return { isValid: true }
}
