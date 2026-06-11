export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: string[] | null
  timestamp: string
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
  search?: string
}

export interface ApiError {
  message: string
  errors?: string[]
  status?: number
}
