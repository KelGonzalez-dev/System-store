import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type {
  CreateRoomRequest,
  Room,
  RoomAvailability,
  RoomType,
  UpdateRoomRequest,
} from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const roomsService = {
  async getAll(
    params?: PaginationParams & {
      hotelId?: string
      roomTypeId?: string
      status?: number
      isActive?: boolean
    },
  ) {
    const response = await apiClient.get<ApiResponse<PagedResponse<Room>>>(
      ENDPOINTS.rooms.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Room>>(ENDPOINTS.rooms.byId(id))
    return unwrapData(response.data)
  },

  async create(data: CreateRoomRequest) {
    const response = await apiClient.post<ApiResponse<Room>>(ENDPOINTS.rooms.base, data)
    return unwrapData(response.data)
  },

  async update(id: string, data: UpdateRoomRequest) {
    const response = await apiClient.put<ApiResponse<Room>>(ENDPOINTS.rooms.byId(id), data)
    return unwrapData(response.data)
  },

  async delete(id: string) {
    await apiClient.delete(ENDPOINTS.rooms.byId(id))
  },

  async getAvailability(params: {
    hotelId: string
    checkIn: string
    checkOut: string
    roomTypeId?: string
  }) {
    const response = await apiClient.get<ApiResponse<RoomAvailability[]>>(
      ENDPOINTS.rooms.availability,
      { params: buildQueryParams(params) },
    )
    return unwrapData(response.data)
  },

  async getRoomTypes(hotelId?: string) {
    const response = await apiClient.get<ApiResponse<RoomType[]>>(ENDPOINTS.roomTypes.base, {
      params: hotelId ? { hotelId } : undefined,
    })
    return unwrapData(response.data)
  },
}
