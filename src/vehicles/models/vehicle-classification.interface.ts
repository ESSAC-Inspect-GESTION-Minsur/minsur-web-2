export interface VehicleClassification {
  id: string
  name: string
}

export interface VehicleClassificationDto extends Pick<VehicleClassification, 'name'> {}

export const VEHICLE_CLASSIFICATION_INITIAL_STATE = {
  id: '',
  name: ''
}

export const VEHICLE_CLASSIFICATION_DTO_INITIAL_STATE = {
  name: ''
}
