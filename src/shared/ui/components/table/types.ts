import { type ReactElement } from 'react'

export interface Data {
  id: number | string
}

export type SortDirection = 'asc' | 'desc'

type FilterType = 'text' | 'date'

export interface Column<T> {
  id: string
  columnName: string
  filterFunc: (entity: T) => string
  filterType?: FilterType
  sortFunc?: (a: T, b: T) => number
  render: (entity: T) => React.ReactElement | string
}

export interface Action<T> {
  icon: (entity: T) => React.ReactNode
  actionFunc: (entity: T) => void
}

export interface PaginationButton {
  disabled: boolean
  onClick: () => void
  icon: ReactElement
}

export interface TableProps {
  data: any[]
  columns: Array<Column<any>>
  pagination?: number[]
  showFilter?: boolean
  actions?: Array<Action<any>>
  initialSortDirection?: SortDirection
  selectedColumn?: string
  onRowClick?: (entity: any) => void
  animatedRow?: ''
  setAnimatedRow?: (row: string) => void
  defaultSortColumnId?: string
  selectable?: boolean
  setDataFiltered?: (data: any[]) => void
}
