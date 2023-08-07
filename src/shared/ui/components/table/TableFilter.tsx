import React, { type ReactElement, useContext } from 'react'
import TableContext from './TableContext'

const Filter = (): ReactElement => {
  const { filterValue, setFilterValue, filterColumn, setFilterColumn, columns } = useContext(TableContext)

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setFilterValue(value)
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    const column = columns.find(column => column.id === value)
    setFilterColumn(column ?? null)
    setFilterValue('')
  }

  return (

    <div className='flex items-end gap-5'>
      <div className='grid grid-cols-filter w-3/4'>

        <input
          type={filterColumn?.filterType ?? 'text'}
          value={filterValue}
          className='block w-full h-10 px-2 border-b border-solid border-gray-300 outline-none'
          placeholder='Ingresa el valor a filtrar'
          onChange={onInputChange}
        />
      </div>
      <div className='w-1/4'>
        <select
          value={filterColumn?.id}
          onChange={onSelectChange}
          className='block w-full h-10 px-2 border-b border-solid border-gray-300 outline-none uppercase'
        >
          {
            columns.map(column => (
              <option key={column.id} value={column.id}>{column.columnName.toUpperCase()}</option>
            ))
          }
        </select>
      </div>
    </div>

  )
}

export default Filter
