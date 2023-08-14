import { type Company } from '../../companies/models/company.interface'
import { type License } from './types/license'

export interface Profile {
  id: string
  name: string
  lastName: string
  dni: string
  phone1: string | null
  phone2: string | null
  email: string | null
  firstLicense: License
  secondLicense: License
  removed: boolean

  fullName: string
  isDriver: boolean

  companies: Company[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ProfileDto extends Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'active' | 'companies' > {}

export const PROFILE_INITIAL_STATE: Profile = {
  id: '',
  name: '',
  lastName: '',
  dni: '',
  phone1: '',
  phone2: '',
  email: '',
  firstLicense: {
    license: '',
    category: '',
    expiration: new Date().toISOString()
  },
  secondLicense: {
    license: null,
    category: null,
    expiration: null
  },
  removed: false,
  isDriver: false,
  fullName: '',
  companies: [],
  createdAt: '',
  updatedAt: '',
  active: true
}

export const PROFILE_DTO_INITIAL_STATE: ProfileDto = {
  name: '',
  lastName: '',
  dni: '',
  phone1: '',
  phone2: '',
  email: '',
  firstLicense: {
    license: '',
    category: '',
    expiration: new Date().toISOString()
  },
  secondLicense: {
    license: null,
    category: null,
    expiration: null
  },
  isDriver: false,
  removed: false
}
