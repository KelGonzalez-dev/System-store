import { apiClient } from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type {
  DashboardStats,
  OccupancyReport,
  ReportQuery,
  RevenueReport,
} from '@/types/entities'
import { buildQueryParams, unwrapData } from '@/utils/api-helpers'

export const reportsService = {
  async getDashboardStats(hotelId?: string) {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      ENDPOINTS.dashboard.stats,
      { params: hotelId ? { hotelId } : undefined },
    )
    return unwrapData(response.data)
  },

  async getRevenue(params?: ReportQuery) {
    const response = await apiClient.get<ApiResponse<RevenueReport>>(
      ENDPOINTS.reports.revenue,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },

  async getOccupancy(params?: ReportQuery) {
    const response = await apiClient.get<ApiResponse<OccupancyReport>>(
      ENDPOINTS.reports.occupancy,
      { params: buildQueryParams(params ?? {}) },
    )
    return unwrapData(response.data)
  },
}
