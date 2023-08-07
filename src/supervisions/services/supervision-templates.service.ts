import { AppServices } from '@/shared/service/api.service'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { type SupervisionTemplateDto, type SupervisionTemplate } from '../models/supervision-template.interface'
import { type SupervisionSection } from '../models/supervision-section.interface'
import { type FieldSection } from '../models/field-section.interface'

export class SupervisionTemplatesService extends AppServices {
  constructor () {
    super({ baseUrl: 'supervision-templates', contentType: 'application/json' })
  }

  findAll = async (): Promise<SupervisionTemplate[]> => {
    return await this.get<SupervisionTemplate[]>('')
      .then(response => response.data)
  }

  findAllSections = async (id: string): Promise<SupervisionSection[]> => {
    return await this.get<SupervisionSection[]>(`/${id}/sections`)
      .then(response => response.data)
  }

  findAllFieldSections = async (id: string): Promise<FieldSection[]> => {
    return await this.get<FieldSection[]>(`/${id}/fields`)
      .then(response => response.data)
  }

  findAllVehicleTypes = async (id: string): Promise<VehicleType[]> => {
    return await this.get<VehicleType[]>(`/${id}/vehicle-types`)
      .then(response => response.data)
  }

  create = async (template: SupervisionTemplateDto): Promise<SupervisionTemplate> => {
    return await this.post<SupervisionTemplate>('', template)
      .then(response => response.data)
  }

  update = async (template: SupervisionTemplateDto, id: string): Promise<SupervisionTemplate> => {
    return await this.patch<SupervisionTemplate>(`/${id}`, template)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<SupervisionTemplate> => {
    return await this.patch<SupervisionTemplate>(`/${id}/toggle-active`)
      .then(response => response.data)
  }

  assignVehicleType = async (templateId: string, vehicleTypeId: string): Promise<SupervisionTemplate> => {
    return await this.post<SupervisionTemplate>(`/${templateId}/vehicle-types/${vehicleTypeId}`)
      .then(response => response.data)
  }

  removeVehicleType = async (templateId: string, vehicleTypeId: string): Promise<SupervisionTemplate> => {
    return await this.delete<SupervisionTemplate>(`/${templateId}/vehicle-types/${vehicleTypeId}`)
      .then(response => response.data)
  }
}
