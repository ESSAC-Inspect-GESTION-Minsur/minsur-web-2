import React, { type ReactElement, useMemo, useState, useEffect } from 'react'
import Filter from './TableFilter'
import Pagination from './Pagination'
import TableBody from './TableBody'
import TableContext from './TableContext'
import TableHeader from './TableHeader'
import { type SortDirection, type Column, type TableProps } from './types'
import ConfigSection from './ConfigSection'
import { usePage } from './hooks/usePage'
import { useFilter } from './hooks/useFilter'
import { useSelectedColumns } from './hooks/useSelectedColumns'

const Table = ({
  data,
  columns,
  pagination,
  showFilter = true,
  actions = [],
  initialSortDirection = 'asc',
  selectedColumn = '',
  onRowClick,
  animatedRow = '',
  setAnimatedRow = () => { },
  defaultSortColumnId = '',
  selectable = false,
  setDataFiltered = () => { }
}: TableProps): ReactElement => {
  const { filterValue, setFilterValue } = useFilter({ showFilter })
  const { page, pageCount, pageSize, tablePagination, setPage, setPageSize, setPageCount } = usePage({ data, pagination })
  const { selectedColumns, setSelectedColumns } = useSelectedColumns({ columns })

  const [filterColumn, setFilterColumn] = useState<Column<any> | null>(null)
  const [sortColumn, setSortColumn] = useState<Column<any> | null>(getDefaultSortColumn)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection)

  function getDefaultSortColumn (): Column<any> | null {
    const defaultSortColumn = columns.find(column => column.id === defaultSortColumnId)

    const firstColumn = columns[0] ? columns[0] : null

    return defaultSortColumn ?? firstColumn
  }

  useEffect(() => {
    setFilterColumn(selectedColumns[0] ?? null)
  }, [selectedColumns])

  const filteredData = useMemo(() => {
    let filtered = data

    if (filterValue) {
      filtered = data.filter(a => filterColumn?.filterFunc(a).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()))
      setPageCount(Math.ceil(filtered.length / pageSize))
    } else {
      setPageCount(Math.ceil(data.length / pageSize))
    }

    if (sortColumn) {
      const sort = sortDirection === 'asc' ? 1 : -1
      const filteredSorted = [...filtered]
      filteredSorted.sort((a, b) => {
        const order = sortColumn.sortFunc !== undefined ? sortColumn.sortFunc(a, b) : 1
        return order * sort
      })

      filtered = [...filteredSorted]
    }

    setDataFiltered(filtered)

    if (pageSize !== 0) {
      const firstIndex = page * pageSize
      const lastIndex = (firstIndex + pageSize) > filtered.length ? filtered.length : (firstIndex + pageSize)
      filtered = filtered.slice(firstIndex, lastIndex)
    }

    return filtered
  }, [data, filterValue, filterColumn, sortColumn, sortDirection, page, pageSize])

  return (

    <div className='mb-6'>
      <TableContext.Provider value={{
        data: filteredData,
        columns: selectedColumns,
        filterValue,
        setFilterValue,
        filterColumn,
        setFilterColumn,
        sortColumn,
        setSortColumn,
        sortDirection,
        setSortDirection,
        pageCount,
        page,
        setPage,
        pageSize,
        setPageSize,
        selectedColumn,
        animatedRow,
        setAnimatedRow,
        selectable,
        setSelectedColumns
      }}>
       { showFilter && <div className='flex items-center gap-2 mt-5 mb-4'>
          <div className='flex-1'>
            <Filter />
          </div>
          <ConfigSection columns={columns}/>
        </div>}

        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full'>
            <div className='overflow-hidden'>
              <table className='min-w-full text-center'>
                <TableHeader hasActions={actions.length > 0} />
                <TableBody
                  actions={actions}
                  onRowClick={onRowClick} />
              </table>
            </div>
          </div>
        </div>

        {pagination && <Pagination pagination={tablePagination} />}
      </TableContext.Provider>
    </div>

  )
}

export default Table
