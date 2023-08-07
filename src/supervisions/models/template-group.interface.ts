import { type Project } from '@/users/models/project.interface'
import { type SupervisionTemplate } from './supervision-template.interface'

export interface TemplateGroup {
  id: string
  name: string

  templates: SupervisionTemplate[]
  project: Project | null

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface TemplateGroupDto extends Pick<TemplateGroup, 'name'> {}

export const TEMPLATE_GROUP_DTO_INITIAL_STATE = {
  name: ''
}
