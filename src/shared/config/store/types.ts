import { type DateRange } from '@/shared/types/date-range'
import { type Supervision } from '@/supervisions/models/supervision.interface'
import { type UserToStorage } from '@/users/models/user.interface'

export enum STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export interface AUTH_STATE {
  user: UserToStorage | null | undefined
  authenticated: boolean
  status: STATUS
}

export interface SUPERVISION_STATE {
  supervisions: Supervision[]
  dateRange: DateRange
  lastRequest: Date | null
  status: STATUS
}
