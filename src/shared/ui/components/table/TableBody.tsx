import React, { useContext, type ReactElement } from 'react'
import TableContext from './TableContext'
import { type Data, type Action } from './types'

interface TableBodyProps<T> {
  actions: Array<Action<T>>
  onRowClick?: (entity: T) => void
}

const TableBody = <T extends Data,>({ actions, onRowClick }: TableBodyProps<T>): ReactElement => {
  const { selectedColumn, data, columns } = useContext(TableContext)

  const onClick = (entity: any): void => {
    if (onRowClick) {
      onRowClick(entity)
    }
  }

  return (
    <tbody>
      {
        data.map((value, index) => {
          return (
            <tr key={index} onClick={() => { onClick(value) }}
              className={`${String(value.id) === selectedColumn ? 'bg-gray-200' : 'bg-white '} border-b ${onRowClick ? 'transition duration-300 ease-in-out hover:bg-gray-200 cursor-pointer' : ''} 
            [&>td]:text-sm [&>td]:text-gray-900 [&>td]:px-6 [&>td]:py-4 [&>td]:max-w-[320px]`}>

              {
                columns?.map((column, index) => (
                  <td key={index}><p className="line-clamp-2">{column.render(value)}</p></td>
                ))
              }

              {actions.length > 0 &&
                (
                  <td>
                    <div className='flex justify-center items-center gap-2 py-3'>
                      {
                        actions?.map((action, index) => (
                          <div key={index} onClick={() => { action.actionFunc(value) }}>
                            {
                              action.icon(value)
                            }
                          </div>
                        ))
                      }
                    </div>

                  </td>
                )
              }
            </tr>
          )
        })
      }
    </tbody>
  )
}

export default TableBody
