import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types'

export function unwrapData<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new Error(response.message || 'Request failed')
  }
  return response.data
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message

  const axiosError = error as AxiosError<ApiResponse<unknown>>
  if (axiosError.response?.data?.message) return axiosError.response.data.message
  if (axiosError.response?.data?.errors?.length) {
    return axiosError.response.data.errors.join(', ')
  }
  if (axiosError.message) return axiosError.message

  return 'An unexpected error occurred'
}

export function buildQueryParams(
  params: Record<string, unknown> | object,
): Record<string, string> {
  const record = params as Record<string, unknown>
  const query: Record<string, string> = {}
  Object.entries(record).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = String(value)
    }
  })
  return query
}
