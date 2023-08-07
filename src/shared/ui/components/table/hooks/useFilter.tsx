import { useEffect, useState } from 'react'

interface UseFilteredValueReturn {
  filterValue: string
  setFilterValue: (filterValue: string) => void
}

export const useFilter = ({ showFilter }: { showFilter: boolean }): UseFilteredValueReturn => {
  const [filterValue, setFilterValue] = useState<string>('')

  useEffect(() => {
    setFilterValue('')
  }, [showFilter])

  return {
    filterValue,
    setFilterValue
  }
}
