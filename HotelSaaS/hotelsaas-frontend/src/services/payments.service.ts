import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types'
import type {
  CreatePaymentRequest,
  Payment,
  RefundPaymentRequest,
} from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const paymentsService = {
  async getAll(
    params?: PaginationParams & {
      reservationId?: string
      status?: number
      method?: number
    },
  ) {
    const response = await apiClient.get<ApiResponse<PagedResponse<Payment>>>(
      ENDPOINTS.payments.base,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Payment>>(ENDPOINTS.payments.byId(id))
    return unwrapData(response.data)
  },

  async create(data: CreatePaymentRequest) {
    const response = await apiClient.post<ApiResponse<Payment>>(ENDPOINTS.payments.base, data)
    return unwrapData(response.data)
  },

  async refund(id: string, data: RefundPaymentRequest) {
    const response = await apiClient.post<ApiResponse<Payment>>(
      ENDPOINTS.payments.refund(id),
      data,
    )
    return unwrapData(response.data)
  },
}
