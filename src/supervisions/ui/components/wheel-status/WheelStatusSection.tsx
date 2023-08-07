import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import ContextMenu from '@/shared/ui/components/ContextMenu'
import Divider from '@/shared/ui/components/Divider'
import { type WheelStatusDto, type WheelStatus } from '@/supervisions/models/wheel-status.interface'
import { WheelStatusService } from '@/supervisions/services/wheel-status.service'
import React, { useState, type ReactElement, useEffect, type FormEvent, useRef } from 'react'

const WheelStatusSection = (): ReactElement => {
  const [wheelStatus, setWheelStatus, addWheelStatus, , removeWheelStatus] = useArrayReducer<WheelStatus>([])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const wheelStatusRef = useRef<WheelStatus | null>(null)

  const [contextMenuPos, setContextMenuPos] = useState<{ xPos: number, yPos: number } | null>(null)

  useEffect(() => {
    const wheelStatusService = new WheelStatusService()

    void wheelStatusService.findAll()
      .then(setWheelStatus)
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const wheelStatusForm: WheelStatusDto = {
      status: formData.get('status') as string
    }

    const wheelStatusService = new WheelStatusService()

    void wheelStatusService.create(wheelStatusForm)
      .then((wheelStatus) => {
        addWheelStatus(wheelStatus)
        setIsAdding(false)
      })
  }

  const handleRemove = (): void => {
    if (wheelStatusRef.current === null) return

    const id = wheelStatusRef.current.id

    const wheelStatusService = new WheelStatusService()
    void wheelStatusService.remove(id)
      .then(() => {
        removeWheelStatus(id)
      })
  }

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const xPos = event.clientX
    const yPos = event.clientY
    setContextMenuPos({ xPos, yPos })
  }

  const handleCloseContextMenu = (): void => {
    setContextMenuPos(null)
  }

  return (
    <div className='shadow-card p-4 rounded-md mb-4'>
      <div className='flex justify-between items-center'>
        <h2 className='uppercase font-semibold text-xl'>Estado de Neumáticos</h2>
        <Button color='primary' onClick={() => { setIsAdding(true) }}>Añadir</Button>
      </div>

      <Divider className='mt-2' />

      <div className='flex gap-3 flex-wrap'>
        {
          wheelStatus.map((wheelStatus) => (
            <div
              onContextMenu={(event) => {
                wheelStatusRef.current = wheelStatus
                handleRightClick(event)
              }}
              className='bg-gray-200 p-2 px-3 rounded-md'
              key={wheelStatus.id}>
              <p>{wheelStatus.status}</p>
            </div>
          ))
        }
      </div>

      {
        isAdding && (
          <div>
            <Divider />
            <form onSubmit={onSubmit}>
              <label className='block font-semibold mb-2' htmlFor='status'>Estado</label>
              <input
                className='block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
                id='status' type="text" name='status' />

              <div className='flex gap-2 mt-2'>
                <Button color='primary' type='submit'>Confirmar</Button>
                <Button color='secondary' onClick={() => { setIsAdding(false) }}>Cancelar</Button>
              </div>
            </form>
          </div>

        )
      }

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

export default WheelStatusSection
