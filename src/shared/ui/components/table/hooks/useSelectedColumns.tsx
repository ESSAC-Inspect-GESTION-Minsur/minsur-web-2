import { useEffect, useState } from 'react'
import { type Column } from '../types'

interface UseSelectedColumnsReturn {
  selectedColumns: Array<Column<any>>
  setSelectedColumns: (selectedColumns: Array<Column<any>>) => void
}

export const useSelectedColumns = ({ columns }: { columns: Array<Column<any>> }): UseSelectedColumnsReturn => {
  const [selectedColumns, setSelectedColumns] = useState<Array<Column<any>>>([])

  useEffect(() => {
    let newColumns = columns
    if (columns.length > 5) {
      newColumns = columns.slice(0, 5)
    }

    setSelectedColumns(newColumns)
  }, [columns])

  return {
    selectedColumns,
    setSelectedColumns
  }
}
