interface Wheel {
  position: string
  status: string
}

export interface WheelsDescription {
  numberOfWheels: number
  wheels: Wheel[]
}
