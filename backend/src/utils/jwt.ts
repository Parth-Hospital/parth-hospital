import jwt from "jsonwebtoken"
import { env } from "@/config/env"
import { AuthUser } from "@/middleware/auth"

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  )
}

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, env.JWT_SECRET) as AuthUser
}
