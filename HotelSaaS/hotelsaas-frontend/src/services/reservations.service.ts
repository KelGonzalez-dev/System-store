import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type { CreateReservationRequest, Reservation } from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const reservationsService = {
  async getAll(
    params?: PaginationParams & {
      hotelId?: string
      guestId?: string
      status?: number
      fromDate?: string
      toDate?: string
    },
  ) {
    const response = await apiClient.get<ApiResponse<PagedResponse<Reservation>>>(
      ENDPOINTS.reservations.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.byId(id),
    )
    return unwrapData(response.data)
  },

  async create(data: CreateReservationRequest) {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.base,
      data,
    )
    return unwrapData(response.data)
  },

  async confirm(id: string) {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.confirm(id),
    )
    return unwrapData(response.data)
  },

  async cancel(id: string, reason?: string) {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.cancel(id),
      { reason },
    )
    return unwrapData(response.data)
  },

  async checkIn(id: string) {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.checkIn(id),
    )
    return unwrapData(response.data)
  },

  async checkOut(id: string) {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      ENDPOINTS.reservations.checkOut(id),
    )
    return unwrapData(response.data)
  },
}
