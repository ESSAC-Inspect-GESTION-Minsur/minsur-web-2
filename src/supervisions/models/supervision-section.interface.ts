export interface SupervisionSection {
  id: string
  name: string
  templateId: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface SupervisionSectionDto extends Pick<SupervisionSection, 'name'> {
  templateId: string
}

export const SECTION_DTO_INITIAL_STATE: SupervisionSectionDto = {
  name: '',
  templateId: ''
}
