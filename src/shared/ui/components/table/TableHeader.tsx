import React, { type ReactElement, useContext } from 'react'
import TableContext from './TableContext'
import { SortIconAsc, SortIconDesc } from './Icons/SortIcons'
import { type Column } from './types'

interface TableHeaderProps {
  hasActions: boolean
}

const TableHeader = ({ hasActions }: TableHeaderProps): ReactElement => {
  const { sortColumn, sortDirection, setSortColumn, setSortDirection, columns } = useContext(TableContext)

  const onClick = (newColumn: Column<any>): void => {
    if (newColumn.sortFunc === undefined) {
      return
    }

    if (sortColumn?.id === newColumn.id) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortColumn(newColumn)
  }

  const sortIcon = (): React.ReactElement => {
    const className = ' w-6 h-6'
    return sortDirection === 'asc' ? <SortIconAsc className={className} /> : <SortIconDesc className={className} />
  }

  return (
    <thead className='border-b bg-black text-left text-xs leading-4 font-medium uppercase tracking-wider text-white' >
      <tr>

        {
          columns?.map((column, index) => (
            <th key={index} onClick={() => { onClick(column) }} className={`text-sm  px-6 py-4 capitalize font-semibold ${column.sortFunc !== undefined ? 'cursor-pointer' : ''}`}>
              <p className='flex items-center justify-center gap-4 text-center'>
                {column.columnName.toUpperCase()}
                {(sortColumn?.id === column.id) && sortIcon()}
              </p>
            </th>
          ))
        }
        {
          hasActions && <th className='text-sm font-medium px-6 py-4 capitalize'><p className='flex items-center justify-center'>ACCIONES</p> </th>
        }
      </tr>
    </thead>
  )
}

export default TableHeader
