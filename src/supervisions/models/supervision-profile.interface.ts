import { type Profile } from '../../users/models/profile.interface'

export interface SupervisionProfile {
  profileId: string
  supervisionId: string
  role: string
  supervisor: boolean
  profile: Profile
}
