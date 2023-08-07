import { FIELD_INITIAL_STATE, type Field } from '@/fields/models/field.interface'
import { PRIORITY } from './enums/priority.enum'

export interface FieldSection {
  id: string
  fieldId: string
  sectionId: string
  field: Field
  priority: PRIORITY
}

export interface FieldSectionDto extends Omit<FieldSection, 'id' | 'field' > {}

export const FIELD_SECTION_INITIAL_STATE: FieldSection = {
  id: '',
  fieldId: '',
  sectionId: '',
  field: FIELD_INITIAL_STATE,
  priority: PRIORITY.LOW
}

export const FIELD_SECTION_DTO_INITIAL_STATE: FieldSectionDto = {
  fieldId: '',
  sectionId: '',
  priority: PRIORITY.LOW
}
