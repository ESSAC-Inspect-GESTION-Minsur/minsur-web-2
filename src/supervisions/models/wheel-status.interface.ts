export interface WheelStatus {
  id: string
  status: string
}

export interface WheelStatusDto extends Pick<WheelStatus, 'status'> {}

export const WHEEL_STATUS_INITIAL_STATE = {
  id: '',
  status: ''
}

export const WHEEL_STATUS_DTO_INITIAL_STATE = {
  status: ''
}
