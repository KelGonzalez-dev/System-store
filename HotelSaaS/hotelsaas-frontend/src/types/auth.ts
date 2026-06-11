export interface AuthResponse {
  userId: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
  expiresAt: string
  roles: string[]
  permissions: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface RefreshTokenRequest {
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface AuthUser {
  userId: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  expiresAt: string
}
