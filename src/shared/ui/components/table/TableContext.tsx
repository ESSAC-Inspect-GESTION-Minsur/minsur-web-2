import React from 'react'
import { type Column, type SortDirection } from './types'

export interface TableContextInterface {
  data: any[]
  columns: Array<Column<any>>

  filterValue: string
  setFilterValue: (filterValue: string) => void

  filterColumn: Column<any> | null
  setFilterColumn: (column: Column<any> | null) => void

  sortColumn: Column<any> | null
  setSortColumn: (sortColumn: Column<any> | null) => void

  sortDirection: SortDirection
  setSortDirection: (sortDirection: SortDirection) => void

  pageCount: number

  pageSize: number
  setPageSize: (pageSize: number) => void

  page: number
  setPage: (page: number) => void

  selectedColumn: string

  animatedRow: string
  setAnimatedRow: (animatedRow: string) => void

  selectable: boolean

  setSelectedColumns: (selectedColumns: Array<Column<any>>) => void
}

const TableContext = React.createContext<TableContextInterface>({
  data: [],
  columns: [],
  filterValue: '',
  setFilterValue: () => { },
  filterColumn: null,
  setFilterColumn: () => { },
  sortColumn: null,
  setSortColumn: () => { },
  sortDirection: 'asc',
  setSortDirection: () => { },
  pageCount: 0,
  pageSize: 0,
  setPageSize: () => { },
  page: 0,
  setPage: () => { },
  selectedColumn: '',
  animatedRow: '',
  setAnimatedRow: () => { },
  selectable: false,
  setSelectedColumns: () => { }
})

export default TableContext
