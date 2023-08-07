import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { type Project } from '@/users/models/project.interface'
import { useEffect, useState } from 'react'

export const useTemplateGroupToAssign = (project: Project | null): [
  TemplateGroup[]
] => {
  const [templateGroups, setTemplateGroups] = useState<TemplateGroup[]>([])

  useEffect(() => {
    const templateGroupsService = new TemplateGroupsService()

    void templateGroupsService.findAll()
      .then((response) => {
        const aux = response.filter((templateGroup) => templateGroup.project === null)

        const actualTemplateGroups = project?.templateGroups ?? []

        const actualTemplateGroupsIds = actualTemplateGroups.map((templateGroup) => templateGroup.id)

        const templateGroupsFiltered = aux.filter((templateGroup) => !actualTemplateGroupsIds.includes(templateGroup.id))
        setTemplateGroups(templateGroupsFiltered)
      })
  }, [project])

  return [
    templateGroups
  ]
}
