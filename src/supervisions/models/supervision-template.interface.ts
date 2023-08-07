import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { type SupervisionSection } from './supervision-section.interface'

export interface SupervisionTemplate {
  id: string
  name: string

  sections: SupervisionSection[]
  vehicleTypes: VehicleType[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface SupervisionTemplateDto extends Pick<SupervisionTemplate, 'name'> {}

export const TEMPLATE_DTO_INITIAL_STATE: SupervisionTemplateDto = {
  name: ''
}

export const TEMPLATE_INITIAL_STATE: SupervisionTemplate = {
  id: '',
  name: '',
  sections: [],
  vehicleTypes: [],
  createdAt: '',
  updatedAt: '',
  active: true
}
