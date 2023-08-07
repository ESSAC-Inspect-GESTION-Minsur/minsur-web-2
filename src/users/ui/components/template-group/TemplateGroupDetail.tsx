import React, { useContext, type ReactElement } from 'react'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { toast } from 'react-toastify'
import { ProjectContext } from '../../contexts/ProjectContext'

interface TemplateGroupsDetailProps {
  templateGroups: TemplateGroup[]
  handleRemove: (id: string) => void
}

const TemplateGroupsDetail = ({ templateGroups, handleRemove }: TemplateGroupsDetailProps): ReactElement => {
  const { toastId } = useContext(ProjectContext)

  const onHandleRemove = (id: string): void => {
    const confirm = window.confirm('¿Está seguro de desasignar el grupo de checklist?')

    if (!confirm) return

    const templateGroupService = new TemplateGroupsService()

    void templateGroupService.removeProject(id)
      .then(() => {
        handleRemove(id)
        toast('Grupo de checklist desasignado correctamente', { type: 'success', toastId })
      })
  }

  return (
    <div className='flex gap-2'>
      {
        templateGroups.map(templateGroup => (
          <div key={templateGroup.id}
            className='flex flex-col gap-2 bg-black text-white px-6 py-4 rounded-lg text-center items-center justify-center'>
            <p className='px-2 uppercase'>{templateGroup.name}</p>
            <div className='flex gap-3 px-2'>
              <DeleteIcon className='cursor-pointer w-5 h-5' onClick={() => { onHandleRemove(templateGroup.id) }} />
            </div>
          </div>
        ))
      }
      {templateGroups.length <= 0 && (<p>No hay grupo de checklist asignados</p>)}
    </div>

  )
}

export default TemplateGroupsDetail
