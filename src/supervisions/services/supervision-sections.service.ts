import { type SupervisionSectionDto, type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import { AppServices } from '@/shared/service/api.service'
import { type FieldSectionDto, type FieldSection } from '../models/field-section.interface'

export class SupervisionSectionsService extends AppServices {
  constructor () {
    super({ baseUrl: 'supervision-sections', contentType: 'application/json' })
  }

  findAll = async (): Promise<SupervisionSection[]> => {
    return await this.get<SupervisionSection[]>('')
      .then(response => response.data)
  }

  create = async (group: SupervisionSectionDto): Promise<SupervisionSection> => {
    const { templateId, ...groupDto } = group
    return await this.post<SupervisionSection>('', groupDto, {
      params: {
        templateId
      }
    })
      .then(response => response.data)
  }

  update = async (group: SupervisionSectionDto, id: string): Promise<SupervisionSection> => {
    const { templateId, ...groupDto } = group
    return await this.patch<SupervisionSection>(`/${id}`, groupDto)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<SupervisionSection> => {
    return await this.delete<SupervisionSection>(`/${id}`)
      .then(response => response.data)
  }

  findAllFields = async (sectionId: string): Promise<FieldSection[]> => {
    return await this.get<FieldSection[]>(`/${sectionId}/fields`)
      .then(response => response.data)
  }

  assignField = async (sectionId: string, fieldId: string, groupFieldDto: FieldSectionDto): Promise<FieldSection> => {
    const { sectionId: _, fieldId: __, ...groupField } = groupFieldDto

    return await this.post<FieldSection>(`/${sectionId}/fields/${fieldId}`, groupField)
      .then(response => response.data)
  }

  updateField = async (sectionId: string, fieldId: string, groupFieldDto: FieldSectionDto): Promise<FieldSection> => {
    const { sectionId: _, fieldId: __, ...groupField } = groupFieldDto
    return await this.patch<FieldSection>(`/${sectionId}/fields/${fieldId}`, groupField)
      .then(response => response.data)
  }

  deleteField = async (sectionId: string, fieldId: string): Promise<FieldSection> => {
    return await this.delete<FieldSection>(`/${sectionId}/fields/${fieldId}`)
      .then(response => response.data)
  }
}
