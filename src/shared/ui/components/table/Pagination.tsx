import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { BackIcon, DoubleBackIcon, DoubleForwardIcon, ForwardIcon } from './Icons/PaginationIcons'
import TableContext from './TableContext'
import { type PaginationButton } from './types'

interface PaginationProps {
  pagination: number[]
}

const Pagination = ({ pagination }: PaginationProps): ReactElement => {
  const { page, pageCount, pageSize, setPage, setPageSize } = useContext(TableContext)
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false)
  const [canNextPage, setCanNextPage] = useState<boolean>(true)

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(pageCount)
    }
    setCanPreviousPage(page - 1 > -1)
    setCanNextPage(page + 1 < pageCount)
  }, [page, pageCount])
  const goToPage = (page: number): void => {
    setPage(page)
  }

  const nextPage = (): void => {
    setPage(page + 1)
  }

  const previousPage = (): void => {
    setPage(page - 1)
  }

  const buttons: PaginationButton[] = [
    {
      disabled: canPreviousPage,
      onClick: () => { goToPage(0) },
      icon: <DoubleBackIcon className='text-gray-700 w-5 h-5' />
    },
    {
      disabled: canPreviousPage,
      onClick: () => { previousPage() },
      icon: <BackIcon className='text-gray-700 w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { nextPage() },
      icon: <ForwardIcon className='text-gray-700 w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { goToPage(pageCount - 1) },
      icon: <DoubleForwardIcon className='text-gray-700 w-5 h-5' />
    }
  ]

  return (
    <footer>
      <div className="text-sm w-full text-gray-700 flex items-center justify-end mt-4 gap-4 md:flex-row">
        <div className='flex items-center'>
          <p className='w-24'>Rows per page:</p>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
            className='cursor-pointer border-b border-solid border-gray-400 outline-none md:w-auto'
          >
            {pagination.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-4 md:w-auto'>
          <div className='flex gap-2'>
            {
              buttons.map(({ disabled, icon, onClick }, i) => (
                <div key={i}
                  className={`h-9 w-9 grid place-items-center rounded-full px-2 transition-all duration-500 ${disabled ? 'hover:bg-gray-300 cursor-pointer' : 'opacity-40 cursor-default'}`}
                >
                  <button
                    onClick={onClick} disabled={!disabled}>
                    {icon}
                  </button>
                </div>

              ))
            }
          </div>
          <span>
            Página{' '}
            <strong>
              {page + 1} of {pageCount}
            </strong>
          </span>
        </div>
      </div>
    </footer>

  )
}

export default Pagination
