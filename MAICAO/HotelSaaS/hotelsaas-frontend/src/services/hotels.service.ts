import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type { CreateHotelRequest, Hotel, UpdateHotelRequest } from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const hotelsService = {
  async getAll(params?: PaginationParams & { city?: string; country?: string; isActive?: boolean }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<Hotel>>>(
      ENDPOINTS.hotels.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Hotel>>(ENDPOINTS.hotels.byId(id))
    return unwrapData(response.data)
  },

  async create(data: CreateHotelRequest) {
    const response = await apiClient.post<ApiResponse<Hotel>>(ENDPOINTS.hotels.base, data)
    return unwrapData(response.data)
  },

  async update(id: string, data: UpdateHotelRequest) {
    const response = await apiClient.put<ApiResponse<Hotel>>(ENDPOINTS.hotels.byId(id), data)
    return unwrapData(response.data)
  },

  async delete(id: string) {
    await apiClient.delete(ENDPOINTS.hotels.byId(id))
  },

  async uploadImages(id: string, files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const response = await apiClient.post<ApiResponse<Hotel>>(
      ENDPOINTS.hotels.images(id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return unwrapData(response.data)
  },
}
