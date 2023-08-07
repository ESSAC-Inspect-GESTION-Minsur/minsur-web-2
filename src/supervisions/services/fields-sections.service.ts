import { AppServices } from '@/shared/service/api.service'
import { type FieldSectionDto, type FieldSection } from '../models/field-section.interface'

export class FieldsSectionsService extends AppServices {
  constructor () {
    super({ baseUrl: 'sections', contentType: 'application/json' })
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
