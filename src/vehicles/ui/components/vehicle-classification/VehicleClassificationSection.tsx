import React, { type FormEvent, useEffect, useState, type ReactElement, useRef } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import { type VehicleClassification, type VehicleClassificationDto } from '@/vehicles/models/vehicle-classification.interface'
import { VehicleClassificationsService } from '@/vehicles/services/vehicle-classifications.service'
import Divider from '@/shared/ui/components/Divider'
import ContextMenu from '@/shared/ui/components/ContextMenu'

const VehicleClassificationSection = (): ReactElement => {
  const [vehicleClassifications, setVehicleClassifications, addVehicleClassification, , removeVehicleClassification] = useArrayReducer<VehicleClassification>([])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const vehicleClassificationRef = useRef<VehicleClassification | null>(null)
  const [contextMenuPos, setContextMenuPos] = useState<{ xPos: number, yPos: number } | null>(null)

  useEffect(() => {
    const vehicleClassificationsService = new VehicleClassificationsService()

    void vehicleClassificationsService.findAll()
      .then(setVehicleClassifications)
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const vehicleClassificationForm: VehicleClassificationDto = {
      name: formData.get('name') as string
    }

    const vehicleClassificationsService = new VehicleClassificationsService()

    void vehicleClassificationsService.create(vehicleClassificationForm)
      .then((vehicleClassification) => {
        addVehicleClassification(vehicleClassification)
        setIsAdding(false)
      })
  }

  const handleRemove = (): void => {
    if (vehicleClassificationRef.current === null) return

    const id = vehicleClassificationRef.current.id

    const vehicleClassificationService = new VehicleClassificationsService()
    void vehicleClassificationService.remove(id)
      .then(() => {
        removeVehicleClassification(id)
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
        <h2 className='uppercase font-semibold text-xl'>Clasificación de Vehículos</h2>
        <Button color='primary' onClick={() => { setIsAdding(true) }}>Añadir</Button>
      </div>

      <Divider className='mt-2' />

      <div className='flex gap-3 flex-wrap'>
        {
          vehicleClassifications.map((vehicleClassification) => (
            <div
              onContextMenu={(event) => {
                vehicleClassificationRef.current = vehicleClassification
                handleRightClick(event)
              }}
              className='bg-gray-200 p-2 px-3 rounded-md'
              key={vehicleClassification.id}>
              <p>{vehicleClassification.name}</p>
            </div>
          ))
        }
      </div>

      {
        isAdding && (
          <div>
            <Divider />
            <form onSubmit={onSubmit}>
              <label className='block font-semibold mb-2' htmlFor='name'>Nombre</label>
              <input
                className='block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
                id='name' type="text" name='name' />

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
          } />
      )}
    </div>
  )
}

export default VehicleClassificationSection
