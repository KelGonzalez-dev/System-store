import { useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useDebounce } from './useDebounce'

export function usePagination(initialPageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  return {
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    debouncedSearch,
    params: { page, pageSize, search: debouncedSearch || undefined },
  }
}
