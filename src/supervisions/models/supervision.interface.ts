import { VEHICLE_INITIAL_STATE, type Vehicle } from '@/vehicles/models/vehicle.interface'
import { TEMPLATE_INITIAL_STATE, type SupervisionTemplate } from './supervision-template.interface'
import { FUEL_STATUS } from './enums/fuel.enum'
import { STATUS } from './enums/status.enum'
import { type FieldValue } from '../types/field-value'
import { type VehicleDescription } from '../types/vehicle-information'
import { type SupervisionProfile } from './supervision-profile.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import { type WheelsDescription } from '../types/wheels-description'

export interface Supervision {
  id: string
  code: string
  location: string
  timeStart: string
  timeEnd: string
  materialType: string
  userCompany: string
  vehicleDescription: VehicleDescription
  message: string
  status: STATUS
  towerCode: string
  fuel: FUEL_STATUS
  vehicleClassification: string
  fieldValues: FieldValue[]
  wheelsDescription: WheelsDescription

  isFull: boolean
  hasDifferentOwner: boolean
  hasDoubleLicensePlate: boolean

  template: SupervisionTemplate
  vehicle: Vehicle
  cart: Vehicle | null
  supervisionProfiles: SupervisionProfile[]
  checkpointGroups: CheckpointGroup[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export const SUPERVISION_INITIAL_STATE: Supervision = {
  id: '',
  code: '',
  location: '',
  timeStart: '',
  timeEnd: '',
  materialType: '',
  vehicleClassification: '',
  userCompany: '',
  vehicleDescription: {
    company: '',
    contractor: '',
    owner: null,
    sponsor: ''
  },
  wheelsDescription: {
    numberOfWheels: 0,
    wheels: []
  },
  message: '',
  status: STATUS.OK,
  towerCode: '',
  fuel: FUEL_STATUS.FULL,
  fieldValues: [],
  isFull: false,
  hasDifferentOwner: false,
  hasDoubleLicensePlate: false,
  template: TEMPLATE_INITIAL_STATE,
  vehicle: VEHICLE_INITIAL_STATE,
  cart: null,
  supervisionProfiles: [],
  checkpointGroups: [],
  createdAt: '',
  updatedAt: '',
  active: true
}
