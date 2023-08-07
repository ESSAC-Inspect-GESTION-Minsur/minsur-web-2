import React, { type ReactElement, useContext, useEffect } from 'react'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import AssignVehicleType from '@/supervisions/ui/components/vehicle-types/AssignVehicleType'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import VehicleTypesDetail from './VehicleTypesDetail'

const VehicleTypeComponent = (): ReactElement => {
  const { selectedTemplate: template } = useContext(TemplateContext)

  const [vehicleTypes, setVehicleTypes] = useArrayReducer<VehicleType>([])
  const [showAssignVehicleTypeModal, toggleShowAssignVehicleTypeModal] = useBooleanState()

  useEffect(() => {
    if (template === null) return

    const reportTypesService = new SupervisionTemplatesService()
    void reportTypesService.findAllVehicleTypes(template.id)
      .then(setVehicleTypes)
  }, [template])

  const update = (vehicleTypes: VehicleType[]): void => {
    setVehicleTypes(vehicleTypes)
  }

  return (
    <section>
      <div className='flex justify-between items-center mb-3'>
        <h2 className='uppercase font-bold text-lg'>Tipos de vehículos asignados al <span className='text-red'>checklist {template?.name}</span></h2>
        {template && <Button color='primary' className='mb-2' onClick={toggleShowAssignVehicleTypeModal}>Asignar Tipo de vehículo</Button>}
      </div>
      <VehicleTypesDetail vehicleTypes={vehicleTypes} update={update}/>
      <AssignVehicleType isOpen={showAssignVehicleTypeModal} onClose={toggleShowAssignVehicleTypeModal} templateVehicleTypes={vehicleTypes} update={update} />
    </section>

  )
}

export default VehicleTypeComponent
