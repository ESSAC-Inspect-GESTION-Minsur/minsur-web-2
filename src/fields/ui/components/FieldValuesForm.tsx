import Button from '@/shared/ui/components/Button'
import ContextMenu from '@/shared/ui/components/ContextMenu'
import React, { useState, type ReactElement } from 'react'

interface FieldValuesFormProps {
  values: string[]
  setValues: (values: string[]) => void
}

const FieldValuesForm = ({ values, setValues }: FieldValuesFormProps): ReactElement => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const valueRef = React.useRef<string>('')

  const [contextMenuPos, setContextMenuPos] = useState<{ xPos: number, yPos: number } | null>(null)

  const onSubmit = (): void => {
    const value = inputRef?.current?.value as string

    if (value.trim().length === 0 || values.includes(value)) {
      return
    }

    setValues([...values, value])
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.focus()
  }

  const handleCloseContextMenu = (): void => {
    setContextMenuPos(null)
  }

  const handleRemove = (): void => {
    const newValues = values.filter(v => v !== valueRef.current)
    setValues(newValues)
  }

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const xPos = event.clientX
    const yPos = event.clientY
    setContextMenuPos({ xPos, yPos })
  }

  return (
    <div>
      <p>Valores</p>
      <div className='flex gap-1 items-center'>
        <input ref={inputRef}
          className='block w-full h-8 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
          id='value' type="text" name='value' />

        <Button color='primary' onClick={onSubmit}>Añadir</Button>
      </div>

      <div className='flex gap-2 flex-wrap mt-2'>
        {
          values.map((value, index) => (
            <div
              onContextMenu={(event) => {
                valueRef.current = value
                handleRightClick(event)
              }}
              className='bg-gray-200 p-2 px-3 rounded-md'
              key={index}>

              <p>{value}</p>
            </div>
          ))
        }
      </div>

      {contextMenuPos && (
        <ContextMenu xPos={contextMenuPos.xPos} yPos={contextMenuPos.yPos} onClose={handleCloseContextMenu}
        options={
          {
            delete: handleRemove,
            edit: () => { }
          }
        }/>
      )}
    </div>
  )
}

export default FieldValuesForm
