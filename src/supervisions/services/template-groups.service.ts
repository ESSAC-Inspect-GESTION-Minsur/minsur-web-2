import { AppServices } from '@/shared/service/api.service'
import { type TemplateGroupDto, type TemplateGroup } from '@/supervisions/models/template-group.interface'

export class TemplateGroupsService extends AppServices {
  constructor () {
    super({ baseUrl: 'template-groups', contentType: 'application/json' })
  }

  findAll = async (): Promise<TemplateGroup[]> => {
    return await this.get<TemplateGroup[]>('')
      .then(response => response.data)
  }

  findById = async (): Promise<TemplateGroup> => {
    return await this.get<TemplateGroup>('')
      .then(response => response.data)
  }

  create = async (group: TemplateGroupDto): Promise<TemplateGroup> => {
    return await this.post<TemplateGroup>('', group)
      .then(response => response.data)
  }

  assignTemplate = async (id: string, reportTypeId: string): Promise<TemplateGroup> => {
    return await this.patch<TemplateGroup>(`/${id}/assign-template/${reportTypeId}`)
      .then(response => response.data)
  }

  removeTemplate = async (id: string, reportTypeId: string): Promise<TemplateGroup> => {
    return await this.patch<TemplateGroup>(`/${id}/remove-template/${reportTypeId}`)
      .then(response => response.data)
  }

  assignProject = async (id: string, projectId: string): Promise<TemplateGroup> => {
    return await this.patch<TemplateGroup>(`/${id}/assign-project/${projectId}`)
      .then(response => response.data)
  }

  removeProject = async (id: string): Promise<TemplateGroup> => {
    return await this.patch<TemplateGroup>(`/${id}/remove-project`)
      .then(response => response.data)
  }

  update = async (group: TemplateGroupDto, id: string): Promise<TemplateGroup> => {
    return await this.patch<TemplateGroup>(`/${id}`, group)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<TemplateGroup> => {
    return await this.delete<TemplateGroup>(`/${id}`)
      .then(response => response.data)
  }
}
