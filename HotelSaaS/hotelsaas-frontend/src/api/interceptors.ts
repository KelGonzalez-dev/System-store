import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { apiClient } from './axios'
import { ENDPOINTS } from './endpoints'
import { useAuthStore } from '@/store/auth.store'
import type { ApiResponse } from '@/types'
import type { AuthResponse } from '@/types/auth'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else if (token) prom.resolve(token)
  })
  failedQueue = []
}

export function setupInterceptors() {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (!originalRequest) return Promise.reject(error)

      const isAuthEndpoint =
        originalRequest.url?.includes('/Auth/login') ||
        originalRequest.url?.includes('/Auth/register') ||
        originalRequest.url?.includes('/Auth/refresh-token')

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        const { accessToken, refreshToken, setAuth, logout } = useAuthStore.getState()

        if (!accessToken || !refreshToken) {
          logout()
          return Promise.reject(error)
        }

        try {
          const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
            ENDPOINTS.auth.refresh,
            { accessToken, refreshToken },
            { headers: { Authorization: undefined } },
          )

          if (!data.success || !data.data) throw new Error('Refresh failed')

          setAuth(data.data)
          processQueue(null, data.data.accessToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
          }
          return apiClient(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          logout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  )
}
