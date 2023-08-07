import { useEffect, useState } from 'react'

interface UsePageProps {
  pagination?: number[]
  data: any[]
}

interface UsePageReturn {
  tablePagination: number[]
  pageCount: number
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
  setPageCount: (pageCount: number) => void
}

export const usePage = ({ pagination, data }: UsePageProps): UsePageReturn => {
  const [pageCount, setPageCount] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(0)
  const [page, setPage] = useState<number>(0)

  const [tablePagination, setTablePagination] = useState<number[]>([])

  useEffect(() => {
    const paginationWithOutNegatives = pagination ? pagination.filter(pageSize => pageSize > 0) : []
    paginationWithOutNegatives.sort((a, b) => a - b)

    setTablePagination(paginationWithOutNegatives)
    setPageSize(paginationWithOutNegatives[0] ?? 0)
  }, [])

  useEffect(() => {
    setPage(0)
    setPageCount(Math.ceil(data.length / pageSize))
  }, [pageSize])

  return {
    tablePagination,
    pageCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    setPageCount
  }
}
