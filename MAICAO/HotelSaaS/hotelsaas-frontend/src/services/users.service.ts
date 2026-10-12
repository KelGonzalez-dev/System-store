import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type { CreateUserRequest, UpdateUserRequest, User, UserProfile } from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const usersService = {
  async getAll(params?: PaginationParams & { isActive?: boolean; roleId?: string }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<User>>>(
      ENDPOINTS.users.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.users.byId(id))
    return unwrapData(response.data)
  },

  async create(data: CreateUserRequest) {
    const response = await apiClient.post<ApiResponse<User>>(ENDPOINTS.users.base, data)
    return unwrapData(response.data)
  },

  async update(id: string, data: UpdateUserRequest) {
    const response = await apiClient.put<ApiResponse<User>>(ENDPOINTS.users.byId(id), data)
    return unwrapData(response.data)
  },

  async delete(id: string) {
    await apiClient.delete(ENDPOINTS.users.byId(id))
  },

  async getProfile() {
    const response = await apiClient.get<ApiResponse<UserProfile>>(ENDPOINTS.users.profile)
    return unwrapData(response.data)
  },

  async updateProfile(data: { firstName: string; lastName: string; phone?: string }) {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      ENDPOINTS.users.profile,
      data,
    )
    return unwrapData(response.data)
  },

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      ENDPOINTS.users.avatar,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return unwrapData(response.data)
  },
}
