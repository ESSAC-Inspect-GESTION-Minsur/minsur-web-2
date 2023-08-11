import { FieldType } from './enums/field-type.enum'

export interface Field {
  id: string
  name: string
  placeholder?: string
  type: FieldType
  values: string[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface FieldDto extends Pick<Field, 'name' | 'placeholder' | 'type' | 'values'> {}

export const FIELD_INITIAL_STATE: Field = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

export const FIELD_DTO_INITIAL_STATE: FieldDto = {
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  values: []
}
