import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import ContextMenu from '@/shared/ui/components/ContextMenu'
import Divider from '@/shared/ui/components/Divider'
import { type TowerCodeDto, type TowerCode } from '@/supervisions/models/tower-code.interface'
import { TowerCodesService } from '@/supervisions/services/tower-codes.service'
import React, { useState, type ReactElement, useEffect, type FormEvent, useRef } from 'react'

const TowerCodeSection = (): ReactElement => {
  const [towerCodes, setTowerCodes, addTowerCode, , removeTowerCode] = useArrayReducer<TowerCode>([])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const towerCodeRef = useRef<TowerCode | null>(null)

  const [contextMenuPos, setContextMenuPos] = useState<{ xPos: number, yPos: number } | null>(null)

  useEffect(() => {
    const towerCodesService = new TowerCodesService()

    void towerCodesService.findAll()
      .then(setTowerCodes)
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.target as HTMLFormElement)

    const towerCodeForm: TowerCodeDto = {
      code: formData.get('code') as string
    }

    const towerCodesService = new TowerCodesService()

    void towerCodesService.create(towerCodeForm)
      .then((towerCode) => {
        addTowerCode(towerCode)
        setIsAdding(false)
      }).finally(() => {
        setIsLoading(false)
      })
  }

  const handleRemove = (): void => {
    if (towerCodeRef.current === null) return

    setIsLoading(true)
    const id = towerCodeRef.current.id

    const towerCodesService = new TowerCodesService()
    void towerCodesService.remove(id)
      .then(() => {
        removeTowerCode(id)
      })
      .finally(() => {
        setIsLoading(false)
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
        <h2 className='uppercase font-semibold text-xl'>Códigos de Torre</h2>
        <Button color='primary' onClick={() => { setIsAdding(true) }}>Añadir</Button>
      </div>

      <Divider className='mt-2' />

      <div className='flex gap-3 flex-wrap'>
        {
          towerCodes.map((towerCode) => (
            <div
              onContextMenu={(event) => {
                towerCodeRef.current = towerCode
                handleRightClick(event)
              }}
              className='bg-gray-200 p-2 px-3 rounded-md'
              key={towerCode.id}>
              <p>{towerCode.code}</p>
            </div>
          ))
        }
      </div>

      {
        isAdding && (
          <div>
            <Divider />
            <form onSubmit={onSubmit}>
              <label className='block font-semibold mb-2' htmlFor='code'>Código</label>
              <input
                className='block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
                id='code' type="text" name='code' />

              <div className='flex gap-2 mt-2'>
                <Button color='primary' type='submit' isLoading={isLoading}>Confirmar</Button>
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

export default TowerCodeSection
