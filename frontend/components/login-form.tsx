"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import { getDashboardRoute } from "@/lib/auth"

type LoginStep = "selection" | "role" | "credentials"
type LoginType = "employee" | "admin"
type AdminRole = "doctor" | "manager" | "accountant" | "receptionist" | null

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>("selection")
  const [loginType, setLoginType] = useState<LoginType | null>(null)
  const [adminRole, setAdminRole] = useState<AdminRole>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSelection = (type: LoginType) => {
    setLoginType(type)
    setError("")
    if (type === "employee") {
      setStep("credentials")
    } else {
      setStep("role")
    }
  }

  const handleRoleSelection = (role: AdminRole) => {
    setAdminRole(role)
    setError("")
    setStep("credentials")
  }

  const handleBack = () => {
    setError("")
    if (step === "credentials") {
      setStep(loginType === "employee" ? "selection" : "role")
    } else if (step === "role") {
      setStep("selection")
    }
  }

  const fillDemoCredentials = () => {
    // Fill with test credentials from seed
    setEmail("doctor@parthhospital.co.in")
    setPassword("doctor123")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      // Call real API
      const response = await authApi.login({ email, password })

      // Map backend role to frontend role format
      const roleMap: Record<string, string> = {
        DOCTOR: "doctor",
        MANAGER: "manager",
        ACCOUNTANT: "accountant",
        RECEPTIONIST: "receptionist",
        EMPLOYEE: "employee",
      }

      let frontendRole = roleMap[response.user.role] || "employee"

      // Validate role match if admin role was selected
      if (loginType === "admin" && adminRole) {
        if (frontendRole !== adminRole) {
          setError(
            `Invalid credentials for ${adminRole} role. Please use ${adminRole} credentials or select the correct role.`
          )
          setIsLoading(false)
          return
        }
      }

      // Validate role match if employee was selected
      // Allow MANAGER, ACCOUNTANT, RECEPTIONIST, and EMPLOYEE to access employee dashboard
      // when using employee credentials (adminEmail)
      if (loginType === "employee") {
        const allowedEmployeeRoles = ["employee", "manager", "accountant", "receptionist"]
        if (!allowedEmployeeRoles.includes(frontendRole)) {
          setError(
            `These credentials are for ${frontendRole} role. Please use "Admin Login" and select "${frontendRole}" instead.`
          )
          setIsLoading(false)
          return
        }
        // For MANAGER/ACCOUNTANT/RECEPTIONIST using employee credentials, redirect to employee dashboard
        // The role in the token will still be their admin role, but they're accessing employee dashboard
        if (frontendRole !== "employee") {
          // Override the role to "employee" for dashboard routing purposes
          frontendRole = "employee"
        }
      }

      // Store user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)
      }

      // Get dashboard route and redirect
      const dashboardRoute = getDashboardRoute(frontendRole as any)
      router.push(dashboardRoute)
    } catch (err: any) {
      // Log authentication errors for debugging (development only)
      if (process.env.NODE_ENV === "development") {
        console.error("Login error:", {
          message: err.message,
          email: email.substring(0, 3) + "***", // Partial email for privacy
        })
      }
      // Always show "Invalid email or password" for any authentication failure
      // This includes: wrong email, wrong password, invalid email format, user not found, etc.
      setError("Invalid email or password. Please check your credentials and try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="space-y-4 px-0">
        <div className="flex items-center justify-between">
          {step !== "selection" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
        <CardTitle className="text-4xl font-medium tracking-tight">
          {step === "selection" && "Welcome Back"}
          {step === "role" && "Select Admin Role"}
          {step === "credentials" && `${loginType === "admin" ? (adminRole ? adminRole.charAt(0).toUpperCase() + adminRole.slice(1) : "Admin") : "Employee"} Login`}
        </CardTitle>
        <CardDescription className="text-lg font-light text-muted-foreground">
          {step === "selection" && "Select your access level to continue to the portal."}
          {step === "role" && "Choose your specific administrative role."}
          {step === "credentials" && "Enter your identification details below."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-6">
        {step === "selection" && (
          <div className="grid gap-4">
            <button
              onClick={() => handleSelection("employee")}
              className="group flex items-center justify-between p-8 rounded-2xl bg-white border border-border/50 hover:border-primary/20 hover:bg-secondary/20 transition-all text-left soft-depth"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary">Employee Login</h4>
                  <p className="text-sm text-muted-foreground">Access your daily dashboard</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleSelection("admin")}
              className="group flex items-center justify-between p-8 rounded-2xl bg-primary text-white hover:scale-[1.02] transition-all text-left soft-depth"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Admin Login</h4>
                  <p className="text-sm text-white/60">Manage hospital operations</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/60 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}

        {step === "role" && (
          <div className="grid grid-cols-2 gap-4">
            {["doctor", "manager", "accountant", "receptionist"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelection(role as AdminRole)}
                className="p-6 rounded-2xl bg-white border border-border/50 hover:border-accent hover:bg-accent/5 transition-all text-center group soft-depth"
              >
                <span className="text-lg font-bold text-primary group-hover:text-accent transition-colors capitalize">
                  {role}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === "credentials" && (
          <form onSubmit={handleLogin} noValidate className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-14 bg-secondary/20 border-none rounded-xl px-6 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Password</Label>
                <button type="button" className="text-xs font-bold text-accent hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-14 bg-secondary/20 border-none rounded-xl px-6 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-full text-lg bg-primary hover:scale-[1.02] transition-all soft-depth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Authorizing..." : "Authorize Access"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
