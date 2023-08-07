import React, { type ReactElement } from 'react'
import Divider from '../components/Divider'
import RitraContentSection from '@/supervisions/ui/components/ritra-content/RitraContentSection'
import TowerCodeSection from '@/supervisions/ui/components/tower-code/TowerCodeSection'
import VehicleClassificationSection from '@/vehicles/ui/components/vehicle-classification/VehicleClassificationSection'
import WheelStatusSection from '@/supervisions/ui/components/wheel-status/WheelStatusSection'

const ConfigPage = (): ReactElement => {
  return (
    <div>
      <h1 className='uppercase font-semibold text-2xl'>Página de Configuración</h1>
      <Divider className='mt-1'/>
      <RitraContentSection />
      <TowerCodeSection />
      <VehicleClassificationSection />
      <WheelStatusSection />
    </div>
  )
}

export default ConfigPage
