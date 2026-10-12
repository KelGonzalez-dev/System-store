import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth'
import { unwrapData } from '@/utils/api-helpers'

export const authService = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.login, data)
    return unwrapData(response.data)
  },

  async register(data: RegisterRequest) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.register, data)
    return unwrapData(response.data)
  },

  async refresh(accessToken: string, refreshToken: string) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.refresh, {
      accessToken,
      refreshToken,
    })
    return unwrapData(response.data)
  },

  async logout() {
    await apiClient.post<ApiResponse<null>>(ENDPOINTS.auth.logout)
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.auth.forgotPassword,
      data,
    )
    return response.data
  },

  async resetPassword(data: ResetPasswordRequest) {
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.auth.resetPassword,
      data,
    )
    return response.data
  },
}
