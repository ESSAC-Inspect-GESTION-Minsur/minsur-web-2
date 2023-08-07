export interface RitraContent {
  id: string
  content: string
}

export interface RitraContentDto extends Pick<RitraContent, 'content'> {}

export const RITRA_CONTENT_INITIAL_STATE = {
  id: '',
  content: ''
}

export const RITRA_CONTENT_DTO_INITIAL_STATE = {
  content: ''
}
