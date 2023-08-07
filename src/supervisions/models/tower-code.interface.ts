export interface TowerCode {
  id: string
  code: string
}

export interface TowerCodeDto extends Pick<TowerCode, 'code'> {}

export const TOWER_CODE_INITIAL_STATE = {
  id: '',
  code: ''
}

export const TOWER_CODE_DTO_INITIAL_STATE = {
  code: ''
}
