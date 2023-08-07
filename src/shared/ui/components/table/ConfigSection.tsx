import React, { useContext, type ReactElement, useState, useEffect, useRef } from 'react'
import ConfigIcon from './Icons/ConfigIcon'
import TableContext from './TableContext'
import { type Column } from './types'
import Button from '../Button'

interface ConfigSectionProps {
  columns: Array<Column<any>>
}

const ConfigSection = ({ columns }: ConfigSectionProps): ReactElement => {
  const { columns: selectedColumns, setSelectedColumns } = useContext(TableContext)

  const [configColumns, setConfigColumns] = useState<Array<Column<any>>>(selectedColumns)
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)
  const configRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setConfigColumns(selectedColumns)
  }, [selectedColumns])

  const handleOutsideClick = (event: MouseEvent): void => {
    if (configRef.current && !configRef.current.contains(event.target as Node)) {
      setIsConfigOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (!isConfigOpen) {
      setConfigColumns(selectedColumns)
    }
  }, [isConfigOpen])

  const handleConfigOnClick = (): void => {
    setIsConfigOpen(!isConfigOpen)
  }

  const handleColumnOnClick = (column: Column<any>): void => {
    if (configColumns.includes(column)) {
      setConfigColumns(configColumns.filter((selectedColumn) => selectedColumn !== column))
      return
    }

    setConfigColumns([...configColumns, column])
  }

  const handleOnConfirm = (): void => {
    setSelectedColumns(configColumns)
    setIsConfigOpen(false)
  }

  return (
    <div className='relative' ref={configRef}>
      <ConfigIcon onClick={handleConfigOnClick} />
      <div
        className={`${isConfigOpen ? '' : 'hidden'} absolute z-10 top-8 right-0 bg-white border border-gray-300 rounded shadow-md min-w-[200px] px-4 py-2`}>
        <div className='flex flex-col gap-2 '>
          {
            columns.map((column, index) => (
              <div key={index} className='flex items-center justify-start gap-2'>
                <input type='checkbox' checked={configColumns.includes(column)} onChange={() => { handleColumnOnClick(column) }} />
                <label className='text-sm'>{column.columnName}</label>
              </div>
            ))
          }
        </div>
        <Button onClick={handleOnConfirm} disabled={configColumns.length === 0} color='primary' className='mt-2 text-sm px-4 py-1'>Confirmar</Button>
      </div>
    </div>
  )
}

export default ConfigSection
