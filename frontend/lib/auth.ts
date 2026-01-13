// Authentication utility for demo credentials
export const DEMO_CREDENTIALS = {
  email: "vercel@gmail.com",
  password: "Vercel123",
}

export type UserRole = "employee" | "owner" | "manager" | "accountant" | "receptionist"

export interface AuthSession {
  email: string
  role: UserRole
  loginType: "employee" | "admin"
}

// Validate credentials against demo credentials
export function validateCredentials(email: string, password: string): boolean {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
}

// Get dashboard route based on role
export function getDashboardRoute(role: UserRole): string {
  if (role === "employee") {
    return "/dashboard/employee"
  }
  return `/dashboard/admin/${role}`
}

// Store auth session in localStorage
export function setAuthSession(session: AuthSession): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authSession", JSON.stringify(session))
  }
}

// Get auth session from localStorage
export function getAuthSession(): AuthSession | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("authSession")
    return session ? JSON.parse(session) : null
  }
  return null
}

// Clear auth session from localStorage
export function clearAuthSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authSession")
  }
}
