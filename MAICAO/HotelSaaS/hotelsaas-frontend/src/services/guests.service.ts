import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type { CreateGuestRequest, Guest, Reservation } from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const guestsService = {
  async getAll(params?: PaginationParams) {
    const response = await apiClient.get<ApiResponse<PagedResponse<Guest>>>(
      ENDPOINTS.guests.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Guest>>(ENDPOINTS.guests.byId(id))
    return unwrapData(response.data)
  },

  async create(data: CreateGuestRequest) {
    const response = await apiClient.post<ApiResponse<Guest>>(ENDPOINTS.guests.base, data)
    return unwrapData(response.data)
  },

  async update(id: string, data: CreateGuestRequest) {
    const response = await apiClient.put<ApiResponse<Guest>>(ENDPOINTS.guests.byId(id), data)
    return unwrapData(response.data)
  },

  async delete(id: string) {
    await apiClient.delete(ENDPOINTS.guests.byId(id))
  },

  async getHistory(id: string) {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      ENDPOINTS.guests.history(id),
    )
    return unwrapData(response.data)
  },
}
