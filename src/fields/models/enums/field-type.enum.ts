export enum FieldType {
  TEXT = 'text',
  LIST = 'list',
  NUMBER = 'number',
  CHECK = 'check',
  DATE = 'date'
}

export const FieldTypeText: Record<FieldType, string> = {
  [FieldType.TEXT]: 'Texto',
  [FieldType.NUMBER]: 'Número',
  [FieldType.DATE]: 'Fecha',
  [FieldType.CHECK]: 'Check',
  [FieldType.LIST]: 'Lista'
}

export const TextFieldTypes: Record<string, FieldType> = {
  Texto: FieldType.TEXT,
  Número: FieldType.NUMBER,
  Fecha: FieldType.DATE,
  Check: FieldType.CHECK,
  Lista: FieldType.LIST
}
