import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import { type Company } from '@/companies/models/company.interface'
import { type Profile } from '@/users/models/profile.interface'

export interface ExcelResponse {
  data: Profile[] | Vehicle[] | Company[]
  dataMissed: string[]
}
