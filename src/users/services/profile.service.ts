import { AppServices } from '@/shared/service/api.service'
import { type ProfileDto, type Profile } from '../models/profile.interface'

export class ProfilesService extends AppServices {
  constructor () {
    super({ baseUrl: 'profiles', contentType: 'application/json' })
  }

  findAll = async (): Promise<Profile[]> => {
    return await this.get<Profile[]>('')
      .then(response => response.data)
  }

  create = async (profile: ProfileDto, userId: string): Promise<Profile> => {
    return await this.post<Profile>(`?userId=${userId}`, profile)
      .then(response => response.data)
  }

  findRemovedByDni = async (dni: string): Promise<{ find: boolean }> => {
    return await this.get<{ find: boolean }>(`/dni/${dni}`)
      .then(response => response.data)
  }

  findById = async (id: string): Promise<Profile> => {
    return await this.get<Profile>(`/id/${id}`)
      .then(response => response.data)
  }

  updateByDni = async (profileDto: ProfileDto | { removed: boolean }, dni: string): Promise<Profile> => {
    return await this.patch<Profile>(`/dni/${dni}`, profileDto)
      .then(response => response.data)
  }

  update = async (profile: ProfileDto, id: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}`, profile)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Profile> => {
    return await this.delete<Profile>(`/${id}`)
      .then(response => response.data)
  }

  assignCompany = async (id: string, companyId: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}/assign-company/${companyId}`)
      .then(response => response.data)
  }

  removeCompany = async (id: string, companyId: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}/remove-company/${companyId}`)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}/toggle-active`)
      .then(response => response.data)
  }
}
