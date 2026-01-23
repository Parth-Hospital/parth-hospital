/**
 * Production-safe logging utility
 * Only logs in development mode
 */

const isDevelopment = process.env.NODE_ENV === "development"

export const logger = {
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
}
